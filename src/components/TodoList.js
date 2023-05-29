import React, {useState,useEffect} from "react";

const TodoList=({data,todoLoading,todos,addTodo,modiTodo,delTodo})=>{

    //새로운 일정 추가 예시(상위에서 가져온 함수 사용) - 인자 사용 가능
    const add_Todos=()=>{
        addTodo({_content:"content2",_timeStart:"2023-05-30T10:00:00",_timeEnd:"2023-05-30T11:00:00"});
    }
    
    // (지윤) TodoList 목록 정렬을 위한 css 설정
    const borderStyle =
    "pb-1 pt-1 text-center border-2 border-gray-300 rounded-t-lg"

    return (
        <div>
            {/*(지윤) 아래 부분은 todoList 탭에서 보여야 하는 내용들입니다. */}
        <p>{`${data?.user?.name}님의 할 일 목록입니다.`}</p>
        {!todoLoading && ( //todos를 불러올때까지 기다림
        <div className="flex flex-col">
            <p>{`There are ${todos.length} todos.`}</p>
            <li className="mb-1 flex">
              <div className={`${borderStyle} ml-3 w-20`}>분류</div>
              <div className={`${borderStyle} ml-3 w-60`}>할 일</div>
              <div className={`${borderStyle} ml-3 w-80`}>시작 시점</div>
              <div className={`${borderStyle} ml-3 w-80`}>종료 시점</div>
              <div className={`${borderStyle} ml-3 w-32`}>진행도</div>
              <div className={`${borderStyle} ml-3 w-16`}>수정</div>
              <div className={`${borderStyle} ml-3 w-16`}>제거</div>
            </li> 
  
            {/*(지윤) 할 일 목록 렌더링*/} 
            <ul>
              {todos.map((todo)=>(
                      <div key={todo.id} className="my-1 sm:my-1.5  border border-gray-300">
                        <li className="mb-1 flex">
                          <div className="ml-3 w-20 py-1 border-b-2 border-gray-300 text-center">{todo.category}</div>
                          <div className="ml-3 w-60 py-1 border-b-2 border-gray-300 text-center">{todo.content}</div>
                          <div className="ml-3 w-80 py-1 border-b-2 border-gray-300 text-center"> {todo.timeStart.toLocaleString()}</div>
                          <div className="ml-3 w-80 py-1 border-b-2 border-gray-300 text-center"> {todo.timeEnd.toLocaleString()}</div>
                          <div className="ml-3 w-32 py-1 border-b-2 border-gray-300 text-center">{todo.progress}</div>
                          <div className="ml-3 w-16 py-1 border-b-2 border-gray-300 text-center">
                            <button onClick={() => modiTodo(todo.id)}>✏️</button>
                          </div>
                          <div className="ml-3 w-16 py-1 border-b-2 border-gray-300 text-center">
                            <button onClick={() => delTodo(todo.id)}>🗑️</button>
                          </div>
                        </li> 
                      </div>
              ))
              }</ul>
        {/*(지윤) 윗부분은 todoList탭에서 보여야 하는 내용입니다.*/}
          </div>
        )} 
        </div>
    )
}
export default TodoList;