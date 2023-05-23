import React, {useState,useEffect} from "react";

const Calendar=({todos,printTodos})=>{
    return (
        <div>
            {/*샘플 코드입니다.*/}
            <div className="w-40 m-5 p-5 border border-black">
                <p>This is Calendar</p>
                <p>{`this is ${todos[0]?.content}`}</p>{/*내부 정보 확인.*/}
                <button className="p-3 bg-orange-300"
                    onClick={()=>printTodos(todos)}
                >calendar's print</button>
            </div>
        </div>
    )
}
export default Calendar;