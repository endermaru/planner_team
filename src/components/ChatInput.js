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

        const ex1=new Date(now.getFullYear(),now.getMonth(),now.getDate()+2,4,0,0,0).toISOString().slice(0,-5);
        const ex2=new Date(now.getFullYear(),now.getMonth(),now.getDate()+2,5,0,0,0).toISOString().slice(0,-5);

        const dayOfWeek=now.getDay();
        var daysUntilNextTuesday = (2 + 7 - dayOfWeek) % 7;
        if (dayOfWeek<=2){
            daysUntilNextTuesday=daysUntilNextTuesday+7;
        }
        const nextTuesday=new Date(now.getFullYear(),now.getMonth(),now.getDate() + daysUntilNextTuesday+1,2,0,0,0).toISOString().slice(0,-5);
        const nextTuesday_end=new Date(now.getFullYear(),now.getMonth(),now.getDate() + daysUntilNextTuesday+1,3,0,0,0).toISOString().slice(0,-5);

        const ex3=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,8,0,0,0).toISOString().slice(0,-5);
        const ex4=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,9,0,0,0).toISOString().slice(0,-5);

        // console.log(isoString);
        const systemPrompt=[{role:"system",content:`일정과 관련된 문장을 분석하는 게임을 하자. 기준은 ${nowString}이야. 실제 시간을 모르더라도 ${nowString}을 기준으로 분석하면 돼.`},
        {role:"system",content:`
        1. 일정을 추가하는 문장이면 [method:"add",timeStart:ISO 8601 형식의 시작 시점,timeEnd:ISO 8601 형식의 시점,content:"일정의 내용"]의 배열로 반환해줘. 
        만약 시작시간, 종료시간 없이 날짜만 있다면 timeStart는 해당 날짜의 00:00:00으로, timeEnd는 해당 날짜의 23:59:59로 설정해.
        만약 시작시간만 있다면 timeEnd는 시작시간의 1시간 뒤로 설정해줘.
        '내일'은 1일 후, '내일 모레'는 2일 후를 가리키는 용어야.
        예시1) 지금이 ${nowString}일 때, '내일 오후 7시 시험 일정 추가해줘'라는 문장 -> [method:"add",timeStart:"${ex1}",timeEnd:"${ex2}",content:"시험"]을 반환,
        예시2) 지금이 ${nowString}일 때, '다음주 화요일 17시 회의 추가해'라는 문장 -> [method:"add",timeStart:"${nextTuesday}",timeEnd:"${nextTuesday_end}",content:"회의"]을 반환,
        예시3) '6월 6일 현충일 추가해줘'라는 문장 -> [method:"add",timeStart:"2023-06-06T00:00:00",timeEnd:"2023-06-06T23:59:59",content:"현충일"] 반환,
        예시4) 지금이 ${nowString}일 때, '오후 11시 공부 추가'라는 문장 -> [method:"add",timeStart:"${ex3}",timeEnd:"${ex4}",content:"공부"] 반환`},
        {role:"system",content:`
        2. 일정을 삭제,취소하는 문장이면 [method:"delete",timeStart:ISO 8601 형식의 시작시점,content:"일정의 내용"]을 반환해줘.
        만약 시간정보가 명시되어 있지 않으면, timeStart는 "0"으로 반환해.
        시작시점의 날짜만 알 수 있고 시간을 모르면 0시 0분으로 반환해.
        예시1) '시험 삭제해줘' -> [method:"delete",timeStart:"0",content:"시험"]을 반환,
        예시2) '웹프로그래밍 회의 삭제해줘' -> [method:"delete",timeStart:"0",content:"웹프로그래밍 회의"]를 반환,
        예시3) 지금이 ${nowString}일 때, '다음주 화요일 약속 취소해줘'라는 문장 -> [method:"delete",timeStart:"${nextTuesday}",content:"약속"]를 반환,
        예시4) '6월 1일 회의 삭제'라는 문장 -> [method:"delete",timeStart:"2023-06-01T00:00:00",content:"회의"]를 반환,
        예시5) '6월 3일 오후 3시 운동 삭제'라는 문장 -> [method:"delete",timeStart:"2023-06-03T15:00:00",content:"운동"]를 반환,
        `},
        {role:"system",content:`
        3. 일정의 내용을 변경하는 문장이면 [method:"content",before:"변경하기 전의 일정 이름",after:"변경한 후의 일정이름"]의 배열로 반환해줘.
        예시1) '시험을 수학시험으로 변경해줘' -> [method:"content",before:"시험",after:"수학시험"]을 반환
        `}];

        //input 컴포넌트 안으로 들어온 onsendmessage에 인자 입력
        // console.log("?",systemPrompt);
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