import React, {useState,useEffect} from "react";
import { Timestamp } from "firebase/firestore";

const TodoList=({todos,addTodos,printTodos})=>{

    //새로운 일정 추가 예시(상위에서 가져온 함수 사용)
    const add_Todos=()=>{
        const date = new Date();
        const timestamp=Timestamp.fromDate(date);
        addTodos({_content:"content2",_timeStart:timestamp,_timeEnd:timestamp});
    }
    
    return (
        <div>
            {/*샘플 코드입니다.*/}
            <div className="w-40 m-5 p-5 border border-black">
                <p>This is TodoList</p>
                <p>{`this is ${todos[0]?.content}`}</p>{/*내부 정보 확인.*/}
                <button className="p-3 bg-orange-300"
                    onClick={add_Todos}
                >todolist's addTo
                </button>
            </div>
        </div>
    )
}
export default TodoList;