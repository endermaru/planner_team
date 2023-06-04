import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

const TodoList = ({ data, todoLoading, todos, delTodo, modiTodo, openModi }) => {
  const [sortBy, setSortBy] = useState(""); // 정렬 방식을 추적하기 위한 상태 추가


  // modiTodo 함수 정의
  const handleModiTodo = (modid, _content, _category, _timeStart, _timeEnd, _progress) => {
    // progress 값을 0, 1, 2, 3에서 순환하도록 계산
    const updatedProgress = (_progress + 1) % 4;
    modiTodo(modid, _content, _category, _timeStart, _timeEnd, updatedProgress);
  };

  // 버튼 스타일 생성 함수
  const getButtonStyle = (progress) => {
    switch (progress) {
      case 0:
        return {
          backgroundColor: "white",
          border: "1px solid black",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      case 1:
        return {
          backgroundColor: "#B9B9B8",
          border: "1px solid black",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      case 2:
        return {
          backgroundColor: "#FFA08D",
          border: "1px solid black",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      case 3:
        return {
          backgroundColor: "#7575EA",
          border: "1px solid black",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      default:
        return {
          backgroundColor: "white",
          border: "1px solid black",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
    }
  };

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

// (지윤) TodoList 목록을 진행도순으로 정렬하는 함수
const sortByProgress = (todos) => {
  return todos.slice().sort((a, b) => b.progress - a.progress);
};


// (지윤) TodoList 정렬 방식 변경 이벤트 핸들러
const handleSortByProgress = () => {
  if (sortBy === "progress") {
    setSortBy(""); // 이미 진행도순으로 정렬된 상태이면 초기화
  } else {
    setSortBy("progress"); // 정렬 방식을 진행도순으로 설정
  }
};



// (지윤) Todos 배열을 정렬된 상태로 가져옵니다.
  const getSortedTodos = () => {
    switch (sortBy) {
      case "progress":
        return sortByProgress(todos);
      default:
        return todos;
    }
  };

  const sortedTodos = getSortedTodos(); // 정렬된 Todos 배열 

  // (지윤) TodoList 목록 정렬을 위한 css 설정
  const tableCategory = "py-2 font-semibold  text-left  pl-2";
  const tableCell = " text-sm text-left border-b-[1px] border-gray-dark";

  const grayCell = " text-gray";
  const activeCell = "font-bold text-gray-darkest";



  return (
    <div className="max-w-full w-full overflow-y-scroll p-5 no-scrollbar">
      <div className="flex h-10 border-b-[1px] pl-12 items-center">
        <div className={`${activeCell} pr-4`}>최신순</div>
        <div
          className={`${sortBy === "progress" ? activeCell : grayCell} pr-4`}
          onClick={handleSortByProgress}
        >
          진행도순
        </div>
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
              <th className={`${tableCategory} w-2/12`}>진행도</th>
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
              {sortedTodos.map((item, index) => (
                <tr key={index}>
                  
                  <td className={tableCell}>
                    <button style={getButtonStyle(item.progress)} 
                      onClick={() => handleModiTodo(item.id, item.content, item.category, item.timeStart, item.timeEnd, item.progress)}
                      >버튼</button>
                  </td>
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
