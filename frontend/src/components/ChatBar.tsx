import { KeyboardEvent, useEffect, useState } from "react";

interface Message {
  to: string;
  from: string;
  msg: string;
}

interface ChatStore {
  [Id: string]: Message[];
}
interface propType {
  currSender: { [key: string]: string };
  sendMessage: (c: string) => void;
  messages: string[];
  test: string;
  sentMsg: string[];
  chatStore: ChatStore;
}

export function ChatBar({
  currSender,
  sendMessage,
  messages,
  test,
  sentMsg,
  chatStore,
}: propType) {
  const [input, setInput] = useState("");
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

  useEffect(() => {
    const senderId = Object.keys(currSender)[0];
    if (senderId && chatStore[senderId]) {
      setCurrentMessages(chatStore[senderId]);
    } else {
      setCurrentMessages([]);
    }
  }, [currSender, chatStore]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // setSubmittedValue(input);
      // setInput(""); // Clear the input after submission
      sendMessage(input);
      setInput("");
    }
  };
  return (
    // <div className="bg-zinc-900 h-3/4 w-fit border border-zinc-700 rounded-xl px-5">
    //   <div className="flex  mt-5 gap-2.5 justify-start">
    //     <div className="h-7 w-7 bg-zinc-700 flex justify-center items-center rounded-full">
    //       U
    //     </div>
    //     <div className="mt-0.5">User</div>
    //   </div>
    //   <div className="h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full mt-2.5"></div>
    //   <div className="flex items-end flex-grow">
    //     <div>Type</div>
    //   </div>
    // </div>

    <div
      className="bg-zinc-900 h-[500px] md:h-3/4 md:min-h-3/4 w-fit border border-zinc-700 rounded-xl px-5 flex flex-col drop-shadow-lg 
    mt-20 md:mt-0 mb-20 md:mb-0"
    >
      <div className="flex mt-5 gap-2.5 justify-start">
        <div className="h-7 w-7 bg-zinc-700 flex justify-center items-center rounded-full">
          {currSender && Object.values(currSender).length > 0
            ? `${Object.values(currSender)[0][0].toUpperCase()} `
            : "U"}
        </div>
        <div className="mt-0.5 transition-opacity ease-in duration-300 font-semibold">
          {currSender && Object.values(currSender).length > 0
            ? `${
                Object.values(currSender)[0][0].toUpperCase() +
                Object.values(currSender)[0].slice(1)
              } `
            : "User"}
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-transparent via-zinc-700 to-transparent w-full mt-2.5"></div>
      <div className="h-full w-full bg-zinc-900 my-5 overflow-y-auto rounded-scrollbar no-scroll-buttons">
        {/* {messages &&
          Object.keys(currSender)[0] == test &&
          messages.map((value, index) => {
            return (
              <div
                key={index}
                className="h-fit w-fit p-1 px-1.5 bg-white text-black font-semibold mb-2 rounded-lg"
              >
                {value}
              </div>
            );
          })} */}
        {/* {Object.keys(currSender)[0] == test &&
          Object.entries(chatStore).map(([key, value]) => {
            return value.map((v, index) => {
              return (
                <div
                  key={index}
                  className={`flex ${
                    v.to ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    key={index}
                    className={`h-fit w-fit p-1 px-1.5  text-black font-semibold mb-2 rounded-lg
                  ${v.to ? "bg-zinc-700 text-white  " : "bg-white"}
`}
                  >
                    {v.msg}
                  </div>
                </div>
              );
            });
          })} */}

        {currentMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.to ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`h-fit w-fit p-1 px-1.5 text-black font-semibold rounded-lg
              ${message.to ? "bg-zinc-700 text-white" : "bg-white"}
            `}
            >
              {message.msg}
            </div>
          </div>
        ))}
        {Object.keys(currSender).length === 0 ? (
          <div>
            <div className="text-center text-white">No messages yet.</div>{" "}
            <div className="text-center text-white">
              Please select a Client.
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex-grow flex items-end w-72 mb-4 gap-1.5">
        <input
          disabled={Object.keys(currSender).length === 0}
          value={input}
          onChange={function (e) {
            setInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className={`bg-zinc-700 p-1.5 text-sm rounded-2xl pl-3 w-full ${
            Object.keys(currSender).length === 0
              ? "cursor-not-allowed"
              : "cursor-text"
          }`}
          type="text"
          placeholder="Type..."
        />
        <div
          className=" h-8 w-8 bg-zinc-700 rounded-full flex justify-center items-center p-1.5 cursor-pointer"
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
        >
          <svg
            height="24"
            viewBox="0 0 48 48"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            className="-rotate-45  "
          >
            <path
              d="M4.02 42l41.98-18-41.98-18-.02 14 30 4-30 4z"
              fill="white"
            />
            <path d="M0 0h48v48h-48z" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
}
