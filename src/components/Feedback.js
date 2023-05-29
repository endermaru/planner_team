import React, {useState,useEffect} from "react";
import TodoList from "./TodoList";

const Feedback=({todos})=>{

    return (
        <div>
            {/*샘플 코드입니다.*/}
            <div className="w-40 m-5 p-5 border border-black">
                <p>This is Feedback</p>
                <p>{`this is ${todos[0]?.content}`}</p>{/*내부 정보 확인.*/}
                <div>
                <p>1. 진행도 표시하기</p>
                <TodoList/>
                <p>2. 어제와 비교한 오늘 확인하기</p>
                <li>
                    <p>어제의 전체 진행도 표시(그래프 등 시각화)</p>
                    <p>오늘의 전체 진행도 표시(그래프 등 시각화)</p>
                    <p>어제의 분류 분포도 표시(그래프 등 시각화)</p>
                    <p>오늘의 분류 분포도 표시(그래프 등 시각화)</p>
                </li>
                <p>3. 오늘 하루에 대한 총점수 매기기</p>
                <p> ★ ★ ★ ★ ★ </p>
                <p>4. 오늘 하루 칭찬할 점과 아쉬운 점, 개선할 점 작성하기</p>
                <input type = "text"/>
                <p>5. 조언 중 참고할 점 작성하기</p>
                <input type = "text"/>
            </div>
            </div>
        </div>
    )
}
export default Feedback;