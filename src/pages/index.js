import React,{useState,useEffect} from "react";

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
} from "firebase/firestore";

//일정 db - 필드 이름(타입) : userId(str) / userName(str) / content(str) / timeStart(timestamp) / timeEnd(timestamp) / progress(int)
const todoDB = collection(db,"todoDB");

export default function Home() {
  //일정 배열 생성
  const [todos,setTodos]=useState({});

  //db 가져오기
  const getTodos = async()=>{
    const q=query(todoDB);
    const results=await getDocs(q);
    const newTodos=[];

    results.docs.forEach((doc)=>{
      newTodos.push({id:doc.id, ...doc.data()});
    });
    setTodos(newTodos);
  }
  //db 추가하기(Id,이름,내용,시작날짜,종료날짜,진행도)
  const addTodos = async(_userId,_userName,_content,_timeEnd,_timeStart)=>{
    const docRef = await addDoc(todoDB,{
      userId:_userId,
      userName:_userName,
      content:_content,
      timeEnd:_timeEnd,
      timeStart:_timeStart,
      progress:0,
    });
  };

  const delTodo=(id)=>{
    const todoDoc=doc(todoDB,id);
    deleteDoc(todoDoc);
    setTodos(
      todos.filter((todo)=>{
        return todo.id !==id;
      })
    )
  }
  const printTodos=()=>{
    console.log(todos);
  }

  //최초 실행(새로고침) 시 1회 실행
  useEffect(()=>{
    getTodos();
  },[]);

  return (
    <div>
      <p>This is main page</p>
      {todos.length>0 && ( //todos를 불러올때까지 기다림
      <div>
        <p>{`this is dummy db item.`}</p>
        <p>{`userId : ${todos[0].userId} (str)`}</p>
        <p>{`userName : ${todos[0].userName} (str)`}</p>
        <p>{`content : ${todos[0].content} (str)`}</p>
        <p>{`timeStart : ${todos[0].timeStart} (timestamp)`}</p>
        <p>{`timeEnd : ${todos[0].timeEnd} (timestamp)`}</p>
        <p>{`progress : ${todos[0].progress} (int)`}</p>
      </div>
      )}
      <button className="w-20 h-10 bg-orange-300" onClick={printTodos}>콘솔 출력</button>
    </div>
  )
}
