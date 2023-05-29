import React, {useState,useEffect} from "react";

const Feedback=({todos,todoList})=>{
    const titleStyle="text-xl font-semibold mt-5 mb-2";
    const inputStyle="min-h-[44px] border border-2 w-4/5 relative"
    return (
        <div className="flex flex-col h-full w-full p-5 overflow-y-auto">
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
            <p> ★ ★ ★ ★ ★ </p>
            <p className={titleStyle}>4. 오늘 하루 칭찬할 점과 아쉬운 점, 개선할 점 작성하기</p>
            <input className={inputStyle} type = "text"/>
            <p className={titleStyle}>5. 조언 중 참고할 점 작성하기</p>
            <input className={inputStyle} type = "text"/>
        </div>
    )
}
export default Feedback;