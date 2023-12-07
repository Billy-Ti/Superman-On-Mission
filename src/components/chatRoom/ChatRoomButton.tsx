import { Icon } from "@iconify/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatRoomWindow from "./ChatRoomWindow";

const ChatRoomButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 用戶已登錄，監聽新消息
        const firestore = getFirestore();
        const messagesRef = collection(firestore, "messages");
        const q = query(
          messagesRef,
          where("sentTo", "==", user.uid), // 根據您的數據模型調整此條件
          where("isRead", "==", false),
        );
        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
          setNewMessageCount(snapshot.docs.length);
        });
        return () => unsubscribeMessages();
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleChatButtonClick = () => {
    if (auth.currentUser) {
      setIsChatOpen(true);
    } else {
      navigate("/SignIn");
    }
  };

  return (
    <div className="fixed right-[1%] top-1/2 z-50">
      <button type="button" onClick={handleChatButtonClick}>
        <div className="w-50 h-50 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-400">
          <Icon
            icon="uiw:message"
            color="white"
            width="50"
            height="50"
            hFlip={true}
          />
          {newMessageCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              !
            </span>
          )}
        </div>
      </button>
      {isChatOpen && (
        <ChatRoomWindow onCloseRoom={() => setIsChatOpen(false)} />
      )}
    </div>
  );
};

export default ChatRoomButton;
