import { Icon } from "@iconify/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatRoomWindow from "./ChatRoomWindow";

const ChatRoomButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleChatButtonClick = () => {
    if (isUserLoggedIn) {
      setIsChatOpen(true);
    } else {
      navigate("/SignIn"); // 導航到登入頁面
    }
  };

  return (
    <div className="fixed right-[1%] top-1/2">
      <button type="button" onClick={handleChatButtonClick}>
        <div className="w-50 h-50 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-400">
          <Icon
            icon="uiw:message"
            color="white"
            width="50"
            height="50"
            hFlip={true}
          />
        </div>
      </button>
      {isChatOpen && (
        <ChatRoomWindow onCloseRoom={() => setIsChatOpen(false)} />
      )}
    </div>
  );
};

export default ChatRoomButton;
