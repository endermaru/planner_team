import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore"; 

const Feedback = ({ todoDB, todos, todoList, addFeedback, todoLoading, setTodos }) => {
  const titleStyle = "text-xl font-semibold mt-5 mb-2";
  const inputStyle = "min-h-[44px] border border-2 w-4/5 relative";
  const [progress, setprogress] = useState();
  const [category, setcategory] = useState();
  const [score, setscore] = useState();
  const [reflection, setReflection] = useState("");
  const [finish, setfinish] = useState("");
  const date = new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });

  const modiPro = (todoid) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === todoid) {
        let pro = todo.progress + 1;
        if (pro >= 6) {
          pro = 0;
        }
        const todoDoc = doc(todoDB, todoid);
        updateDoc(todoDoc, { progress: pro });
        return { ...todo, progress: pro };
      } else {
        return todo;
      }
    });
    setTodos(newTodos);
  };

  const todayTodos = todos.filter(todo => {
    const todoDate = new Date(todo.timeEnd);
    const formattedDate = todoDate.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
    return formattedDate ===new Date().toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  });



  const yesTodo = todos.filter(todo => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    const todoDate = new Date(todo.timeEnd);
    const formattedDate = todoDate.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
    return formattedDate ===yesterday.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  });
  // console.log(yesTodo)

  // //날짜 변환기
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
    return `${m}월 ${d}일 ${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
  }

  // // (지윤) TodoList 목록 정렬을 위한 css 설정
  const tableCategory = "py-2 font-semibold  text-left  pl-2 text-center";
  const tableCell = " text-sm text-left border-b-[1px] border-gray-dark text-center";

  return (
    <div className="flex flex-col w-full p-5 overflow-y-scroll no-scrollbar">
      <p className={titleStyle}>{date} 일정 마무리하기</p>
      <p className={titleStyle}>1. 진행도 표시하기</p>
      {!todoLoading && ( //todos를 불러올때까지 기다림
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
              
                <th className={`${tableCategory} w-2/12`}>분류</th>
                <th className={`${tableCategory} w-3/12`}>할 일</th>
                <th className={`${tableCategory} w-2/12`}>시작시간</th>
                <th className={`${tableCategory} w-1/24`}>-</th>
                <th className={`${tableCategory} w-2/12`}>종료시간</th>
                <th className={`${tableCategory} w-2/12`}>진행도</th>
              </tr>
            </thead>
            <tbody>
            {todayTodos.map((item, index) => (
                  <tr key={index}>
                    <td className={tableCell}>{item.category}</td>
                    <td className={tableCell}>{item.content}</td>
                    <td className={tableCell}>{dateToString(item.timeStart)}</td>
                    <td className={tableCell}>-</td>
                    <td className={tableCell}>{dateToString(item.timeEnd)}</td>
                    <td
                      className={`${tableCell} bg-orange`}
                      onClick={() => modiPro(item.id)}
                    >
                      {Array(item.progress).fill('●').join('')}
                      {Array(5 - item.progress).fill('○').join('')}
                    </td>
                  </tr>
            ))}
            </tbody>
          </table>
        )}
      <p className={titleStyle}>2. 어제와 비교한 오늘 확인하기</p>

      {/*index에서 만들어진 todoList 컴포넌트를 그대로 인자로 가져왔습니다
            개인적으로는 이런 구성보다는 피드백 페이지 자체적으로 간략한 todoList가
            구현되면 좋을 것 같습니다.*/}
      <ul className="pl-5 list-disc">
        <li>어제의 전체 진행도 표시(그래프 등 시각화)</li>
        <li>오늘의 전체 진행도 표시(그래프 등 시각화)</li>
        <li>어제의 분류 분포도 표시(그래프 등 시각화)</li>
        <li>오늘의 분류 분포도 표시(그래프 등 시각화)</li>
      </ul>
      <p className={titleStyle}>3. 오늘 하루에 대한 총점수 매기기</p>
      {/* <p className={titleStyle}>{score}</p> */}
      <div class="flex flex-row-reverse justify-center">
        <button class={`bg-gray-light peer peer-hover:bg-orange hover:bg-orange focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${score >= 5 ? 'bg-orange' : ''}`}
                onClick = { () =>setscore(5) }>
        </button>
        <button class={`bg-gray-light peer peer-hover:bg-orange hover:bg-orange focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${score >= 4 ? 'bg-orange' : ''}`}
                onClick = { () =>setscore(4) }>
        </button>        
        <button class={`bg-gray-light peer peer-hover:bg-orange hover:bg-orange focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${score >= 3 ? 'bg-orange' : ''}`}
                onClick = { () =>setscore(3) }>
        </button>        
        <button class={`bg-gray-light peer peer-hover:bg-orange hover:bg-orange focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${score >= 2 ? 'bg-orange' : ''}`}
                onClick = { () =>setscore(2) }>
        </button>        
        <button class={`bg-gray-light peer peer-hover:bg-orange hover:bg-orange focus:bg-orange peer-focus:bg-orange rounded-full w-12 h-12 mx-2 ${score >= 1 ? 'bg-orange' : ''}`}
                onClick = { () =>setscore(1) }>
        </button>
      </div>
      <p className={titleStyle}>
        4. 오늘 하루 칭찬할 점과 아쉬운 점, 개선할 점 작성하기
      </p>
      <input className={inputStyle} type="text" onChange={reflection} />
      <p className={titleStyle}>5. 조언 중 참고할 점 작성하기</p>
      <input className={inputStyle} type="text" onChange={finish} />
      <button className="mt-4 w-1/5 p-1 bg-orange text-white border border-orange rounded hover:bg-gray-light hover:text-orange"
        onClick = { () => {
          addFeedback(date, progress, category, score, reflection, finish);
           
          setscore(0)}}>
      저장하기
      </button>

    </div>
  );
};
export default Feedback;
