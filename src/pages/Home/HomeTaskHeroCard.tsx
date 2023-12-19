import { Icon } from "@iconify/react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
interface User {
  name: string;
  averageRating: number;
  profilePicUrl: string;
}
const HomeTaskHeroCard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const q = query(collection(db, "users"), where("averageRating", ">=", 4));
      const querySnapshot = await getDocs(q);
      const fetchedUsers: User[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push(doc.data() as User);
      });
      setUsers(fetchedUsers);
    };
    fetchData();
  }, []);
  
  console.log(users);

  return (
    <div className="container mx-auto max-w-[1280px] px-4 py-10 md:px-20 md:pb-0 md:pt-20">
      <div className="px-4 text-center md:px-0">
        <div className="relative inline-block px-1 py-3">
          <Icon
            className="absolute -top-[10px] left-[20px] -translate-x-full -translate-y-1/2 transform"
            icon="mdi:crown"
            color="#2B79B4"
            width="50"
            height="50"
            rotate={1.5}
          />
          <p className="mb-3 text-3xl font-bold">優秀超人榜</p>
          <div className="mx-auto mb-10 h-[10px] w-4/5 bg-[#2B79B4]"></div>
        </div>
      </div>
      {/* <div className="relative mb-20 select-none">
        <div className="container relative mx-[auto] my-[0] h-[200px] w-[250px] [perspective:1000px]">
          <div
            className="carousel absolute h-full w-full [transform-style:preserve-3d] [transition:transform_1s]"
            style={{
              transform: `rotateY(${currdeg}deg)`,
            }}
          >
            {renderBlocks()}
          </div>
        </div>
        <button
          type="button"
          className="next absolute right-[20px] top-[-90px] mx-auto bg-transparent sm:bottom-0 sm:right-[10%] sm:top-0"
          onClick={() => rotate("next")}
        >
          <Icon
            icon="icon-park-outline:right-c"
            color="#2B79B4"
            width="30"
            height="30"
          />
        </button>
        <button
          type="button"
          className="next absolute left-[20px] top-[-90px] mx-auto bg-transparent sm:bottom-0 sm:left-[10%] sm:top-0"
          onClick={() => rotate("prev")}
        >
          <Icon
            icon="icon-park-outline:left-c"
            color="#2B79B4"
            width="30"
            height="30"
          />
        </button>
      </div> */}
    </div>
  );
};
export default HomeTaskHeroCard;
