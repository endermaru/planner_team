import React, {useState,useEffect} from "react";

const Feedback=({todos})=>{

    return (
        <div>
            {/*샘플 코드입니다.*/}
            <div className="w-40 m-5 p-5 border border-black">
                <p>This is Feedback</p>
                <p>{`this is ${todos[0]?.content}`}</p>{/*내부 정보 확인.*/}
            </div>
        </div>
    )
}
export default Feedback;