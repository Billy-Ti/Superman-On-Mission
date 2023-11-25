import { Icon } from "@iconify/react";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  off,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { useEffect, useState } from "react";
interface ChatRoomWindowProps {
  onCloseRoom: () => void;
  taskId: string;
}

interface Message {
  content: string;
  sentBy: string;
  sentAt: number; // or string if it's a timestamp
}

const ChatRoomWindow = ({ onCloseRoom, taskId }: ChatRoomWindowProps) => {
  const [message, setMessage] = useState(""); // 用于输入框的消息
  const [messages, setMessages] = useState<Message[]>([]); // 存所有訊息的陣列
  const database = getDatabase();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const database = getDatabase();
    const messagesRef = ref(database, `tasks/${taskId}/messages`);

    // 监听新消息
    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      const messagesList = messagesData
        ? (Object.values(messagesData) as Message[])
        : [];
      setMessages(messagesList);
    });

    // 组件卸载时取消监听
    return () => {
      off(messagesRef);
    };
  }, [taskId]);

  const handleSendMessage = () => {
    if (!currentUser) {
      console.error("用户未登录，不能发送消息。");
      // 这里可以添加逻辑来处理未登录的情况，如显示登录提示等
      return;
    }

    if (!message.trim()) {
      // 如果沒有訊息，则不执行任何操作
      return;
    }

    // 发送消息到 Realtime Database 的对应任务下
    const messagesRef = ref(database, `tasks/${taskId}/messages`);
    const newMessageRef = push(messagesRef);

    set(newMessageRef, {
      content: message,
      sentBy: currentUser?.uid || "anonymous", // 如果未登录，则标记为匿名用户
      sentAt: serverTimestamp(), // 使用 Firebase 服务器的时间戳
    })
      .then(() => {
        setMessage(""); // 成功发送后清空输入框
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
      });
  };

  return (
    <div className="fixed inset-0 z-50 my-auto flex h-full items-center justify-center bg-black bg-opacity-50 text-gray-800 antialiased">
      <div className="relative flex h-[70vh] w-3/4 flex-row overflow-auto rounded-lg bg-white p-4 shadow-lg">
        <span className="absolute right-5 top-6 h-6 w-6 animate-ping rounded-full bg-gray-200 opacity-75" />
        <button
          onClick={onCloseRoom}
          className="absolute right-3 top-3 z-[100] mr-2 mt-2 text-gray-500 hover:text-gray-700"
          aria-label="Close chat window"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex w-64 flex-shrink-0 flex-col bg-white py-1 pl-6 pr-2">
          <div className="flex h-12 w-full flex-row items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
            </div>
            <div className="ml-2 text-2xl font-bold">RealTime Chat</div>
          </div>
          <div className="mb-2 mt-1 flex w-full flex-col items-center rounded-lg border border-gray-200 bg-indigo-100 px-4 py-6">
            <div className="h-20 w-20 overflow-hidden rounded-full border">
              <img
                src="https://i.postimg.cc/vBxKKcnj/025395d6-6d20-4aca-864f-b6b601335cf9.png"
                alt="superman-pic"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-2 text-sm font-semibold">Billy Ti</div>
            <div className="text-xs text-gray-500">test@gmail.com</div>
          </div>
          <div className="mt-1 flex flex-col">
            <div className="flex flex-row items-center justify-between px-2 text-xs">
              <span className="mb-2 font-bold">Active Conversations</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-300">
                4
              </span>
            </div>
            <div className="relative ">
              <input
                className="w-full rounded border p-2 focus:outline-none"
                placeholder="Search user"
                type="text"
              />
              <button type="button" className="absolute right-0 top-1">
                <Icon icon="ri:search-line" width="30" color="#e0e7ff" />
              </button>
            </div>
            <div className="-mx-2 mt-4 flex h-48 flex-col space-y-1 overflow-y-auto">
              <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200">
                  H
                </div>
                <div className="ml-2 text-sm font-semibold">Henry</div>
              </button>
              <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  M
                </div>
                <div className="ml-2 text-sm font-semibold">Mary</div>
                <div className="ml-auto flex h-4 w-4 items-center justify-center rounded bg-red-500 text-xs leading-none text-white">
                  2
                </div>
              </button>
              <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200">
                  P
                </div>
                <div className="ml-2 text-sm font-semibold">Paul</div>
              </button>
              <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-200">
                  C
                </div>
                <div className="ml-2 text-sm font-semibold">Chris</div>
              </button>
              <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-200">
                  陳
                </div>
                <div className="ml-2 text-sm font-semibold">陳曉東</div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex h-full flex-auto flex-col p-6">
          <div className="flex h-full flex-auto flex-shrink-0 flex-col rounded-2xl bg-gray-100 p-4">
            <div className="mb-4 flex h-full flex-col overflow-x-auto">
              <div className="flex h-full flex-col"></div>
            </div>
            {messages.map((message, index) => (
              <div className="text-end" key={index}>
                {message.content}
              </div>
            ))}
            <div className="flex h-16 w-full flex-row items-center rounded-xl bg-white px-4">
              <div className="ml-4 flex-grow">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex h-10 w-full rounded-xl border pl-4 focus:border-indigo-300 focus:outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="ml-4">
                <button
                  onClick={handleSendMessage}
                  className="flex flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500 px-4 py-1 text-white hover:bg-indigo-600"
                >
                  <span>Send</span>
                  <span className="ml-2">
                    <svg
                      className="-mt-px h-4 w-4 rotate-45 transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatRoomWindow;
