import { Icon } from "@iconify/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
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
interface User {
  id: string; // 使用 Firebase User ID 作為 id
  name: string;
  email: string;
}
const ChatRoomWindow = ({ onCloseRoom }: ChatRoomWindowProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState<UserList[]>([]); // 儲存用戶列表
  const [hasSearched, setHasSearched] = useState(false); // 判斷是否搜尋過了，要出現 " 查無此使用者 " 文字
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // 點擊所選的使用者進行聊天
  const [searchResults, setSearchResults] = useState<UserList[]>([]); // 新增一個狀態來單獨管理搜索結果
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = getAuth();
    const firestore = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 從 Firestore 的 users 集合中獲取用戶資料
        const userRef = doc(firestore, "users", firebaseUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          // 使用從 Firestore 獲得的名稱和電子郵件
          console.log(userData);
          setCurrentUser({
            id: firebaseUser.uid,
            name: userData.name, // 使用從 Firestore 獲得的名稱
            email: userData.email || firebaseUser.email || "未提供電子郵件",
          });
        } else {
          // 處理找不到用戶的情況
          setCurrentUser({
            id: firebaseUser.uid,
            name: "未知用戶",
            email: firebaseUser.email || "未提供電子郵件",
          });
        }
      } else {
        // 沒有用戶登入
        setCurrentUser(null);
      }
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
  useEffect(() => {
    const firestore = getFirestore();
    const usersRef = collection(firestore, "users");
    const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
      const activeUsers = querySnapshot.docs.map((doc) => {
        const userData = doc.data();
        return { id: doc.id, name: userData.name };
      });
      setUserList(activeUsers); // 更新用戶列表狀態
    });
    return () => unsubscribe();
  }, []);
  // 加載曾經聊過天的用戶列表
  useEffect(() => {
    if (!currentUser) return;
    const firestore = getFirestore();
    const userRef = doc(firestore, "users", currentUser.id);
    getDoc(userRef).then((docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        // 假設 userData.chattedWith 存在
        const chattedWithIds = userData.chattedWith || [];
        loadUsers(firestore, chattedWithIds);
      }
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const loadConversations = async () => {
      const firestore = getFirestore();
      const messagesRef = collection(firestore, "messages");
      // 查詢包含當前用戶 ID 的所有對話
      const q = query(
        messagesRef,
        where("chatSessionId", "array-contains", currentUser.id),
      );

      const querySnapshot = await getDocs(q);
      const userIds = new Set();

      querySnapshot.forEach((doc) => {
        const message = doc.data() as Message;
        const participantIds = message.chatSessionId.split("_");
        participantIds.forEach((id) => {
          if (id !== currentUser.id) userIds.add(id);
        });
      });

      const users = await Promise.all(
        Array.from(userIds).map(async (userId) => {
          let userRef;
          if (typeof userId === "string") {
            userRef = doc(firestore, "users", userId);
            const userSnap = await getDoc(userRef);
            return userSnap.exists()
              ? { id: userId, name: userSnap.data().name }
              : null;
          }
          return null; // 如果 userId 不是字符串，返回 null
        }),
      );
      const validUsers = users.filter(
        (user): user is UserList => user !== null,
      );
      setUserList(validUsers);
    };

    loadConversations();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const loadChattedUsers = async () => {
      const firestore = getFirestore();
      const userRef = doc(firestore, "users", currentUser.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const chattedWithIds = userData.chattedWith || [];
        loadUsers(firestore, chattedWithIds);
      }
    };

    loadChattedUsers();
  }, [currentUser]);

  const handleSendMessage = async () => {
    console.log("currentUser", currentUser);
    console.log("selectedUserId", selectedUserId);
    console.log("message", message || "無訊息");

    if (!currentUser || !selectedUserId || !message.trim()) {
      showAlert("🚨輸入不可空白", "", "error");
      return;
    }
    try {
      const firestore = getFirestore();
      // 發送訊息到 'messages' 集合
      await addDoc(collection(firestore, "messages"), {
        content: message,
        sentAt: serverTimestamp(),
        sentBy: currentUser.id,
        chatSessionId: `${currentUser.id}_${selectedUserId}`, // 與選中用戶的對話
      });

      // 更新當前用戶的 'users' 集合
      await updateChattedWith(firestore, currentUser.id, selectedUserId);
      // 更新選中用戶的 'users' 集合
      await updateChattedWith(firestore, selectedUserId, currentUser.id);

      // 重新加載曾經聊過天的用戶列表
      const userRef = doc(firestore, "users", currentUser.id);
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const chattedWithIds = userData.chattedWith || [];
          loadUsers(firestore, chattedWithIds);
        }
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
      showAlert("🚨 System Alert", "Message sending failed...", "error");
    }
  };

  // 更新聊過天的用戶列表的函數
  const updateChattedWith = async (
    firestore: Firestore,
    userId: string,
    chattedWithId: string,
  ) => {
    const userRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const chattedWith = new Set<string>(userData.chattedWith || []);
      chattedWith.add(chattedWithId);
      await setDoc(
        userRef,
        { chattedWith: Array.from(chattedWith) },
        { merge: true },
      );
    }
  };
  const loadUsers = async (firestore: Firestore, userIds: string[]) => {
    const newUsers: User[] = [];
    for (const userId of userIds) {
      const userRef = doc(firestore, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        if (userData.id !== currentUser?.id) {
          newUsers.push({
            id: userId,
            name: userData.name,
            email: userData.email,
          });
        }
      }
    }
    // 只在有新用戶時更新 userList
    if (JSON.stringify(newUsers) !== JSON.stringify(userList)) {
      setUserList(newUsers);
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
    setSearchResults(users); // 更新搜索結果狀態
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

  const handleKeyDownSendMessage = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault(); // 防止輸入時換行
      await handleSendMessage();
    }
  };
  // 處理點擊事件
  const handleButtonClick = async () => {
    await executeSearch();
  };
  // 移除搜尋結果
  const handleRemoveUser = (userId: string) => {
    setSearchResults(searchResults.filter((user) => user.id !== userId));
  };
  // 加一個輔助判斷函式，若不存在則返回大的數字，確保為定義的時間排在最後
  const getTimestamp = (message: Message) => {
    return message.sentAt?.toMillis() ?? Number.MAX_SAFE_INTEGER;
  };
  const handleSelectUser = async (userId: string) => {
    console.log("選擇的用戶 ID:", userId);

    setSelectedUserId(userId); // 設置所選用戶的 ID
    setMessages([]); // 清空當前訊息
    if (!currentUser || !userId) return;

    const firestore = getFirestore();

    // 從 Firestore 加載選擇的用戶訊息，並更新用戶列表
    const selectedUserRef = doc(firestore, "users", userId);
    const selectedUserSnap = await getDoc(selectedUserRef);
    if (selectedUserSnap.exists()) {
      const selectedUserData = selectedUserSnap.data();
      setUserList((prevUserList) => {
        // 確保用戶列表不包含重複的用戶
        const updatedUserList = prevUserList.filter(
          (user) => user.id !== userId,
        );
        return [
          ...updatedUserList,
          { id: userId, name: selectedUserData.name },
        ];
      });
    }

    // 加載與選擇的用戶的對話
    const messagesRef = collection(firestore, "messages");
    const q = query(
      messagesRef,
      where("chatSessionId", "in", [
        `${currentUser.id}_${userId}`,
        `${userId}_${currentUser.id}`,
      ]),
    );
    const querySnapshot = await getDocs(q);
    const userMessages = querySnapshot.docs.map((doc) => doc.data() as Message);
    setMessages(userMessages);
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
            <div className="mt-2 text-lg font-semibold">
              {currentUser ? currentUser.name : "加載中..."}
            </div>
            <div className="text-xs text-gray-500">{currentUser?.email}</div>
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
            {hasSearched && searchResults.length === 0 ? (
              <div className="py-4 text-center">查無使用者</div>
            ) : (
              searchResults.map((user) => (
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
            {userList.map((user) => (
              <button
                className="flex flex-row items-center rounded-xl p-2 hover:bg-gray-100"
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200">
                  {user.name ? user.name.charAt(0).toLocaleUpperCase() : ""}{" "}
                  {/* 檢查 user.name 是否存在 */}
                </div>
                <div className="ml-2 text-sm font-semibold">{user.name}</div>
              </button>
            ))}
          </div>
        </div>
        {/* 聊天視窗主體 */}
        <div className="flex h-full flex-auto flex-col overflow-y-auto p-6">
          {selectedUserId && (
            <div className="flex h-full flex-auto flex-shrink-0 flex-col justify-between break-words rounded-2xl bg-gray-100 p-4">
              <div className="h-full overflow-auto">
                {/* 訊息列表 */}
                <div className="flex flex-grow flex-col items-center justify-between p-4">
                  <div className="mb-10 bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text text-center text-2xl font-black text-transparent">
                    {selectedUserId
                      ? `You are contacting ${
                          userList.find((user) => user.id === selectedUserId)
                            ?.name || "未知用戶"
                        } ...`
                      : "請選擇一個用戶以開始聯繫"}
                  </div>
                  {messages
                    .filter((msg) => msg.content) // 過濾空白的訊息
                    .sort((a, b) => getTimestamp(a) - getTimestamp(b)) // 照時間排序
                    .map((message, index) => {
                      const isCurrentUserMessage =
                        message.sentBy === currentUser?.id;
                      const messageTime =
                        message.sentAt?.toDate().toLocaleString() || "时间未知";
                      return (
                        <>
                          <time
                            className={`text-right text-xs text-gray-500 mb-8 ${
                              isCurrentUserMessage ? "mr-2" : ""
                            }`}
                          >
                            {messageTime}
                          </time>
                          <div
                            className={`relative mb-5 max-w-[50%] rounded border p-2 text-lg ${
                              isCurrentUserMessage
                                ? "ml-auto bg-blue-100"
                                : "mr-auto bg-gray-200"
                            }break-all text-gray-400`} // 如果是當前使用者，自己的訊息靠右，對方的靠左
                            key={index}
                          >
                            <p
                              className={`absolute top-[-20px] text-xl ${
                                isCurrentUserMessage
                                  ? "right-1 bg-gradient-to-r from-blue-800 via-blue-700 to-purple-600 bg-clip-text text-transparent"
                                  : "left-0 text-gray-700"
                              }`}
                            >
                              {isCurrentUserMessage
                                ? "You"
                                : userList.find(
                                    (user) => user.id === message.sentBy,
                                  )?.name || "未知用户"}
                            </p>
                            {message.content}
                            {/* <time
                              className={`text-right text-xs text-gray-500 absolute bottom-[-5px] right-0 ${
                                isCurrentUserMessage ? "mr-2" : ""
                              }`}
                            >
                              {messageTime}
                            </time> */}
                          </div>
                        </>
                      );
                    })}
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
                      onKeyDown={handleKeyDownSendMessage}
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
          )}
        </div>
      </div>
    </div>
  );
};
export default ChatRoomWindow;
