import { useEffect, useRef, useState } from "react";
import "./App.css";
import { ChatBar } from "./components/ChatBar";
import { ClientList } from "./components/ClientList";
import { UserId } from "./components/UserId";

interface Message {
  to: string;
  from: string;
  msg: string;
}

interface ChatStore {
  [Id: string]: Message[];
}

function App() {
  // const [socket, setSocket] = useState<null | WebSocket>(null);
  const [checkUserName, setCheckUserName] = useState(false);
  const [currUser, setCurrUser] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [chatStore, setChatStore] = useState<ChatStore>({});

  const [sender, setSender] = useState("");
  const [clientId, setClientId] = useState<{ [key: string]: string }>({});
  const [clientObj, setClientObj] = useState<{ [key: string]: string }>({});
  const [receiver, setRecevier] = useState<{ [key: string]: string }>({});
  const pri = true;
  const [sentMsg, setSentMsg] = useState<string[]>([]);
  const ws = useRef<null | WebSocket>(null);

  function userNameChecker() {
    if (currUser) {
      setCheckUserName(true);
    }
  }

  // function handleRecevier(c: { [key: string]: string }) {
  //   setRecevier(c);
  // }

  function handleRecevier(key: string, value: string) {
    setRecevier({ [key]: value });
  }

  useEffect(
    function () {
      ws.current?.send(JSON.stringify({ event: "message", content: clientId }));
    },
    [clientId]
  );

  useEffect(() => {
    if (checkUserName) {
      // ws.current = new WebSocket("ws://192.168.101.7:8080");
      ws.current = new WebSocket("wss://chatapp-h3cu.onrender.com");

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
          }
          //someone has sent a message
          if (data.type === "private") {
            // console.log(data);
            setMessages((prev) => [...prev, data.message]);
            setChatStore((prev) => {
              return {
                ...prev,
                [data.from]: [
                  ...(prev[data.from] || []),
                  {
                    from: data.from,
                    to: Object.keys(clientId)[0],
                    msg: data.message,
                  },
                ],
              };
            });
            setSender(data.from);
          }
          //I have sent a message
          if (data.type === "receipt") {
            setSentMsg((prev) => [...prev, data.message]);
            setChatStore((prev) => {
              return {
                ...prev,
                [data.to]: [
                  ...(prev[data.to] || []),
                  {
                    from: Object.keys(clientId)[0],
                    to: data.to,
                    msg: data.message,
                  },
                ],
              };
            });
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

  function sendMessage(c: string) {
    if (ws.current?.readyState === WebSocket.OPEN && pri && c) {
      const messageData = {
        type: "private",
        sender: Object.keys(clientId)[0],
        to: Object.keys(receiver)[0],
        message: c,
      };
      ws.current.send(
        JSON.stringify({
          event: "newMessage",
          content: messageData,
        })
      );
      // console.log(messageData);
    } else {
      console.error("WebSocket not ready or pri is false.");
    }
  }
  // console.log(receiver);
  // console.log("this is clientID " + JSON.stringify(clientId));

  // console.log(
  //   "This is the chat structure: " + JSON.stringify(chatStore, null, 2)
  // );
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
    <div className="bg-neutral-800 h-fit w-fit  sm:w-auto md:h-screen text-white relative ">
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
        className={` flex justify-center  items-center h-full gap-2 md:gap-7 mx-5 md:mx-0  relative ${
          checkUserName ? "" : " blur-xl"
        }`}
      >
        <div className="absolute z-30 top-5 left-1 md:left-5  ">
          Hello, {currUser && currUser[0].toUpperCase() + currUser.slice(1)}{" "}
        </div>
        <ChatBar
          currSender={receiver}
          sendMessage={sendMessage}
          messages={messages}
          test={sender}
          sentMsg={sentMsg}
          chatStore={chatStore}
        />
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
