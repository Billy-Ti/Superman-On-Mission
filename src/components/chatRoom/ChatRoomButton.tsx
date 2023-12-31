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
import ChatRoomWindow from "./index";

const ChatRoomButton = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [newMessageCount, setNewMessageCount] = useState<number>(0);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const firestore = getFirestore();
        const messagesRef = collection(firestore, "messages");
        const q = query(
          messagesRef,
          where("sentTo", "==", user.uid),
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
    }
  };

  return (
    <div className="fixed right-[1%] top-1/2 z-50">
      <button type="button" onClick={handleChatButtonClick}>
        <div className="w-50 h-50 flex items-center justify-center rounded-full bg-[#368DCF]">
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
