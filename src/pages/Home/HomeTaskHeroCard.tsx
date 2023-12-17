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
  // const [currdeg, setCurrdeg] = useState(0);
  // const rotate = (direction: "next" | "prev") => {
  //   setCurrdeg((prevDegree) => prevDegree + (direction === "next" ? -60 : 60));
  // };
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
  // 依照資料庫 averageRating = 4 or 5 來渲染對應的英雄榜卡片
  // const renderBlocks = () => {
  //   const blocks = [];
  //   const defaultProfilePic =
  //     "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // 預設用戶圖片 URL
  //   for (let i = 0; i < 6; i++) {
  //     const bgColor = i % 2 === 0 ? "bg-[#bfdbfe]" : "bg-[#f7f4f0]"; // 奇偶數分別不同背景色
  //     const transformClass = `rotate-${i * 60}`;
  //     if (i < users.length) {
  //       const user = users[i];
  //       const profilePicUrl = user.profilePicUrl || defaultProfilePic;
  //       blocks.push(
  //         <InteractiveBlock
  //           key={i}
  //           bgColor={bgColor}
  //           transformClass={transformClass}
  //           content={
  //             <>
  //               <img
  //                 src={profilePicUrl}
  //                 alt="user-picture"
  //                 className="mb-4 h-32 w-32 rounded-full object-cover"
  //               />
  //               <div className="flex items-center font-semibold text-gray-600">
  //                 <p className="mb-2 text-xl">{user.name}</p>
  //               </div>
  //               <div className="flex items-center font-semibold text-gray-600">
  //                 <div className="flex text-center">
  //                   {renderStars(user.averageRating)}
  //                 </div>
  //               </div>
  //             </>
  //           }
  //         />,
  //       );
  //     } else {
  //       blocks.push(
  //         <InteractiveBlock
  //           key={i}
  //           bgColor={bgColor}
  //           transformClass={transformClass}
  //           content={
  //             <div className="flex h-full w-full flex-col items-center justify-center gap-4 font-semibold text-gray-600">
  //               <p className="text-lg">等您來上榜</p>
  //               <Link
  //                 to="/acceptTask"
  //                 className="text-medium rounded-md bg-[#368DCF] px-2 py-1 font-medium tracking-wider text-white transition duration-500 ease-in-out hover:bg-[#3178C6]"
  //               >
  //                 開始
  //               </Link>
  //             </div>
  //           }
  //         />,
  //       );
  //     }
  //   }
  //   return blocks;
  // };
  // 渲染星等 function
  // const renderStars = (rating: number) => {
  //   const stars = [];
  //   for (let i = 0; i < rating; i++) {
  //     stars.push(
  //       <Icon
  //         key={i}
  //         icon="mingcute:star-fill"
  //         color="#ffc107"
  //         width="15"
  //         height="15"
  //         className="mr-2 flex"
  //       />,
  //     );
  //   }
  //   return stars;
  // };
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
