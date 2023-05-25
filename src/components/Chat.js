import { ChatInput } from "./ChatInput";
import { ChatBubble } from "./ChatBubble";
import { ChatLoader } from "./ChatLoader";

export const Chat = ({messages,loading,onSendMessage})=>{
    return (
        <> {/*컴포넌트 묶기*/}
            <div className="flex flex-col bg-neutral  rounded-lg px-2 sm:p-4 sm:border border-5 border-yellow-400">
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
                <div className="mt-4 sm:mt-8 bottom-[56px] left-0 w-full">
                    {/*받아온 onsend함수를 다시 밑으로 전달*/}
                    <ChatInput onSendMessage={onSendMessage}/>
                </div>
            </div>
        </>
    )
}