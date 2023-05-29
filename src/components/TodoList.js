import React, {useState,useEffect} from "react";

const TodoList=({data,todoLoading,todos,addTodo,modiTodo,delTodo})=>{

    //새로운 일정 추가 예시(상위에서 가져온 함수 사용) - 인자 사용 가능
    const add_Todos=()=>{
        addTodo({_content:"content2",_timeStart:"2023-05-30T10:00:00",_timeEnd:"2023-05-30T11:00:00"});
    }
    
    // (지윤) TodoList 목록 정렬을 위한 css 설정
    const borderStyle =
    "pb-1 pt-1 text-center border-2 border-gray-300 rounded-t-lg";

    const tableCategory="py-2 text-center font-semibold";
    const tableCell="py-2 text-center border-b-2 border-t-2 border-gray-300";

    return (
        <div className="flex flex-col max-w-full w-full p-5">
            {/*(지윤) 아래 부분은 todoList 탭에서 보여야 하는 내용들입니다. */}
        <p>{`${data?.user?.name}님의 할 일 목록입니다.`}</p>
        {!todoLoading && ( //todos를 불러올때까지 기다림
        <div className="flex flex-col">
            <p>{`There are ${todos.length} todos.`}</p>
            <li className="mb-1 flex">
              <div className={`${borderStyle} ml-3 w-20`}>분류</div>
              <div className={`${borderStyle} ml-3 w-60`}>할 일</div>
              <div className={`${borderStyle} ml-3 w-60`}>시작 시점</div>
              <div className={`${borderStyle} ml-3 w-60`}>종료 시점</div>
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
                          <div className="ml-3 w-60 py-1 border-b-2 border-gray-300 text-center"> {todo.timeStart.toLocaleString()}</div>
                          <div className="ml-3 w-60 py-1 border-b-2 border-gray-300 text-center"> {todo.timeEnd.toLocaleString()}</div>
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

        {/*아래 부분은 테이블 태그를 이용해 만든 todoList UI입니다. 목차의 길이 조절만으로 전체 표 길이 조절이 가능해서 추가해둡니다.*/}
        {!todoLoading && ( //todos를 불러올때까지 기다림
        <table className="table-auto w-full mt-10 border-collapse">
          <thead>
            <tr>
              <th className={`${tableCategory} w-1/12`}>분류</th>
              <th className={`${tableCategory} w-3/12`}>할 일</th>
              <th className={`${tableCategory} w-2/12`}>시작 시점</th>
              <th className={`${tableCategory} w-2/12`}>종료 시점</th>
              <th className={`${tableCategory} w-1/12`}>진행도</th>
              <th className={`${tableCategory} w-1/12`}>수정</th>
              <th className={`${tableCategory} w-1/12`}>제거</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((item,index)=>(
              <tr key={index}>
                  <td className={tableCell}>{item.category}</td>
                  <td className={tableCell}>{item.content}</td>
                  <td className={tableCell}>{item.timeStart.toLocaleString()}</td>
                  <td className={tableCell}>{item.timeEnd.toLocaleString()}</td>
                  <td className={tableCell}>{item.progress}</td>
                  <td className={tableCell}>
                    <button onClick={() => modiTodo(item.id)}>✏️</button>
                  </td>
                  <td className={tableCell}>
                    <button onClick={() => delTodo(item.id)}>🗑️</button>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
        )} 
        </div>
    )
}
export default TodoList;