import { IconDots } from "@tabler/icons-react";

export const ChatLoader = () => {
  return (
    <div className="flex flex-col flex-start mx-2">
      <p className="text-gray-darkest mx-3 font-bold"> GPT</p>
      <div
        className={`flex items-center h-8 bg-gray-light text-gray-darkest rounded-tl-2xl rounded-tr-2xl rounded-br-2xl text-sm px-5 py-2 w-fit`}
        style={{ overflowWrap: "anywhere" }}
      >
        <IconDots className="animate-bounce" />
      </div>
    </div>
  );
};
