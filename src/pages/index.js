//component 가져오기
import TodoList from "../components/TodoList";
import Calendar from "../components/Calendar";
import Feedback from "../components/Feedback";
import {Chat} from "@/components/Chat";

import React,{useState,useEffect,useRef} from "react";
import {useSession,signIn,signOut} from "next-auth/react";
import {useRouter} from "next/router";

import {db} from "@/firebase";
import {
  collection,
  query,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";

//일정 db - 필드 이름(타입) : userId(str) / userName(str) / content(str) / timeStart(timestamp) / timeEnd(timestamp) / progress(int)
const todoDB = collection(db,"todoDB");
//메시지 로그 db - 필드 이름(타입) : who(str) / log(str) / time(timestamp)
const messageDB = collection(db,"messageDB");

export default function Home() {

  //주소를 이동시킬 라우터
  const router = useRouter();
  //현재 사용자 세션 정보
  const { data } = useSession({
    required: true,
    onUnauthenticated() { //로그인이 되어있지 않으면 auth/signin 페이지로 이동
      router.replace("/auth/signin");
    },
  });

  //일정 배열 생성
  const [todos,setTodos]=useState([]);
  const [todoLoading,settodoLoading]=useState(true);

  //db 가져오기
  const getTodos = async()=>{
    // 유저별로 가져올 때 사용
    if (!data?.user?.name) return; //세션정보가 있고/유저가 있고/이름이 있으면 통과
    const q=query(
      todoDB,
      where("userId","==",data?.user?.id),
    )
    settodoLoading(true);
    const results=await getDocs(q);
    const newTodos=[];

    results.docs.forEach((doc)=>{
      const _timeStart=doc.data().timeStart.toDate();
      const _timeEnd=doc.data().timeEnd.toDate(); //firebase의 timestamp를 javascript 형식으로 변환
      newTodos.push({id:doc.id, ...doc.data(), timeStart:_timeStart, timeEnd:_timeEnd});
    });
    setTodos(newTodos);
    settodoLoading(false);
  }
  //db 추가하기(Id,이름,내용,시작날짜,종료날짜,진행도)
  const addTodos = async({_content,_timeStart,_timeEnd})=>{
    const docRef = await addDoc(todoDB,{
      userId:data?.user?.id,
      userName:data?.user?.name,
      content:_content,
      timeEnd:Timestamp.fromDate(new Date(_timeEnd)),
      timeStart:Timestamp.fromDate(new Date(_timeStart)),
      progress:0,
    });
    _timeStart=Timestamp.fromDate(new Date(_timeStart)).toDate();
    _timeEnd=Timestamp.fromDate(new Date(_timeEnd)).toDate();
    const newTodos=[...todos,{id:docRef.id,userId:data?.user?.id,userName:data?.user?.name,content:_content,timeStart:_timeStart,timeEnd:_timeEnd,progress:0}].sort((a,b)=>new Date(a.timeStart).getTime()-new Date(b.timeStart).getTime());
    setTodos(newTodos);
  };

  //db 수정
  const modiTodo = (id) => {
    const selected=todos.filter((todo)=>todo.id===id)[0]
    setItem(selected.item);setDate(selected.date);setbut("수정하기");
    setmodid(id);
  }

  //db삭제 - todos 배열 안에서 특정 속성으로 원하는 item을 찾는 함수 필요
  const delTodo=(id)=>{
    const todoDoc=doc(todoDB,id);
    deleteDoc(todoDoc);
    setTodos(
      todos.filter((todo)=>{
        return todo.id !==id;
      })
    )
  }
  //todos 배열 출력(확인용)
  const printTodos=(_todos)=>{
    console.log("todos",_todos);
    console.log("messages",messages);
  }

  //챗봇
  const [messages,setMessages]=useState([]);//메시지 로그 배열
  const [loading,setLoading]=useState(false);//메시지 로딩 중
  
  //정규표현식 함수
  const re_f=async(sent)=>{
    console.log("re_f",sent);
    const sentence=sent;
    //추가
    const pattern1 = /\[method:"(\w+)",timeStart:"([^"]+)",timeEnd:"([^"]+)",content:"([^"]+)"\]/;
    const match1 = sentence.match(pattern1);
    //삭제
    const pattern2 = /\[method:"(\w+)",timeStart:"([^"]+)",content:"([^"]+)"\]/;
    const match2 = sentence.match(pattern2);
    if (match1) {
      const method = match1[1];
      const timeStart = match1[2];
      const timeEnd = match1[3];
      const content = match1[4];
      if (method=="add"){
        console.log(timeStart);
        addTodos({ _content: content, _timeStart: timeStart, _timeEnd: timeEnd });
        handleAdd("assistant","일정이 추가되었습니다!");
      }
    } else if (match2) {
      const method=match2[1];
      const timeStart=match2[2];
      const content=match2[3];      
      const del_todo=[];
      //따로 시간까지 지정되었을 경우
      if (timeStart!="0"){
        const _timeStart=Timestamp.fromDate(new Date(timeStart)).toDate().toString();
        console.log(_timeStart.slice(0,16));
        const close_todo=[]; //근사치 배열
        for (const item of todos){
          if (item.content.includes(content) && _timeStart===item.timeStart.toString()){
            del_todo.push(item);
          } else if (item.content.includes(content) && _timeStart.slice(0,16)===item.timeStart.toString().slice(0,16)){
            close_todo.push(item);
          }
        }
        if (del_todo.length==0 && close_todo.length>0){
          for (const item of close_todo){
            del_todo.push(item);
          }
        }

      } else {
        //시간없이 찾을 경우
        for (const item of todos){
          if (item.content.includes(content)){
            del_todo.push(item);
          }
        }
      }
      console.log(del_todo);
      //2개 이상인지 확인
      if (del_todo.length===1){
        delTodo(del_todo[0].id);
        handleAdd("assistant","일정이 삭제되었습니다!");
      } else if (del_todo.length>1){
        handleAdd("assistant","동일한 일정이 존재합니다. 날짜를 포함한 문장으로 삭제해주세요.");
      } else {
        handleAdd("assistant","해당 조건을 만족하는 일정을 찾을 수 없습니다!");
      }
    } else {
      if (sentence.includes('method:')){
        handleAdd("assistant","처리 과정에서 오류가 발생했습니다. 다시 시도해주세요.")
        console.log("func failed")
      } else {
        console.log("re_f failed");
        return (-1)
      }
    }
  }
  //메시지 전달 함수 (메시지와 사전규칙)
  const handleSend=async (_systemPrompt,message,isSave)=>{
    console.log("handleSend",message);
    message={ role : "user", content : message};//규칙맞게 가공
    const updatedMessages=[...messages,message];
    setMessages(updatedMessages); //로그 추가
    setLoading(true);//로딩 시작

    const response = await fetch("/api/openApi",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        messages:[message], //input하나만 보냄 
        systemPrompt:_systemPrompt,//규칙을 보냄
      }),
    });
    
    if (!response.ok){
      setLoading(false);
      console.log("response",response);
      throw new Error(response.statusText);
    }

    //firebase에 요청 메시지 추가(기본)
    // var now=new Date();
    // await addDoc(messageDB,{
    //   userId:data?.user?.id,
    //   userName:data?.user?.name,
    //   role:message.role,
    //   content:message.content,
    //   date:now,
    // });

    const result=await response.json();
    if (!result){
      return;
    }
    console.log("result",result);

    //messages에 요청 메시지 추가
    setLoading(false);

    //정규표현식을 통과하면 메시지 표시 없이 내부 처리
    isSave=0;
    const cnt=await re_f(result.content);
    if (cnt==-1){
      console.log("!");
      isSave=1;
    }

    //응답값 저장
    if (isSave){
      console.log(result);
      //messges배열에
      setMessages((messages)=>[...messages,result]);
      //firebase배열에
      // now=new Date();
      // await addDoc(messageDB,{
      // userId:data?.user?.id,
      // userName:data?.user?.name,
      // role:result.role,
      // content:result.content,
      // date:now,
      // });
    } else {
      return result; //대답을 반환해 별도 처리
    }
  };

  //조정된 메시지 출력
  const handleAdd=async(_role,_content)=>{
    const result={role:_role,content:_content}
    //messges배열에
    setMessages((messages)=>[...messages,result]);
    //firebase배열에
    // const now=new Date();
    // await addDoc(messageDB,{
    //   userId:data?.user?.id,
    //   userName:data?.user?.name,
    //   role:_role,
    //   content:_content,
    //   date:now,
    // });
  }

  //메시지 로그 불러오기
  const handleReset=async()=>{
    if (!data?.user?.name){
      return;
    }
    const q=query(
      messageDB,
      where("userName","==",data?.user?.name),
      orderBy("date","asc"),
    )

    // const q=query(messageDB,orderBy("date","asc"));
    const logs_data=await getDocs(q);
    const logs_arr=[];
    logs_data.docs.forEach((doc)=>{
      logs_arr.push({role:doc.data()["role"],content:doc.data()["content"]});
    });
    setMessages([...logs_arr,
      {
        role:"assistant",
        content:"무엇을 도와드릴까요?"
      }
    ]);
  };

  //로그 삭제
  const deletelog=async()=>{
    const q=query(messageDB);
    const logs_data=await getDocs(q);
    logs_data.forEach((doc)=>{
      deleteDoc(doc.ref);
    });
    setMessages([
      {
        role:"assistant",
        content:"무엇을 도와드릴까요?"
      }
    ]);
  };

  const [tab,setTab]=useState(1);

  useEffect(()=>{
    getTodos();
    handleReset();
    console.log('completed');
  },[data?.user?.name]); //세션이 불러와지면 실행


  
  //스타일 지정
  const buttonStyle="h-15 mr-3 p-3 bg-neutral text-white font-semibold\
                    border rounded-md border-2 border-white\
                    hover:bg-white hover:text-red-500"

  const activeStyle="w-10 h-1/3 pb-10\
                    bg-stone-700 text-white font-bold"
  const grayStyle="w-10 h-1/3 border pb-10\
                    bg-stone-300 text-black font-semibold\
                    hover:bg-stone-400"

  return (
    <div className="h-screen max-h-screen flex flex-col">
      {!todoLoading&&
        <div className="max-h-[10%] w-full flex flex-1 flex-row bg-red-500 items-end p-3">
          <p className="flex text-white font-bold text-4xl mr-5 p-3 border rounded-md border-2 border-white">{`PLANNER : ${data?.user?.name}'s page`}</p>
          {/*테스트용 버튼*/}
          <button className={buttonStyle}
                  onClick={signOut}>로그아웃
          </button>
          <button className={buttonStyle}
                  onClick={deletelog}>챗 로그 삭제
          </button>
          <button className={buttonStyle}
                  onClick={()=>{printTodos(todos)}}>array 출력
          </button>
        </div>
      }

      {/*각 컴포넌트-getTodos가 배열을 가져올 때까지 렌더링되지 않습니다.*/}
      {!todoLoading && (
        <div className="flex flex-1 flex-row max-h-[90%] border border-2">

          {/*챗봇 컴포넌트*/}
          <div className="flex w-1/4">
            <div className="h-full w-full">
              <Chat
                messages={messages}
                loading={loading}
                onSendMessage={handleSend}
              />
            </div>
          </div>

          {/*탭에 따른 컴포넌트-데이터와 함수를 전달*/}
          <div className="flex flex-row w-3/4 h-full border">
            {/*탭버튼*/}
            <div className="flex flex-col place-content-start">
              <button className={tab==1? activeStyle:grayStyle}
                      onClick={()=>(setTab(1))}>{tab==1? '⚪':'🔘'}{<p className="mt-3 text-lg rotate-90">Calendar</p>}
              </button>
              <button className={tab==2? activeStyle:grayStyle}
                      onClick={()=>(setTab(2))}>{tab==2? '⚪':'🔘'}{<p className="mt-3 text-lg rotate-90">TodoList</p>}
              </button>
              <button className={tab==3? activeStyle:grayStyle}
                      onClick={()=>(setTab(3))}>{tab==3? '⚪':'🔘'}{<p className="mt-3 text-lg rotate-90">Feedback</p>}
              </button>
            </div>
            {tab==1 && (
            <Calendar className="w-3/5"
              todos={todos}
              printTodos={printTodos}
            />)}
            {tab==2 && (
            <TodoList className="w-3/5"
              data={data}
              todoLoading={todoLoading}
              todos={todos}
              addTodo={addTodos}
              modiTodo={modiTodo}
              delTodo={delTodo}
            />)}
            {tab==3 &&(
            <Feedback className="w-3/5"
              todos={todos}
            />
            )}
          </div>
        </div>
      )}
    </div>
  )}
