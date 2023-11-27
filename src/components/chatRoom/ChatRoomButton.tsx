import { Icon } from "@iconify/react";
import { useState } from "react";
import ChatRoomWindow from "./ChatRoomWindow";

const ChatRoomButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <div className="fixed right-0 top-1/2">
      <button
        type="button"
        onClick={() => {
          setIsChatOpen(true);
        }}
      >
        <div className="w-50 h-50 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-400">
          <Icon
            icon="uiw:message"
            color="white"
            width="60"
            height="60"
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
