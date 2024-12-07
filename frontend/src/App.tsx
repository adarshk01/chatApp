import { useEffect, useRef, useState } from "react";
import "./App.css";
import { ChatBar } from "./components/ChatBar";
import { ClientList } from "./components/ClientList";
import { UserId } from "./components/UserId";

type Message = {
  type: "private";
  from: string;
  message: string;
};

function App() {
  // const [socket, setSocket] = useState<null | WebSocket>(null);
  const [checkUserName, setCheckUserName] = useState(false);
  const [currUser, setCurrUser] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [clinetId, setClientId] = useState<string[]>([]);
  const [receiver, setRecevier] = useState("");
  const [pri, setPri] = useState(true);
  const ws = useRef<null | WebSocket>(null);

  function userNameChecker() {
    if (currUser) {
      setCheckUserName(true);
    }
  }

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.101.7:8080");
    ws.current.onopen = () => {
      console.log("connection established");
    };
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "id") {
        setClientId((prev) => [...prev, data.id]);
      } else {
        setMessages((prev) => [...prev, data.message]);
      }
    };
  }, []);

  function sendMessage() {
    if (ws.current?.readyState === WebSocket.OPEN && pri) {
      const messageData = { type: "private", to: receiver, message: input };
      ws.current.send(JSON.stringify(messageData));
      setInput("");
    }
  }

  if (!ws.current) {
    return (
      <div className="bg-zinc-800 h-screen text-white">
        <div className="flex justify-center items-center h-full  gap-7">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 h-screen text-white relative">
      <div
        className={`flex justify-center items-center h-full w-full absolute z-10 transition duration-300 ease-out ${
          checkUserName ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <UserId checkUserName={userNameChecker} setCurrUser={setCurrUser} />
      </div>
      <div
        className={`flex justify-center items-center h-full  gap-7 ${
          checkUserName ? "" : " blur-xl"
        }`}
      >
        <div className="absolute z-20 top-0 left-0">
          Hello, {currUser && currUser[0].toUpperCase() + currUser.slice(1)}
        </div>
        <ChatBar currUser={currUser} />
        <ClientList cliList={clinetId} />
      </div>
    </div>
  );
}

export default App;
