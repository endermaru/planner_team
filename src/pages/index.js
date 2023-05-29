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
    setTodos([...todos,{id:docRef.id,userId:data?.user?.id,userName:data?.user?.name,content:_content,timeStart:_timeStart,timeEnd:_timeEnd}])
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
  const messagesEndRef=useRef(null); //마지막 메시지 위치

  //애니메이션
  const scrollToBottom=()=>{
    messagesEndRef.current?.scrolllIntoView({behavior:"smooth"});
  }
  
  //정규표현식 함수
  const re_f=async(sent)=>{
    console.log("re_f",sent);
    const sentence=sent;
    const pattern = /\[method:"(\w+)",timeStart:"([^"]+)",timeEnd:"([^"]+)",content:"([^"]+)"\]/;
    const match = sentence.match(pattern);
    if (match) {
      const method = match[1];
      const timeStart = match[2];
      const timeEnd = match[3];
      const content = match[4];
      if (method=="add"){
        console.log(timeStart);
        addTodos({ _content: content, _timeStart: timeStart, _timeEnd: timeEnd });
        handleAdd("assistant","일정이 추가되었습니다!");
      }
    } else {
      console.log("re_f failed");
      return -1;
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
    var now=new Date();
    await addDoc(messageDB,{
      userId:data?.user?.id,
      userName:data?.user?.name,
      role:message.role,
      content:message.content,
      date:now,
    });

    const result=await response.json();
    if (!result){
      return;
    }
    console.log("result",result);

    //messages에 요청 메시지 추가
    setLoading(false);

    //정규표현식을 통과하면 메시지 표시 없이 내부 처리
    if (re_f(result.content)){
      isSave=0;
    }

    //응답값 저장
    if (isSave){
      console.log(result);
      //messges배열에
      setMessages((messages)=>[...messages,result]);
      //firebase배열에
      now=new Date();
      await addDoc(messageDB,{
      userId:data?.user?.id,
      userName:data?.user?.name,
      role:result.role,
      content:result.content,
      date:now,
    });
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
    const now=new Date();
    await addDoc(messageDB,{
      userId:data?.user?.id,
      userName:data?.user?.name,
      role:_role,
      content:_content,
      date:now,
    });
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

  useEffect(()=>{
    getTodos();
    handleReset();
    console.log('completed');
  },[data?.user?.name]); //세션이 불러와지면 실행



// (지윤) TodoList 목록 정렬을 위한 css 설정
const borderStyle =
  "pb-1 pt-1 text-center border-2 border-gray-300 rounded-t-lg"

  return (
    <div>
      {/*아래 부분은 테스트 컴포넌트입니다.*/}
      <p>{`This is ${data?.user?.name}'s main page(auth check)`}</p>
      {!todoLoading && ( //todos를 불러올때까지 기다림
      <div>
        <p>{`Todo객체의 기본적인 정보`}</p>
        <ul className="list-disc ml-6">
          <li>{`userId : ${todos[0]?.userId} (str)`}</li>
          <li>{`userName : ${todos[0]?.userName} (str)`}</li>
          <li>{`content : ${todos[0]?.content} (str)`}</li>
          <li>{`timeStart : ${todos[0]?.timeStart} (timestamp)`}</li>
          <li>{`timeEnd : ${todos[0]?.timeEnd} (timestamp)`}</li>
          <li>{`progress : ${todos[0]?.progress} (int)`}</li>
        </ul>
        <br/>
        <div className="flex flex-col">
          <p>{`There are ${todos.length} todos.`}</p> 
        {todos.map((todo)=>(
                    <div key={todo.id} className="my-1 sm:my-1.5 bg-orange-300 border border-black">
                        {`${todo.content} / ${todo.timeStart} ~ ${todo.timeEnd}`}
                    </div>
                ))}
        </div>
      </div>
      )};
      {/*테스트용 버튼*/}
      <button className="w-60 justify-self-center p-1 mr-4
                        bg-blue-500 text-white border border-blue-500 rounded 
                        hover:bg-white hover:text-blue-500" 
              onClick={()=>printTodos(todos)}>더미 데이터 목록 콘솔 출력
      </button>
      <button className="w-60 justify-self-center p-1 mr-4
                        bg-blue-500 text-white border border-blue-500 rounded 
                        hover:bg-white hover:text-blue-500" 
              onClick={signOut}>로그아웃
      </button>
      <button className="w-60 justify-self-center p-1 mr-4
                        bg-blue-500 text-white border border-blue-500 rounded 
                        hover:bg-white hover:text-blue-500" 
              onClick={deletelog}>챗 로그 삭제
      </button>
      {/*위 부분은 테스트 컴포넌트입니다.*/}

      
      {/*챗봇 컴포넌트*/}
      <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
        <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
          <Chat
            messages={messages}
            loading={loading}
            onSendMessage={handleSend}
          />
          <div ref={messagesEndRef} /> {/*항상 메시지의 끝에 옴-여기까지 스크롤*/}
        </div>
      </div>

      {/*각 컴포넌트-getTodos가 배열을 가져올 때까지 렌더링되지 않습니다.*/}
      {!todoLoading && (
        <div className="flex flex-row">
          {/*데이터와 함수를 전달*/}
          <TodoList
            data={data}
            todoLoading={todoLoading}
            todos={todos}
            addTodo={addTodos}
            modiTodo={modiTodo}
            delTodo={delTodo}
          />
          <Calendar
            todos={todos}
            printTodos={printTodos}
          />
          <Feedback
            todos={todos}
          />
        </div>
      )}
    </div>
  )}
