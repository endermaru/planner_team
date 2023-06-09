import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

const TodoList = ({ data, todoLoading, todos, delTodo, modiTodo, openModi }) => {
  const [sortBy, setSortBy] = useState(""); // 정렬 방식을 추적하기 위한 상태 추가
  const [filterBy, setFilterBy] = useState(""); // 필터링 방식을 추적하기 위한 상태 추가
  const [prevSortBy, setPrevSortBy] = useState(""); // 이전에 선택한 정렬 방식을 추적하기 위한 상태 추가
  const [prevFilterBy, setPrevFilterBy] = useState(""); // 이전에 선택한 필터링 방식을 추적하기 위한 상태 추가

  const dateToday = new Date();
  const dateStartOfWeek = new Date(
    dateToday.setDate(dateToday.getDate() - dateToday.getDay())
  );
  const dateStartOfMonth = new Date(dateToday.getFullYear(), dateToday.getMonth(), 1);
  const dateEndOfMonth = new Date(dateToday.getFullYear(), dateToday.getMonth() + 1, 0);


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

  // (지윤) TodoList 목록을 시작 날짜가 오늘인 항목들만 필터링하는 함수
  const filterByDay = (todos) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return todos.filter((item) => {
      const itemDate = new Date(item.timeStart).setHours(0, 0, 0, 0);
      return itemDate === today;
    });
  };

  // (지윤) TodoList 목록을 시작 날짜가 이번주(일요일 시작)인 항목들만 필터링하는 함수
  const filterByWeek = (todos) => {
    return todos.filter((item) => {
      const itemDate = new Date(item.timeStart);
      return itemDate >= dateStartOfWeek;
    });
  };

  // (지윤) TodoList 목록을 시작 날짜가 이번달인 항목들만 필터링하는 함수
  const filterByMonth = (todos) => {
    return todos.filter((item) => {
      const itemDate = new Date(item.timeStart);
      return itemDate >= dateStartOfMonth && itemDate <= dateEndOfMonth;
    });
  };


// (지윤) TodoList 목록을 시작 날짜가 이른 순으로 정렬하는 함수
const sortByStartDate = (todos) => {
  return todos.slice().sort((a,b) => a.timeStart - b.timeStart);
};

// (지윤) TodoList 정렬 방식 변경 이벤트 핸들러
const handleSortByStartDate = () => {
  if (sortBy === "start") {
    setSortBy(""); // 이미 시작 날짜 순으로 정렬된 상태이면 초기화
  } else {
    setSortBy("start") // 정렬 방식을 시작 날짜 순으로 설정
  }
};

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
    let filteredTodos = todos;

    // 정렬 방식이 변경되지 않았을 때에는 이전 상태에 따라 정렬된 Todos 배열 반환
  if (sortBy !== "") {
    switch (sortBy) {
      case "progress":
        filteredTodos = sortByProgress(filteredTodos);
        break;
      case "start":
        filteredTodos = sortByStartDate(filteredTodos);
        break;
      default:
        break;
    }
  }

    // 필터링 옵션에 따라 목록을 필터링
    if (filterBy === "day") {
      filteredTodos = filterByDay(filteredTodos);
    } else if (filterBy === "week") {
      filteredTodos = filterByWeek(filteredTodos);
    } else if (filterBy === "month") {
      filteredTodos = filterByMonth(filteredTodos);
    }

    return filteredTodos;
    };


  //(지윤) 필터링 방식 변경 이벤트 핸들러
  const handleFilterBy = (filter) =>{
    if (filterBy === filter) {
      setFilterBy(""); // 이미 선택된 필터링 방식이면 초기화
    } else {
      setFilterBy(filter); // 선택된 필터링 방식으로 변경
    }
  };

  useEffect(() => {
    handleSortByStartDate(); // 컴포넌트가 마운트되면 '최신순' 버튼을 클릭하도록 함. 
    handleFilterBy("Month"); // 컴포넌트가 마운트되면 '월별' 버튼을 클릭하도록 함.
  }, []);

  // (지윤) 정렬 및 필터링 방식이 변경될 때 이전 상태를 추적
  useEffect(() => {
    if (sortBy !== prevSortBy) {
      setPrevSortBy(sortBy); // 이전 정렬 방식을 업데이트
    }
    if (filterBy !== prevFilterBy) {
      setPrevFilterBy(filterBy); // 이전 필터링 방식을 업데이트
    }
  }, [sortBy, filterBy, prevSortBy, prevFilterBy]);
  

  const sortedTodos = getSortedTodos(); // 정렬된 Todos 배열 

  // (지윤) TodoList 목록 정렬을 위한 css 설정
  const tableCategory = "py-2 font-semibold  text-left  pl-2";
  const tableCell = " text-sm text-left border-b-[1px] border-gray-dark";

  const grayCell = " text-gray";
  const activeCell = "font-bold text-gray-darkest";



  return (
    <div className="max-w-full w-full overflow-y-scroll p-5 no-scrollbar">
      <div className="flex h-10 border-b-[1px] pl-1 items-center">
        <div className={`${sortBy === "start" ? activeCell : grayCell} pr-4`}
          onClick={handleSortByStartDate}
        >최신순</div>
        <div
          className={`${sortBy === "progress" ? activeCell : grayCell} pr-4`}
          onClick={handleSortByProgress}
        >
          진행도순
        </div>
        <div
          className={`${filterBy === "day" ? activeCell : grayCell} pl-52 pr-4`}
          onClick={() => handleFilterBy("day")}
        >
          일별
        </div>
        <div
          className={`${filterBy === "week" ? activeCell : grayCell} pr-4`}
          onClick={() => handleFilterBy("week")}
        >
          주별
        </div>
        <div
          className={`${filterBy === "month" ? activeCell : grayCell} pr-4`}
          onClick={() => handleFilterBy("month")}
        >
          월별
        </div>
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