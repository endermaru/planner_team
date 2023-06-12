import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import ModiModal from "./ModiModal";
import AddModal from "./AddModal";

import { IBM_Plex_Sans_KR } from "next/font/google";
const ibmplex = IBM_Plex_Sans_KR({
  // preload: true, 기본값
  subsets: ["latin"], // 또는 preload: false
  weight: ["300", "400", "500", "700"], // 가변 폰트가 아닌 경우, 사용할 fontWeight 배열
});

export const TodoTable = ({
  sortedTodos,
  modiTodo,
  delTodo,
  handleAdd,
  isDate,
}) => {
  //날짜 변환기
  const dateToString = (date) => {
    const dateObj = new Date(date);
    // console.log(dateObj);
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth() + 1;
    const d = dateObj.getDate();
    var h = dateObj.getHours();
    const mi = dateObj.getMinutes();

    var hf = "AM";
    if (h >= 12) {
      hf = "PM";
      if (h > 12) {
        h -= 12;
      }
    }
    if (isDate) {
      // console.log(y,m,d,hf,String(h).padStart(2, "0"),String(mi).padStart(2, "0"));
      return `${m}월 ${d}일\n${hf} ${String(h).padStart(2, "0")}:${String(
        mi
      ).padStart(2, "0")}`;
    } else {
      return `${hf} ${String(h).padStart(2, "0")}:${String(mi).padStart(
        2,
        "0"
      )}`;
    }
  };

  // modiTodo 함수 정의
  const handleModiTodo = (
    modid,
    _content,
    _category,
    _timeStart,
    _timeEnd,
    _progress
  ) => {
    // progress 값을 0, 1, 2, 3에서 순환하도록 계산
    const updatedProgress = (_progress + 1) % 4;
    modiTodo(modid, _content, _category, _timeStart, _timeEnd, updatedProgress);
  };

  const getButtonStyle = (progress) => {
    switch (progress) {
      case 0:
        return {
          backgroundColor: "#F3F3F3",
          border: "1px solid #2A2A2A",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      case 1:
        return {
          backgroundColor: "#D8D8D8",
          border: "1px solid #2A2A2A",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      case 2:
        return {
          backgroundColor: "#FFA08D",
          border: "1px solid #2A2A2A",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      case 3:
        return {
          backgroundColor: "#FF645C",
          border: "1px solid #2A2A2A",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
      default:
        return {
          backgroundColor: "#F3F3F3",
          border: "1px solid black",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
        };
    }
  };

  // (지윤) TodoList 목록 정렬을 위한 css 설정
  const tableCategory =
    "py-2 font-semibold text-gray-darkest border-b-[1px] border-gray-darkest";
  const tableCell =
    "py-2 text-sm border-b-[1px] border-gray-dark text-gray-darkest";

  const modibutton =
    "text-xs font-semibold border-[1px] rounded-full border-blue p-2 bg-blue-light text-gray-lightest\
                      hover:text-gray-lightest hover:bg-blue hover:border-blue-darkest";

  const delbutton =
    "text-xs font-semibold border-[1px] border-orange rounded-full p-2 bg-orange-light text-gray-lightest\
                      hover:text-gray-lightest hover:bg-orange hover:border-orange-darkest";

  //수정 모달창
  const [isOpen, setIsOpen] = useState(false);
  const [id_moditodo, setid_moditodo] = useState("");
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  //db 수정 - 모달 창에 넘기는 기능
  const openModi = (id) => {
    setid_moditodo(id);
    openModal();
  };

  const isPastTodo = (todo) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todoDate = new Date(todo.timeStart).setHours(0, 0, 0, 0);
    return todoDate < today;
  };

  return (
    <table className={`table-fixed w-full ${ibmplex.className}`}>
      {/*수정 시 나오는 모달창*/}
      <ModiModal
        isOpen={isOpen}
        closeModal={closeModal}
        modifunc={modiTodo}
        handleAdd={handleAdd}
        todos={sortedTodos}
        id_moditodo={id_moditodo}
        className="z-30"
      />
      <thead>
        <tr>
          <th
            className={`${tableCategory} w-10 h-12 whitespace-nowrap text-left `}
          >
            진행도
          </th>
          <th className={`${tableCategory} w-13`}>분류</th>
          <th className={`${tableCategory} w-4/12 text-left`}>할 일</th>
          <th className={`${tableCategory} text-left`}>시간</th>
          <th className={`${tableCategory} w-5`}></th>
          <th className={`${tableCategory}`}></th>
          <th className={`${tableCategory} w-1/12`}></th>
          <th className={`${tableCategory} w-1/12`}></th>
        </tr>
      </thead>
      <tbody>
        {sortedTodos.map((item, index) => (
          <tr
            key={index}
            className={`${isPastTodo(item) ? "bg-gray-light" : ""}`}
          >
            <td className={`${tableCell} text-center pl-[8px]`}>
              <button
                style={getButtonStyle(item.progress)}
                onClick={() =>
                  handleModiTodo(
                    item.id,
                    item.content,
                    item.category,
                    item.timeStart,
                    item.timeEnd,
                    item.progress
                  )
                }
              >
                {item.progress}
              </button>
            </td>
            <td className={`${tableCell} text-center `}>{item.category}</td>
            <td className={`${tableCell} text-left`}>{item.content}</td>
            <td className={`${tableCell} whitespace-pre`}>
              {dateToString(item.timeStart)}
            </td>{" "}
            <td className={`${tableCell} text-left`}>-</td>
            <td className={`${tableCell} whitespace-pre`}>
              {dateToString(item.timeEnd)}
            </td>
            <td className={tableCell}>
              <button
                className={`${modibutton}`}
                onClick={() => openModi(item.id)}
              >
                수정
              </button>
            </td>
            <td className={tableCell}>
              <button
                className={`${delbutton}`}
                onClick={() => delTodo(item.id)}
              >
                삭제
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TodoList = ({
  data,
  todoLoading,
  todos,
  addTodos,
  delTodo,
  modiTodo,
  openModi,
  handleAdd,
}) => {
  const [sortBy, setSortBy] = useState(""); // 정렬 방식을 추적하기 위한 상태 추가
  const [filterBy, setFilterBy] = useState(""); // 필터링 방식을 추적하기 위한 상태 추가
  const [prevSortBy, setPrevSortBy] = useState(""); // 이전에 선택한 정렬 방식을 추적하기 위한 상태 추가
  const [prevFilterBy, setPrevFilterBy] = useState(""); // 이전에 선택한 필터링 방식을 추적하기 위한 상태 추가

  const dateToday = new Date();
  const dateStartOfWeek = new Date(
    dateToday.setDate(dateToday.getDate() - dateToday.getDay())
  );

  const dateStartOfMonth = new Date(
    dateToday.getFullYear(),
    dateToday.getMonth(),
    1
  );
  const dateEndOfMonth = new Date(
    dateToday.getFullYear(),
    dateToday.getMonth() + 1,
    0
  );

  // (지윤) TodoList 목록을 시작 날짜가 오늘인 항목들만 필터링하는 함수
  const filterByDay = (todos) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return todos.filter((item) => {
      const itemDate = new Date(item.timeStart).setHours(0, 0, 0, 0);
      return itemDate === today;
    });
  };

  // (지윤) TodoList 목록을 시작 날짜가 이번주(월요일 시작)인 항목들만 필터링하는 함수
  const filterByWeek = (todos) => {
    const dateToday = new Date();
    const dateStartOfWeek = new Date(dateToday);
    dateStartOfWeek.setDate(
      dateStartOfWeek.getDate() - dateStartOfWeek.getDay() + 1
    ); // 월요일로 설정
    const dateEndOfWeek = new Date(dateToday);
    dateEndOfWeek.setDate(dateEndOfWeek.getDate() - dateEndOfWeek.getDay() + 7); // 다음 주 일요일로 설정

    return todos.filter((item) => {
      const itemDate = new Date(item.timeStart);
      return itemDate >= dateStartOfWeek && itemDate <= dateEndOfWeek;
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
    const today = new Date().setHours(0, 0, 0, 0);
    const sortedTodos = todos.sort((a, b) => a.timeStart - b.timeStart);
    const pastTodos = sortedTodos.filter((item) => {
      const itemDate = new Date(item.timeStart).setHours(0, 0, 0, 0);
      return itemDate < today;
    });
    const futureTodos = sortedTodos.filter((item) => {
      const itemDate = new Date(item.timeStart).setHours(0, 0, 0, 0);
      return itemDate >= today;
    });
    return [...futureTodos, ...pastTodos];
  };

  // (지윤) TodoList 정렬 방식 변경 이벤트 핸들러
  const handleSortByStartDate = () => {
    if (sortBy === "start") {
      return; // 이미 시작 날짜 순으로 정렬된 상태이면 초기화
    } else {
      setSortBy("start"); // 정렬 방식을 시작 날짜 순으로 설정
    }
  };

  // (지윤) TodoList 목록을 진행도순으로 정렬하는 함수
  const sortByProgress = (todos) => {
    return todos.slice().sort((a, b) => b.progress - a.progress);
  };

  // (지윤) TodoList 정렬 방식 변경 이벤트 핸들러
  const handleSortByProgress = () => {
    if (sortBy === "progress") {
      return; // 이미 진행도순으로 정렬된 상태이면 초기화
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
  const handleFilterBy = (filter) => {
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

  const grayCell = "text-gray";
  const activeCell = "font-bold text-gray-darkest";

  //추가 모달창
  const [addIsOpen, setAddIsOpen] = useState(false);
  const OpenAddModal = () => {
    setAddIsOpen(true);
  };
  const closeAddModal = () => {
    setAddIsOpen(false);
  };
  //날짜 변환기
  const dateToString = (date) => {
    const dateObj = new Date(date);
    // console.log(dateObj);
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth() + 1;
    const d = dateObj.getDate();
    var h = dateObj.getHours();
    const mi = dateObj.getMinutes();

    var hf = "AM";
    if (h >= 12) {
      hf = "PM";
      h -= 12;
    }
    // console.log(y,m,d,hf,String(h).padStart(2, "0"),String(mi).padStart(2, "0"));
    return `${m}월 ${d}일\n${hf} ${String(h).padStart(2, "0")}:${String(
      mi
    ).padStart(2, "0")}`;
  };
  const [nowDate, setNow] = useState("");
  useEffect(() => {
    const now_date = new Date();
    setNow(now_date);
  }, [addIsOpen]);

  return (
    <div className={`max-w-full w-full overflow-y-scroll p-5 no-scrollbar`}>
      <div className="flex w-full h-13 border-b-[1px] justify-between items-center">
        {/*추가 시 나오는 모달창*/}
        <AddModal
          isOpen={addIsOpen}
          closeModal={closeAddModal}
          addfunc={addTodos}
          handleAdd={handleAdd}
          defaultDay={nowDate}
        />
        <div>
          <button
            className={`${
              sortBy === "start" ? activeCell : grayCell
            } pr-4 left-algin`}
            onClick={handleSortByStartDate}
          >
            가까운 날짜순
          </button>
          <button
            className={`${
              sortBy === "progress" ? activeCell : grayCell
            } pr-4 left-align`}
            onClick={handleSortByProgress}
          >
            진행도순
          </button>
        </div>
        <div>
          <button
            className={`${filterBy === "day" ? activeCell : grayCell} pl-4`}
            onClick={() => handleFilterBy("day")}
          >
            일별
          </button>
          <button
            className={`${filterBy === "week" ? activeCell : grayCell} pl-4`}
            onClick={() => handleFilterBy("week")}
          >
            주별
          </button>
          <button
            className={`${filterBy === "month" ? activeCell : grayCell} pl-4`}
            onClick={() => handleFilterBy("month")}
          >
            월별
          </button>
          <button
            className="h-8 text-center justify-self-end text-base text-gray-lightest font-semibold border rounded-full ml-4 px-2 bg-gray \
          hover:font-semibo hover:bg-gray-dark hoveR:border-gray-darkest right-align my-2"
            onClick={OpenAddModal}
          >
            일정 추가하기
          </button>
        </div>
      </div>
      <div className="flex flex-col ">
        {/*(지윤) 아래 부분은 todoList 탭에서 보여야 하는 내용들입니다. */}

        {/*아래 부분은 테이블 태그를 이용해 만든 todoList UI입니다. 목차의 길이 조절만으로 전체 표 길이 조절이 가능해서 추가해둡니다.*/}
        {!todoLoading && (
          <TodoTable
            sortedTodos={sortedTodos}
            modiTodo={modiTodo}
            delTodo={delTodo}
            openModi={openModi}
            handleAdd={handleAdd}
            isDate={true}
          />
        )}
      </div>
    </div>
  );
};
export default TodoList;
