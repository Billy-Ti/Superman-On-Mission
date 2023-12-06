import { Icon } from "@iconify/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import ChatRoomWindow from "../../components/chatRoom/ChatRoomWindow";
import { db } from "../../config/firebase";
import InteractiveBlock from "../components/InteractiveBlock";

interface User {
  name: string;
  userId: string;
  averageRating: number;
}

const HomeTaskHeroCard: React.FC = () => {
  const [currdeg, setCurrdeg] = useState(0);
  const [usersWithHighRatings, setUsersWithHighRatings] = useState<User[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const bgColors = [
    "bg-[#bfdbfe]",
    "bg-[#f7f4f0]",
    "bg-[#d5adfd]",
    "bg-[#bfdbfe]",
    "bg-[#f7f4f0]",
    "bg-[#d5adfd]",
  ];

  const handleSendMessageClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsChatOpen(true);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, "users"), where("averageRating", ">=", 4));
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.name && userData.averageRating && userData.userId) {
          users.push({
            userId: userData.userId,
            name: userData.name,
            averageRating: userData.averageRating,
          });
        }
      });
      console.log(users);

      setUsersWithHighRatings(users);
    };

    fetchUsers();
  }, []);

  const rotate = (direction: "next" | "prev") => {
    setCurrdeg((prevDegree) => prevDegree + (direction === "next" ? -60 : 60));
  };

  return (
    <div className="bg-[#c4cdfd] pb-10 pt-20">
      <div className="container mx-auto max-w-[1280px] px-4 pt-4 md:px-20">
        <div className="mb-10 px-4 text-center md:px-0 lg:text-left">
          <p className="inline bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text text-4xl font-black italic text-transparent">
            優秀的 Tasker
          </p>
        </div>
        <div className="relative mb-20 select-none">
          <div className="container relative mx-[auto] my-[0] h-[200px] w-[250px] [perspective:1000px]">
            <div
              className="carousel absolute h-full w-full cursor-pointer [transform-style:preserve-3d] [transition:transform_1s]"
              style={{ transform: `rotateY(${currdeg}deg)` }}
            >
              {usersWithHighRatings.length === 0 ? (
                <InteractiveBlock
                  key={`additional-placeholder`}
                  bgColor={bgColors[0]}
                  transform={`[transform:rotateY(0deg)_translateZ(250px)]`}
                  content={
                    <>
                      <div className="flex items-center bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text text-gray-600 text-transparent">
                        <p className="text-[1em]">等您站上超人榜</p>
                      </div>
                    </>
                  }
                />
              ) : (
                usersWithHighRatings.slice(0, 6).map((user, index) => (
                  <InteractiveBlock
                    key={index}
                    userId={user.userId}
                    onSendMessageClick={handleSendMessageClick}
                    bgColor={bgColors[index % bgColors.length]}
                    transform={`[transform:rotateY(${
                      index * 60
                    }deg)_translateZ(250px)]`}
                    content={
                      <>
                        <img
                          src="/slogan.png"
                          alt="描述"
                          className="mb-4 h-32 w-32 rounded-full"
                        />
                        <div className="flex items-center text-gray-600">
                          <p className="text-[1em]">Tasker Name: {user.name}</p>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <p className="text-[1em]">
                            Average rating: {user.averageRating}/5
                          </p>
                        </div>
                      </>
                    }
                  />
                ))
              )}
            </div>
          </div>
          {usersWithHighRatings.length > 0 && (
            <>
              <button
                type="button"
                className="next absolute right-[20px] top-[-90px] mx-auto bg-transparent sm:bottom-0 sm:right-[10%] sm:top-0"
                onClick={() => rotate("next")}
              >
                <Icon
                  icon="icon-park-outline:right-c"
                  color="#9193f4"
                  width="50"
                  height="50"
                />
              </button>
              <button
                type="button"
                className="next absolute left-[20px] top-[-90px] mx-auto bg-transparent sm:bottom-0 sm:left-[10%] sm:top-0"
                onClick={() => rotate("prev")}
              >
                <Icon
                  icon="icon-park-outline:left-c"
                  color="#9193f4"
                  width="50"
                  height="50"
                />
              </button>
            </>
          )}
        </div>
      </div>
      {isChatOpen && (
        <ChatRoomWindow
          onSelectUser={() => {}}
          onCloseRoom={() => setIsChatOpen(false)}
          externalSelectedUserId={selectedUserId}
        />
      )}
    </div>
  );
};

export default HomeTaskHeroCard;
