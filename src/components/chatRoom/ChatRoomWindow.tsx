import { Icon } from "@iconify/react";
import EmojiPicker from "emoji-picker-react";
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
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { showAlert } from "../../utils/showAlert";
import ChatRoomTitle from "./ChatRoomTitle";
interface ChatRoomWindowProps {
  onCloseRoom: () => void;
}
interface Message {
  content: string;
  sentBy: string;
  sentAt?: Timestamp;
  sentTo: string;
  isRead: boolean;
  chatSessionId: string; // 根據 ChatSession 的 ID 來儲存訊息
  messageId?: string;
}
interface UserList {
  id: string;
  name: string;
  unreadCount?: number; // 未讀消息數量
}
interface User {
  id: string; // 使用 Firebase User ID 作為 id
  name: string;
  email: string;
  profilePicUrl: string;
}

interface EmojiObject {
  emoji: string;
  // 在這裡可以添加更多的屬性，如果需要的話
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
  const [selectedUserName, setSelectedUserName] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const defaultProfilePic =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const isInitialMount = useRef(true);

  const onEmojiClick = (emojiObject: EmojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // 延遲滾動以確保 DOM 完全更新
      const timer = setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
      }, 50); // 延遲 100 毫秒

      return () => clearTimeout(timer);
    }
  }, [messages]);

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
            profilePicUrl: userData.profilePicUrl,
          });
        } else {
          // 處理找不到用戶的情況
          setCurrentUser({
            id: firebaseUser.uid,
            name: "未知用戶",
            email: firebaseUser.email || "未提供電子郵件",
            profilePicUrl:
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
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

  const loadUnreadCounts = async (users: UserList[], currentUser: User) => {
    const updatedUsers = [];
    for (const user of users) {
      const q = query(
        collection(getFirestore(), "messages"),
        where("sentBy", "==", user.id),
        where("sentTo", "==", currentUser.id),
        where("isRead", "==", false),
      );
      const snapshot = await getDocs(q);
      updatedUsers.push({
        ...user,
        unreadCount: snapshot.docs.length,
      });
    }
    return updatedUsers;
  };
  // 加載曾經聊過天的用戶列表
  useEffect(() => {
    if (!currentUser) return;
    const firestore = getFirestore();

    const userRef = doc(firestore, "users", currentUser.id);
    getDoc(userRef).then(async (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const chattedWithIds = userData.chattedWith || [];
        const users = await loadUsers(firestore, chattedWithIds);
        const usersWithUnreadCounts = await loadUnreadCounts(
          users,
          currentUser,
        );
        setUserList(usersWithUnreadCounts);
      }
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const loadConversations = async () => {
      const firestore = getFirestore();
      const messagesRef = collection(firestore, "messages");
      // 查詢當前用戶發起的對話
      const q = query(messagesRef, where("sentBy", "==", currentUser.id));

      const querySnapshot = await getDocs(q);
      const userIds = new Set<string>();

      querySnapshot.forEach((doc) => {
        const message = doc.data() as Message;
        // 只添加對話接收方的ID
        const otherUserId = message.chatSessionId
          .replace(`${currentUser.id}_`, "")
          .replace(`_${currentUser.id}`, "");
        userIds.add(otherUserId);
      });

      const users = await Promise.all(
        Array.from(userIds).map(async (userId) => {
          const userRef = doc(firestore, "users", userId);
          const userSnap = await getDoc(userRef);
          return userSnap.exists()
            ? { id: userId, name: userSnap.data().name }
            : null;
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
    const firestore = getFirestore();

    const userRef = doc(firestore, "users", currentUser.id);
    getDoc(userRef).then(async (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const chattedWithIds = userData.chattedWith || [];
        const users = await loadUsers(firestore, chattedWithIds);
        const usersWithUnreadCounts = await loadUnreadCounts(
          users,
          currentUser,
        );
        setUserList(usersWithUnreadCounts);
      }
    });
  }, [currentUser]);

  const handleSendMessage = async () => {
    if (!currentUser || !selectedUserId || !message.trim()) {
      showAlert("🚨 系統提醒", "未選擇聊天對象或未登入", "error");
      return;
    }

    try {
      const firestore = getFirestore();

      // 發送訊息到 'messages' 集合
      await addDoc(collection(firestore, "messages"), {
        content: message,
        sentAt: serverTimestamp(),
        sentBy: currentUser.id,
        chatSessionId: `${currentUser.id}_${selectedUserId}`,
        sentTo: selectedUserId,
        isRead: false,
      });

      // 更新用戶間的對話記錄
      await updateChattedWith(firestore, currentUser.id, selectedUserId);
      await updateChattedWith(firestore, selectedUserId, currentUser.id);

      // 重新加載與選中用戶的對話
      loadMessagesForSelectedUser(firestore, selectedUserId);

      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
      showAlert("🚨 System Alert", "Message sending failed...", "error");
    }
  };

  const loadMessagesForSelectedUser = async (
    firestore: Firestore,
    userId: string,
  ) => {
    if (!currentUser || !userId) return;

    // 先清空當前訊息列表，避免閃屏看到上一位使用者的對話
    setMessages([]);

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
    setMessages(userMessages.sort((a, b) => getTimestamp(a) - getTimestamp(b)));
  };

  // 更新聊過天的用戶列表的 func
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

  const loadUsers = async (
    firestore: Firestore,
    userIds: string[],
  ): Promise<UserList[]> => {
    const users: UserList[] = [];
    for (const userId of userIds) {
      const userRef = doc(firestore, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        if (userData.id !== currentUser?.id) {
          // 確保不加載當前用戶自己
          users.push({
            id: userId,
            name: userData.name,
          });
        }
      }
    }
    return users;
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
    const selectedUser = userList.find((user) => user.id === userId);
    if (selectedUser) {
      // 如果在 userList 中找到了用戶，直接設置用戶名稱
      setSelectedUserName(selectedUser.name);
    } else {
      // 如果在 userList 中沒有找到用戶，從 Firestore 中查詢用戶資訊
      const firestore = getFirestore();
      const userRef = doc(firestore, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setSelectedUserName(userData.name);
      } else {
        setSelectedUserName("未知用戶");
      }
    }

    setSelectedUserId(userId); // 設置所選用戶的 ID

    setSelectedUserId(userId); // 設置所選用戶的 ID
    setMessages([]); // 清空當前訊息

    if (!currentUser || !userId) return;

    const firestore = getFirestore();

    // 標記與選定用戶的所有未讀消息為已讀
    const messagesRef = collection(firestore, "messages");
    const q = query(
      messagesRef,
      where("sentTo", "==", currentUser.id),
      where("sentBy", "==", userId),
      where("isRead", "==", false),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { isRead: true });
    });

    // 加載與選擇的用戶的對話
    const q2 = query(
      messagesRef,
      where("chatSessionId", "in", [
        `${currentUser.id}_${userId}`,
        `${userId}_${currentUser.id}`,
      ]),
    );
    const querySnapshot2 = await getDocs(q2);
    const userMessages = querySnapshot2.docs.map(
      (doc) => doc.data() as Message,
    );
    const updatedUserList = await loadUnreadCounts(userList, currentUser);
    setUserList(updatedUserList);
    setMessages(userMessages.sort((a, b) => getTimestamp(a) - getTimestamp(b)));
  };

  return (
    <div className="fixed inset-0 z-50 my-auto flex h-full items-center justify-center bg-black bg-opacity-50 py-10 text-gray-800 antialiased">
      <div className="relative flex h-[95vh] w-3/4 flex-col overflow-y-auto rounded-md bg-white p-4 shadow-lg lg:h-[70vh] lg:flex-row">
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
        <div className="flex w-full flex-shrink-0 flex-grow-0 flex-col bg-white py-1 pl-6 pr-2 lg:w-64">
          {/* 聊天室窗標題 */}
          <ChatRoomTitle />
          <div className="mb-2 mt-1 flex w-full flex-col items-center rounded-md border border-gray-200 bg-indigo-100 px-4 py-1">
            <div className="h-20 w-20 overflow-hidden rounded-full border">
              <img
                src={currentUser?.profilePicUrl || defaultProfilePic}
                alt="superman-pic"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-2 text-lg font-semibold">
              {currentUser ? currentUser.name : "加載中..."}
            </div>
            <div className="text-xs text-gray-500">{currentUser?.email}</div>
          </div>
          <div className="mb-2 flex flex-row items-center justify-between px-2 text-xs"></div>
          <div className="relative ">
            <input
              className="w-full rounded-md border p-2 focus:outline-none"
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
                  className="flex h-[50px] cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-300"
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
          <div className="-mx-2 flex h-[150px] flex-col space-y-1 overflow-y-auto lg:h-1/2">
            {userList.map((user) => (
              <button
                className="relative flex flex-row items-center rounded-md p-2 hover:rounded-md hover:bg-gray-100"
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200">
                  {user.name ? user.name.charAt(0).toLocaleUpperCase() : ""}{" "}
                  {/* 檢查 user.name 是否存在 */}
                </div>
                <div className="ml-2 text-sm font-semibold">{user.name}</div>
                {user.unreadCount! > 0 && (
                  <div className="absolute right-[10px] h-8 w-8">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-red-500 text-[12px] text-white">
                      {user.unreadCount}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        {/* 聊天視窗主體 */}
        <div className="flex h-full flex-auto flex-col overflow-y-auto p-6">
          {selectedUserId && (
            <div className="flex h-full flex-auto flex-shrink-0 flex-col justify-between break-words rounded-md bg-gray-100 p-4">
              <div className="h-full overflow-auto">
                {/* 訊息列表 */}
                <div className="flex flex-grow flex-col items-center justify-between p-4">
                  <div className="mb-10 bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text text-center text-2xl font-black text-transparent">
                    {`You are contacting to ${selectedUserName} ...`}
                  </div>
                  {messages
                    .filter((msg) => msg.content) // 過濾空白的訊息
                    .sort((a, b) => getTimestamp(a) - getTimestamp(b)) // 照時間排序
                    .map((message, index) => {
                      const isCurrentUserMessage =
                        message.sentBy === currentUser?.id;
                      const messageTime =
                        message.sentAt?.toDate().toLocaleString() || "時間未知";

                      return (
                        <>
                          <div
                            className={`relative mb-1 max-w-[50%] rounded-md border p-2 text-lg ${
                              isCurrentUserMessage
                                ? "ml-auto bg-blue-100"
                                : "mr-auto bg-gray-200"
                            } text-gray-400`}
                            key={index}
                          >
                            <p
                              className={`absolute top-[-24px] text-xl ${
                                isCurrentUserMessage
                                  ? "right-1 bg-gradient-to-r from-blue-800 via-blue-700 to-purple-600 bg-clip-text text-transparent"
                                  : "left-0 text-gray-700"
                              }`}
                            >
                              {isCurrentUserMessage ? (
                                <p className="whitespace-nowrap text-[16px] font-bold">
                                  You
                                </p>
                              ) : (
                                <p className="whitespace-nowrap text-[14px] font-bold">
                                  {userList.find(
                                    (user) => user.id === message.sentBy,
                                  )?.name || "未知用戶"}
                                </p>
                              )}
                            </p>
                            <p className="font-medium text-black">
                              {message.content}
                            </p>
                          </div>
                          <time
                            className={`mb-10 text-xs text-gray-400 ${
                              isCurrentUserMessage
                                ? "ml-auto text-right"
                                : "mr-auto text-left"
                            }`}
                          >
                            {messageTime}
                          </time>
                        </>
                      );
                    })}

                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="flex h-16 w-full flex-row items-center rounded-md bg-white pl-1">
                <div className="flex-grow">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDownSendMessage}
                      className="flex h-10 w-full rounded-md border pl-2 focus:border-indigo-300 focus:outline-none"
                    />
                    {showPicker && (
                      <div className="absolute -bottom-[400px] right-0 z-10 mb-2 translate-y-[-100%] transform">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </div>
                    )}
                    {/* emoji icon button */}
                    <button
                      title="來點表情符號吧~"
                      onClick={() => setShowPicker(!showPicker)}
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
                    className="flex flex-shrink-0 items-center justify-center rounded-md bg-[#368DCF] p-3 px-4 py-1 text-xl font-medium tracking-wider text-white transition duration-500 ease-in-out hover:bg-[#3178C6]"
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
