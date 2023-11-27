import { Icon } from "@iconify/react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { showAlert } from "../../utils/showAlert";
interface ChatRoomWindowProps {
  onCloseRoom: () => void;
}
interface Message {
  content: string;
  sentBy: string;
  sentAt?: Timestamp;
  chatSessionId: string; // 根據 ChatSession 的 ID 來儲存訊息
  messageId?: string;
}
interface UserList {
  id: string;
  name: string;
}
const ChatRoomWindow = ({ onCloseRoom }: ChatRoomWindowProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState<UserList[]>([]); // 儲存用戶列表
  const [hasSearched, setHasSearched] = useState(false); // 判斷是否搜尋過了，要出現 " 查無此使用者 " 文字
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    // 訊息更新時，自動滑動到底部
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // 根據 messages 變化來觸發 ref
  useEffect(() => {
    const firestore = getFirestore();
    // 根據 chatSession 的 ID 來查詢聊天消息
    const messagesRef = collection(firestore, "messages");
    const q = query(messagesRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Message),
        messageId: doc.id,
      }));
      setMessages(newMessages);
    });
    return () => unsubscribe();
  }, []);
  const handleSendMessage = async () => {
    if (!currentUser) {
      showAlert("🚨 系統提醒", "未登入，無法傳送訊息...", "error");
      return;
    }
    if (!message.trim()) {
      showAlert("🚨 系統提醒", "請輸入文字", "info");
      return;
    }
    try {
      const firestore = getFirestore();
      await addDoc(collection(firestore, "messages"), {
        content: message,
        sentAt: serverTimestamp(),
        sentBy: currentUser.uid,
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
      showAlert("🚨 System Alert", "Message sending failed...", "error");
    }
  };

  const executeSearch = async () => {
    const firestore = getFirestore();
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("name", "==", searchQuery));
    const querySnapshot = await getDocs(q);
    setSearchQuery("");
    const users = querySnapshot.docs.map((doc) => {
      const userData = doc.data();
      return {
        id: doc.id,
        name: userData.name,
      };
    });
    setUserList(users);
    setHasSearched(true);
  };

  // 處理鍵盤事件
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      await executeSearch();
    }
  };

  // 處理點擊事件
  const handleButtonClick = async () => {
    await executeSearch();
  };
  // 移除搜尋結果
  const handleRemoveUser = (userId: string) => {
    setUserList(userList.filter((user) => user.id !== userId));
  };
  // 加一個輔助判斷函式，若不存在則返回大的數字，確保為定義的時間排在最後
  const getTimestamp = (message: Message) => {
    return message.sentAt?.toMillis() ?? Number.MAX_SAFE_INTEGER;
  };
  const handleSelectUser = (userId: string) => {
    console.log("Selected User ID:", userId);
  };
  return (
    <div className="fixed inset-0 z-50 my-auto flex h-full items-center justify-center bg-black bg-opacity-50 py-10 text-gray-800 antialiased">
      <div className="relative flex h-[70vh] w-3/4 flex-row overflow-y-auto rounded-lg bg-white p-4 shadow-lg">
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
        <div className="flex w-64 flex-shrink-0 flex-grow-0 flex-col bg-white py-1 pl-6 pr-2">
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
            <div className="ml-2 text-2xl font-bold">Chat Room</div>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="absolute right-0 top-1"
              onClick={handleButtonClick}
            >
              <Icon icon="ri:search-line" width="30" color="#e0e7ff" />
            </button>
          </div>
          <div className="overflow-auto">
            {hasSearched && userList.length === 0 ? (
              <div className="py-4 text-center">查無使用者</div>
            ) : (
              userList.map((user) => (
                <div
                  className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-gray-300"
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                >
                  {user.name}
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="mr-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="h-4 w-4"
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
                </div>
              ))
            )}
          </div>
          <div className="-mx-2 mt-4 flex h-1/2 flex-col space-y-1 overflow-y-auto">
            <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200">
                H
              </div>
              <div className="ml-2 text-sm font-semibold">Henry</div>
            </button>
            <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200">
                H
              </div>
              <div className="ml-2 text-sm font-semibold">Henry</div>
            </button>
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
            <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200">
                H
              </div>
              <div className="ml-2 text-sm font-semibold">Henry</div>
            </button>
            <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200">
                H
              </div>
              <div className="ml-2 text-sm font-semibold">Henry</div>
            </button>
            <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200">
                H
              </div>
              <div className="ml-2 text-sm font-semibold">Henry</div>
            </button>
            <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200">
                H
              </div>
              <div className="ml-2 text-sm font-semibold">Henry</div>
            </button>
            <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-200">
                C
              </div>
              <div className="ml-2 text-sm font-semibold">Chris</div>
            </button>
            <button className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-200">
                C
              </div>
              <div className="ml-2 text-sm font-semibold">Chris</div>
            </button>
          </div>
        </div>
        <div className="flex h-full flex-auto flex-col p-6">
          <div className="flex h-full flex-auto flex-shrink-0 flex-col justify-between rounded-2xl bg-gray-100 p-4">
            <div className="h-full overflow-auto">
              <div className="flex flex-grow items-center justify-between p-4">
                {messages
                  .filter((msg) => msg.content) // 過濾內容為空的訊息
                  .sort((a, b) => getTimestamp(a) - getTimestamp(b)) // 根據時間排序
                  .map((message, index) => (
                    <div
                      className="relative mb-5 ml-auto w-2/4 rounded border bg-white p-2"
                      key={index}
                    >
                      <p className="absolute left-0 top-[-15px] z-50 bg-gradient-to-r from-blue-500 via-blue-400 to-purple-300 bg-clip-text text-transparent">
                        You
                      </p>
                      {message.content}
                    </div>
                  ))}
                <div>
                  <button className="flex h-full w-12 items-center justify-center text-gray-400 hover:text-gray-600">
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
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="flex h-16 w-full flex-row items-center rounded-xl bg-white px-4">
              <div className="ml-4 flex-grow">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex h-10 w-full rounded-xl border pl-4 focus:border-indigo-300 focus:outline-none"
                  />
                  {/* emoji icon button */}
                  <button className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-gray-400 hover:text-gray-600">
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
