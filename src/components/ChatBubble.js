export const ChatBubble = ({message}) =>{
    return (
        <div
            className={`flex flex-col ${
                message.role==="assistant"? "items-start":"items-end"
            }`}
        >
            <p className="text-white mx-2">{message.role==="assistant"? "GPT":"User"}</p>
            <div
                className={`flex flex-col ${
                    message.role==="assistant"?
                    "bg-stone-700 text-white"
                    : "bg-yellow-400 text-black"
                    } rounded-2xl px-3 py-2 max-w-[67%] whitespace-pre-wrap`}
                style={{overflowWrap:"anywhere"}}
            >
                {message.content}       
            </div>
        </div>
    );
};