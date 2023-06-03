import React, { useState, useEffect } from "react";

const TodoList = ({ data, todoLoading, todos, delTodo, openModi }) => {

  //날짜 변환기
  const dateToString=(date)=>{
    const dateObj=new Date(date);
    // console.log(dateObj);
    const y=dateObj.getFullYear();
    const m=dateObj.getMonth()+1;
    const d=dateObj.getDate();
    const h=dateObj.getHours();
    const mi=dateObj.getMinutes();

    var hf="오전";
    if (h>=12) hf="오후"
    // console.log(y,m,d,hf,String(h).padStart(2, "0"),String(mi).padStart(2, "0"));
    return `${m}월 ${d}일 ${hf} ${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
  }

  // (지윤) TodoList 목록 정렬을 위한 css 설정
  const tableCategory = "py-2 font-semibold  text-left  pl-2";
  const tableCell = " text-sm text-left border-b-[1px] border-gray-dark";

  const grayCell = " text-gray";
  const activeCell = "font-bold text-gray-darkest";

  return (
    <div className="max-w-full w-full overflow-y-scroll p-5 no-scrollbar">
      <div className="flex h-10 border-b-[1px] pl-12 items-center">
        <div className={`${activeCell} pr-4`}>최신순</div>
        <div className={`${grayCell} pr-4`}>진행도순</div>
        <div className={`${grayCell} pl-52 pr-4`}>일별</div>
        <div className={`${grayCell} pr-4`}>주별</div>
        <div className={`${activeCell} pr-4`}>월별</div>
      </div>
      <div className="flex flex-col ">
        {/*(지윤) 아래 부분은 todoList 탭에서 보여야 하는 내용들입니다. */}

        {/*아래 부분은 테이블 태그를 이용해 만든 todoList UI입니다. 목차의 길이 조절만으로 전체 표 길이 조절이 가능해서 추가해둡니다.*/}
        {!todoLoading && ( //todos를 불러올때까지 기다림
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className={`${tableCategory} w-2/12`}>분류</th>
                <th className={`${tableCategory} w-4/12`}>할 일</th>
                <th className={`${tableCategory} w-2/12`}>시간</th>
                <th className={`${tableCategory} w-1/12`}></th>
                <th className={`${tableCategory} w-2/12`}></th>
                <th className={`${tableCategory} w-1/24`}></th>
                <th className={`${tableCategory} w-1/24`}></th>
              </tr>
            </thead>
            <tbody>
              {todos.map((item, index) => (
                <tr key={index}>
                  <td className={tableCell}>{item.category}</td>
                  <td className={tableCell}>{item.content}</td>
                  <td className={tableCell}>
                    {dateToString(item.timeStart)}
                  </td>{" "}
                  <td className={tableCell}>-</td>
                  <td className={tableCell}>
                    {dateToString(item.timeEnd)}
                  </td>
                  <td className={tableCell}>{item.progress}</td>
                  <td className={tableCell}>
                    <button onClick={() => openModi(item.id)}>✏️</button>
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
    </div>
  );
};
export default TodoList;
