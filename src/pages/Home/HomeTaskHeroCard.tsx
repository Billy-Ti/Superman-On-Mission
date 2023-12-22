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
    </div>
  );
};
export default HomeTaskHeroCard;
