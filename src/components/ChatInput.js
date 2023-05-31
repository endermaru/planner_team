import {IconSend} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";

export const ChatInput = ({onSendMessage}) => {
    const [content,setContent]=useState();

    

    //입력창 속성
    const textareaRef = useRef(null);
    //입력창 내용 업데이트
    const handleChange=(e)=>{
        const value=e.target.value;
        setContent(value);
    };
    //send
    const handleSend=()=>{
        if (!content){
            alert("메시지를 입력하세요.");
            return;
        }

        const now = new Date();
        const nowString=`${now.getFullYear()}년 ${now.getMonth()+1}월 ${now.getDate()}일 ${now.getHours()}시 ${now.getMinutes()}분 ${now.getSeconds()}초`
        // now.setHours(now.getHours()+9);

        const ex1=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,4,0,0,0).toISOString().slice(0,-5);
        const ex2=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,5,0,0,0).toISOString().slice(0,-5);

        const dayOfWeek=now.getDay();
        var daysUntilNextTuesday = (2 + 7 - dayOfWeek) % 7;
        if (dayOfWeek<=2){
            daysUntilNextTuesday=daysUntilNextTuesday+7;
        }
        const nextTuesday=new Date(now.getFullYear(),now.getMonth(),now.getDate() + daysUntilNextTuesday+1,2,0,0,0).toISOString().slice(0,-5);
        const nextTuesday_end=new Date(now.getFullYear(),now.getMonth(),now.getDate() + daysUntilNextTuesday+1,3,0,0,0).toISOString().slice(0,-5);

        const ex3=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,8,0,0,0).toISOString().slice(0,-5);
        const ex4=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,9,0,0,0).toISOString().slice(0,-5);

        const systemPrompt=[{role:"system",content:`일정과 관련된 문장을 분석하는 게임을 하자.
        TODAY:${nowString},
        Analyze purpose of user's sententce : "add" || "delete" || "modification"
        Write in Markdown, Write only JSON format. Write timeStart and timeEnd only in ISO 8601 format
        1. "add" : return {"method":"add","timeStart":start time,"timeEnd":end time,"content":the name of schedule}
        -If there is only date but no time, start time is 00:00:00 and end time is 23:59:59.
        ex) "6월 6일 현충일 추가해줘" -> "timeStart":"2023-06-06T00:00:00", "timeEnd":"2023-06-06T23:59:59"
        -If there is no end date and time, end time is 1 hour after of start time.
        ex) "오후 11시 공부 추가해" -> "timeStart":"${ex3}","timeEnd":"${ex4}"
        ex) "다음주 화요일 17시 회의 추가해" -> "timeStart":"${nextTuesday}","timeEnd":"${nextTuesday_end}"

        2. "delete" : return {"method":"delete","timeStart":start time,"content":the name of schedule}
        ex) "6월 3일 오후 3시 운동 없애줘." -> return {"method":"delete","timeStart":"2023-06-03T15:00:00","content":"운동"}
        -If there is no date or time, return timeStart value to "0".
        ex) "웹프로그래밍 회의 삭제해줘" -> "timeStart":"0"
        -If there is start date but no time, start time is 00:00:00.
        ex) "다음주 화요일 약속 취소해줘" ->"timeStart":"${nextTuesday}"

        3. "modification" : return {"method":"modification","timeStart":start time(original),"content":the name of schedule(original)}
        -If there is no original start time, "timeStart" is "0".
        -If there is modificated time or modificated content, ignore it.
        -If there is modificated time but no original start time, "timeStart" is "0"
        ex) "6월 3일 운동 수정할래." -> "timeStart":"2023-06-03T00:00:00","content":"운동"
        ex) "웹프로그래밍 회의 일정 변경해줘." -> "timeStart":"0","content":"웹프로그래밍 회의"
        ex) "수업 내일로 바꿀래." -> "timeStart":"0","content":"수업"
        ex) "회의를 줌으로 바꿀래" -> "timeStart":"0", "content":"회의"
        `}]

        //input 컴포넌트 안으로 들어온 onsendmessage에 인자 입력
        console.log("?",systemPrompt);
        onSendMessage(systemPrompt,content,1);
        setContent("");
    };
    //shift를 같이 누른 엔터가 아니면 기본 엔터 실행 취소후 Send
    const handleKeyDown=(e)=>{
        if (e.key==="Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    //content 내용 변경 때마다 실행, 입력창 높이 조절
    useEffect(()=>{
        if (textareaRef && textareaRef.current) {
            textareaRef.current.style.height="inherit";
            textareaRef.current.style.height=`${textareaRef.current?.scrollHeight}px`
        }
    },[content]);

    return (
        <div className="relative">
            <textarea
                ref={textareaRef}
                className="min-h-[44px] bg-stone-700 rounded-lg pl-4 pr-12 py-2
                            w-full focus:outline-none text-white
                            focus:ring-1 focus:ring-yellow-400 hover:ring-1 hover:ring-yellow-400"
                style={{resize:"none"}}
                placeholder="메시지를 입력하세요"
                value={content}
                rows={1}
                onChange={handleChange} //input 값이 바뀔 때마다 업데이트
                onKeyDown={handleKeyDown} //누르는 키마다 엔터 함수 호출
            />
            <button onClick={()=>handleSend()}>
                <IconSend className="absolute right-2 bottom-3 h-8 w-8
                                        hover:cursor-pointer rounded-full p-1
                                        bg-stone-700 text-white hover:bg-stone-800"/>
            </button>
        </div>
    );
};