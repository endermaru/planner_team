import React, {useRef,useEffect} from "react"

import { ChatInput } from "./ChatInput";
import { ChatBubble } from "./ChatBubble";
import { ChatLoader } from "./ChatLoader";

export const Chat = ({messages,loading,onSendMessage})=>{
    const messagesEndRef=useRef(null); //마지막 메시지 위치
    //애니메이션
    const scrollToBottom=()=>{
        messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
    }
    useEffect(()=>{
        scrollToBottom();
    },[]);
    useEffect(()=>{
        scrollToBottom();
    },[messages]);

    return (
        <> {/*컴포넌트 묶기*/}
            <main className="flex flex-col w-full h-full bg-neutral px-2">
                <div className="max-h-[95%] overflow-auto grow">
                    {/*messages를 돌며 각 원소의 message와 index로 chatbubble 생성 */}
                    {messages.map((message,index)=>(
                        <div key={index} className="my-1 sm:my-1.5">
                            <ChatBubble message={message}/>
                        </div>
                    ))}
                    {/*loading true면 로딩창*/}
                    {loading && (
                        <div className="my-1 sm:my-1.5">
                            <ChatLoader/>
                        </div>
                    )}
                    <div ref={messagesEndRef} /> {/*여기까지 스크롤*/}
                </div>
                
                <div className="relative bottom-0 mt-4 w-full">
                    {/*받아온 onsend함수를 다시 밑으로 전달*/}
                    <ChatInput onSendMessage={onSendMessage}/>
                </div>
            </main>
        </>
    )
}