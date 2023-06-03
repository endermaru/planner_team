import React, { useState, useEffect } from "react";

const Feedback = ({ todos, todoList }) => {
  const titleStyle = "text-xl font-semibold mt-5 mb-2";
  const inputStyle = "min-h-[44px] border border-2 w-4/5 relative";
  const [score, setscore] = useState()
  
  const addfeedback = () => {
    
  };
  return (
    <div className="flex flex-col w-full p-5 overflow-y-scroll no-scrollbar">
      <p className={titleStyle}>1. 진행도 표시하기</p>
      {todoList}
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
      <input className={inputStyle} type="text" />
      <p className={titleStyle}>5. 조언 중 참고할 점 작성하기</p>
      <input className={inputStyle} type="text" />
      <button className="mt-4 w-1/5 p-1 bg-orange text-white border border-orange rounded hover:bg-gray-light hover:text-orange"
        onClick = { () =>setscore(0)}>
      저장하기
      </button>

    </div>
  );
};
export default Feedback;
