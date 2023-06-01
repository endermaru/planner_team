export const ChatBubble = ({ message }) => {
  return (
    <div
      className={`flex flex-col justify-end mx-1 ${
        message.role === "assistant" ? "items-start" : "items-end"
      }`}
    >
      <p className="text-gray mx-2">
        {message.role === "assistant" ? "GPT" : "User"}
      </p>
      <div
        className={`flex flex-col ${
          message.role === "assistant"
            ? "bg-gray-light text-gray-darkest rounded-tl-2xl rounded-tr-2xl rounded-br-2xl "
            : "bg-gray-dark text-gray-lightest rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl "
        } text-sm px-3 py-2 max-w-[67%] whitespace-pre-wrap`}
        style={{ overflowWrap: "anywhere" }}
      >
        {message.content}
      </div>
    </div>
  );
};
