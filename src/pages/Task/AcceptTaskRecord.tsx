import { Icon } from "@iconify/react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
interface Task {
  id: string;
  title: string;
  city: string;
  district: string;
  address: string;
  categorys: string[];
  dueDate: string;
  isUrgent: boolean;
  photos?: string[];
  status: string;
}
const AcceptTaskRecord = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hoverText, setHoverText] = useState("查看任務詳情 >>");
  const navigate = useNavigate();
  const handleViewTaskDetails = (taskId: string) => {
    navigate(`/acceptTaskDetail/${taskId}`); // 導航到任務詳情頁面
  };
  useEffect(() => {
    const fetchTasks = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("沒有用戶登錄");
        return;
      }
      const q = query(
        collection(db, "tasks"),
        where("acceptedBy", "==", currentUser.uid), // 只獲取由當前用戶接受的任務
      );
      const querySnapshot = await getDocs(q);
      const fetchedTasks: Task[] = querySnapshot.docs
        .map((doc) => {
          const task = doc.data() as Task;
          return { ...task, id: doc.id };
        })
        .filter((task) => task.status !== "已完成");
      setTasks(fetchedTasks);
    };
    fetchTasks();
  }, []);
  return (
    <>
      <div className="container mx-auto py-8">
        {tasks.map((task) => (
          <div key={task.id} className="border-2 border-gray-200 pb-6">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-start">
                <div className="relative border-2 border-dashed border-[#368dcf] p-2">
                  {task.photos?.[0] ? (
                    <img
                      src={task.photos[0]}
                      alt="任務"
                      className="h-32 w-32 object-cover"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center font-extrabold">
                      <span className="text-center">未提供圖片</span>
                    </div>
                  )}
                  {task.isUrgent && (
                    <div className="absolute -right-[20px] -top-[20px] h-10 w-10 p-2">
                      <Icon
                        className="absolute inset-0"
                        icon="bxs:label"
                        color="red"
                        width="40"
                        height="40"
                        rotate={3}
                        hFlip={true}
                        vFlip={true}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white">
                        急
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-8">
                  <div className="mb-4 flex items-center">
                    <p className="mr-5 text-2xl underline">{task.title}</p>
                    <h5 className="rounded-md bg-gray-400 p-1 font-medium text-white">
                      {task.categorys
                        .map((category) => `#${category}`)
                        .join(" ")}
                    </h5>
                  </div>
                  <div className="mb-4 mt-1 flex items-center text-lg font-medium">
                    <a
                      title="查看地圖"
                      href={`https://www.google.com/maps/search/${task.city}${task.district}${task.address}`}
                      target="_blank"
                      className="flex items-center"
                    >
                      <Icon icon="mdi:location" />
                      {task.city}
                      {task.district}
                      {task.address}
                    </a>
                  </div>
                  <div className="mb-4 flex text-lg font-medium">
                    <p className="mr-1">任務截止日期 :</p>
                    <span>{task.dueDate}</span>
                  </div>
                  <div className="mt-1">
                    <span
                      className={`text-lg ${
                        task.status === "任務媒合中"
                          ? "text-gray-400"
                          : task.status === "已完成"
                            ? "font-black text-[#3178C6]"
                            : ""
                      }`}
                    >
                      任務狀態 :
                    </span>
                    <span
                      className={`ml-2 text-lg ${
                        task.status === "已完成"
                          ? "font-black text-[#3178C6]"
                          : ""
                      }`}
                    >
                      {task.status || "未知"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-md bg-gray-200 px-6 py-3 [transform:translateZ(0)] before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-[100%_100%] before:scale-x-0 before:bg-sky-600 before:transition before:duration-500 before:ease-in-out hover:before:origin-[0_0] hover:before:scale-x-100"
                  onMouseMove={() => setHoverText("接案紀錄查詢 >>")}
                  onMouseOut={() => setHoverText("查看任務詳情 >>")}
                  onClick={() => handleViewTaskDetails(task.id)}
                >
                  <span className="relative z-0 text-black transition duration-500 ease-in-out group-hover:text-gray-200">
                    {hoverText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="mb-10 h-5 bg-[#2B79B4]"></div>
      </div>
    </>
  );
};
export default AcceptTaskRecord;
