//component 가져오기
import TodoList from "../components/TodoList";
import Calendar from "../components/Calendar";

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
} from "firebase/firestore";

import { Timestamp } from "firebase/firestore";


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

  //db 가져오기
  const getTodos = async()=>{
    // 유저별로 가져올 때 사용
    // if (!data?.user?.name) return; 세션정보가 있고/유저가 있고/이름이 있으면 통과
    // const q=query(
    //   todoDB,
    //   where("userId","==",data?.user?.id),
    // )
    const q=query(todoDB);
    const results=await getDocs(q);
    const newTodos=[];

    results.docs.forEach((doc)=>{
      const _timeStart=doc.data().timeStart.toDate();
      const _timeEnd=doc.data().timeEnd.toDate(); //firebase의 timestamp를 javascript 형식으로 변환
      newTodos.push({id:doc.id, ...doc.data(), timeStart:_timeStart, timeEnd:_timeEnd});
    });
    setTodos(newTodos);
  }
  //db 추가하기(Id,이름,내용,시작날짜,종료날짜,진행도)
  const addTodos = async({_content,_timeStart,_timeEnd})=>{
    const docRef = await addDoc(todoDB,{
      userId:data?.user?.id,
      userName:data?.user?.name,
      content:_content,
      timeEnd:_timeEnd,
      timeStart:_timeStart,
      progress:0,
    });
    setTodos([...todos,{id:docRef.id,userId:data?.user?.id,userName:data?.user?.name,content:_content,timeStart:_timeStart,timeEnd:_timeEnd}])
  };

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
    console.log(_todos);
  }


  //최초 실행(새로고침) 시 1회 실행
  useEffect(()=>{
    getTodos();
  },[]);

  //챗봇
  const [messages,setMessages]=useState([]);//메시지 로그 배열
  const [loading,setLoading]=useState(false);//메시지 로딩 중
  const messagesEndRef=useRef(null); //마지막 메시지 위치

  //메시지 전달 함수 (메시지와 사전규칙)
  const handleSend=async (message)=>{
    const updatedMessages=[...messages,message];
    setMessages(updatedMessages); //로그 추가
    setLoading(true);//로딩 시작

    const response = await fetch("/api/chat",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        messages:updatedMessages.slice(-6), //가장 마지막 6개 로그를 보냄
      }),
    });
    
    if (!response.ok){
      setLoading(false);
      console.log(response)
      throw new Error(response.statusText);
    }
    const result=await response.json();
    if (!result){return;}
    console.log(result)
    setLoading(false);
    setMessages((messages)=>[...messages,result]);
  }

  const sendMessage=()=>{
    // var userInput = prompt("챗봇에게 말하기");
    handleSend("챗봇에게 말하기");
  }

  return (
    <div>
      {/*아래 부분은 테스트 컴포넌트입니다.*/}
      <p>{`This is ${data?.user?.name}'s main page(auth check)`}</p>
      {todos.length>0 && ( //todos를 불러올때까지 기다림
      <div>
        <p>{`Todo객체의 기본적인 정보`}</p>
        <ul className="list-disc ml-6">
          <li>{`userId : ${todos[0].userId} (str)`}</li>
          <li>{`userName : ${todos[0].userName} (str)`}</li>
          <li>{`content : ${todos[0].content} (str)`}</li>
          <li>{`timeStart : ${todos[0].timeStart} (timestamp)`}</li>
          <li>{`timeEnd : ${todos[0].timeEnd} (timestamp)`}</li>
          <li>{`progress : ${todos[0].progress} (int)`}</li>
        </ul>
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
              onClick={sendMessage}>챗봇에 메시지 보내기
      </button>
      {/*위 부분은 테스트 컴포넌트입니다.*/}

      {/*각 컴포넌트-getTodos가 배열을 가져올 때까지 렌더링되지 않습니다.*/}
      {todos.length > 0 && (
        <div>
          {/*데이터와 함수를 전달*/}
          <TodoList
            todos={todos}
            addTodos={addTodos}
            printTodos={printTodos}
          />
          <Calendar
            todos={todos}
            printTodos={printTodos}
          />
        </div>
      )}
      
      
    </div>
  )
}
