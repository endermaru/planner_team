import React, { useRef, useEffect } from "react";

import { ChatInput } from "./ChatInput";
import { ChatBubble } from "./ChatBubble";
import { ChatLoader } from "./ChatLoader";

import { IBM_Plex_Sans_KR } from 'next/font/google';
const ibmplex = IBM_Plex_Sans_KR({
  // preload: true, 기본값
  subsets: ["latin"], // 또는 preload: false
  weight: ["300", "400", "500", "700"], // 가변 폰트가 아닌 경우, 사용할 fontWeight 배열
});

export const Chat = ({ messages, loading, onSendMessage, user }) => {
  const messagesEndRef = useRef(null); //마지막 메시지 위치
  //애니메이션
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 50);
  
    return () => {
      clearTimeout(timer);
    };
  }, [messages]);

  return (
    <>
      {" "}
      {/*컴포넌트 묶기*/}
      <main className={`flex flex-col justify-end w-[330px] h-full bg-neutral ${ibmplex.className}`}>
        <div className="max-h-[95%] flex-grow overflow-auto items-end py-2 px-2 no-scrollbar">
          {/*messages를 돌며 각 원소의 message와 index로 chatbubble 생성 */}
          {messages.map((message, index) => (
            <div key={index} className="my-1 mx-2 ">
              <ChatBubble message={message} user={user} />
            </div>
          ))}
          {/*loading true면 로딩창*/}
          {loading && (
            <div className="my-1">
              <ChatLoader />
            </div>
          )}
          <div ref={messagesEndRef} /> {/*여기까지 스크롤*/}
        </div>

        <div className="sticky bottom-0 mt-4 w-full">
          {/*받아온 onsend함수를 다시 밑으로 전달*/}
          <ChatInput onSendMessage={onSendMessage} />
        </div>
      </main>
    </>
  );
};
