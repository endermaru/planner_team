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
        //input 컴포넌트 안으로 들어온 onsendmessage에 인자 입력
        onSendMessage("you are my assitant",content,1);
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
                                        bg-stone-700 text-white hover:bg-stone-800 hover:text-yellow-400"/>
            </button>
        </div>
    );
};