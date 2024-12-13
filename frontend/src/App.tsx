import { useCallback, useEffect, useRef, useState } from "react";
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
  const [clientId, setClientId] = useState<{ [key: string]: string }>({});
  const [clientObj, setClientObj] = useState<{ [key: string]: string }>({});
  const [receiver, setRecevier] = useState("");
  const [pri, setPri] = useState(true);
  const ws = useRef<null | WebSocket>(null);

  function userNameChecker() {
    if (currUser) {
      setCheckUserName(true);
    }
  }

  function handleRecevier(c: string) {
    setRecevier(c);
  }

  useEffect(
    function () {
      ws.current?.send(JSON.stringify({ content: clientId }));
    },
    [clientId]
  );

  useEffect(() => {
    if (checkUserName) {
      ws.current = new WebSocket("ws://192.168.101.7:8080");

      ws.current.onopen = () => {
        console.log("connection established");
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (ws.current) {
          if (data.type === "id") {
            setClientId((prev) => ({ ...prev, [data.id]: currUser }));
          }
          if (data.type === "clientList") {
            const updated = data.cliObj;
            if (clientObj === updated) {
              setClientObj(clientObj); // No change, don't trigger re-render
            }
            setClientObj(updated);

            // setClientObj(data.cliObj);
          } else {
            setMessages((prev) => [...prev, data.message]);
          }
        }
      };
      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [currUser]);

  function sendMessage() {
    if (ws.current?.readyState === WebSocket.OPEN && pri) {
      const messageData = { type: "private", to: receiver, message: input };
      ws.current.send(JSON.stringify(messageData));
      setInput("");
    }
  }
  console.log(clientObj);

  // if (!ws.current) {
  //   return (
  //     <div className="bg-zinc-800 h-screen text-white relative">
  //       <div className="flex justify-center items-center h-full  gap-7">
  //         Loading...
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="bg-zinc-800 h-screen text-white relative">
      <div
        className={`flex justify-center items-center h-full w-full absolute z-10 transition duration-300 ease-out ${
          checkUserName ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <UserId
          checkUserName={userNameChecker}
          setCurrUser={setCurrUser}
          setCheckUserName={setCheckUserName}
        />
      </div>
      <div
        className={`flex justify-center items-center h-full  gap-7 ${
          checkUserName ? "" : " blur-xl"
        }`}
      >
        <div className="absolute z-20 top-5 left-5">
          Hello, {currUser && currUser[0].toUpperCase() + currUser.slice(1)}{" "}
        </div>
        <ChatBar currSender={receiver} />
        <ClientList
          cliList={clientObj}
          currClient={clientId}
          currSender={handleRecevier}
          receiver={receiver}
        />
      </div>
    </div>
  );
}

export default App;
