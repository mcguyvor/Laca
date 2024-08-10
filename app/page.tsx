"use client";
import { ReactEventHandler, useCallback, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
const socketUrl = "ws://localhost:80";

interface Messages {
  role: "user" | "bot";
  message: string;
}

type WebSocketResponse = {
  type: "Message";
  content: Messages;
};

export default function Home() {
  const [messages, setMessage] = useState<Messages[]>([]);
  const [inputText, setInputText] = useState("");
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  const getRandomRole = useCallback(() => {
    const roles = ["bot", "user"];
    const randomIndex = Math.floor(Math.random() * roles.length);
    return roles[randomIndex];
  }, []); // No dependencies, so the function is memoized once

  // Example usage within the component

  console.log("messages", messages);
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!e) return;
    setInputText(e.currentTarget.value);
  };
  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("e", e);

    if (e.key === "Enter") {
      //send text to api
      sendMessage(inputText);
      //reset input form
      setInputText("");
    }
  };

  useEffect(() => {
    if (lastMessage !== null) {
      const role = getRandomRole();
      const msg = { role: role, message: lastMessage.data } as Messages;
      setMessage([...messages, msg]);
    }
  }, [lastMessage]);

  return (
    <>
      <div>
        {messages.map((item) => {
          return (
            <div
              className={`flex ${item.role === "bot" ? "justify-start" : "justify-end	"} mt-2`}
            >
              {/* {item.message} */}

              <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Bonnie Green
                  </span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    11:46
                  </span>
                </div>
                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                  {item.message}
                </p>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Delivered
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="fixed w-full bottom-0">
        <input
          type="text"
          className="w-2/4 text-black absolute	bottom-0 left-[10%] bg-white border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          onChange={handleChange}
          onKeyDown={handleOnKeyUp}
          value={inputText}
          placeholder=""
        />
      </div>
    </>
  );
}
