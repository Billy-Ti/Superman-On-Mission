import { Icon } from "@iconify/react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";

interface Task {
  id: string;
  cost: number;
  dueDate: string;
  isUrgent: boolean;
  title: string;
  city: string;
  district: string;
  address: string;
  status: string;
  categorys: string[];
  photos?: string[];
  createdBy: string;
}

const StartTaskRecord = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  const handleStartTask = (taskId: string) => {
    navigate(`/detail/${taskId}`);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log("沒有用戶登錄");
        return;
      }

      // 只獲取由當前用戶創建的任務
      const q = query(
        collection(db, "tasks"),
        where("createdBy", "==", currentUser.uid),
      );

      const querySnapshot = await getDocs(q);
      const fetchedTasks: Task[] = querySnapshot.docs
        .map((doc) => {
          const task = doc.data() as Task;
          return { ...task, id: doc.id };
        })
        .filter((task) => task.status !== "已完成"); // 過濾掉已完成的任務

      setTasks(fetchedTasks);
    };

    fetchTasks();
  }, []);
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col border-2 border-gray-200 bg-white p-4 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl"
          >
            <div className="flex flex-1 flex-col space-y-4  lg:justify-between lg:space-y-0">
              <div className="space-y-4 lg:space-y-0 ">
                <div className="">
                  {task.photos?.[0] ? (
                    <img
                      src={task.photos[0]}
                      alt="任務"
                      className="mb-4 h-60 w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center font-extrabold">
                      <span className="text-center">未提供圖片</span>
                    </div>
                  )}
                  {task.isUrgent ? (
                    <div className="absolute right-0 top-0 h-10 w-10 p-2">
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
                  ) : (
                    <>
                      <div className="absolute right-0 top-0 h-10 w-10 p-2">
                        <Icon
                          className="absolute inset-0"
                          icon="bxs:label"
                          color="#3178C6"
                          width="40"
                          height="40"
                          rotate={3}
                          hFlip={true}
                          vFlip={true}
                        />
                        <span className="absolute inset-0 flex items-center justify-center font-semibold text-white">
                          推
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <div className="mb-4 flex flex-col items-center">
                    <p className="mb-3 text-2xl font-semibold">{task.title}</p>
                    <div className="flex flex-wrap">
                      {task.categorys.map((category) => (
                        <span
                          key={category}
                          className="mr-2 rounded-md bg-gray-400 p-1 font-medium text-white"
                        >
                          #{category}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-medium mb-5 flex items-center justify-center font-medium text-gray-500">
                    <Icon icon="mdi:location" />
                    <a
                      href={`https://www.google.com/maps/search/${task.city}${task.district}${task.address}`}
                      target="_blank"
                      className="ml-2"
                    >
                      {task.city} {task.district} {task.address}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center text-lg font-medium">
                <p className="mb-3">支付 Super Coins : {task.cost}</p>
                <p className="mb-3">任務截止日期 : {task.dueDate}</p>
                <div className="mb-3 mt-1">
                  <span
                    className={`ml-2 ${
                      task.status === "已完成"
                        ? "font-bold text-[#3178C6]"
                        : task.status === "任務媒合中"
                          ? "text-gray-700"
                          : task.status === "任務進行中"
                            ? "text-green-500"
                            : task.status === "任務回報完成"
                              ? "text-red-500"
                              : ""
                    }`}
                  >
                    任務狀態 :
                  </span>
                  <span
                    className={`ml-2 ${
                      task.status === "已完成"
                        ? "font-bold text-[#3178C6]"
                        : task.status === "任務媒合中"
                          ? "text-gray-700"
                          : task.status === "任務進行中"
                            ? "text-green-500"
                            : task.status === "任務回報完成"
                              ? "text-red-500"
                              : ""
                    }`}
                  >
                    {task.status || "未知"}
                  </span>
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleStartTask(task.id)}
                  type="button"
                  className="w-full items-center justify-center rounded-md bg-[#368DCF] p-3 text-xl font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
                >
                  <Icon
                    icon="icon-park:click-tap"
                    className="mr-2 inline-block h-6 w-6 text-black hover:text-white"
                  />
                  查看任務詳情
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default StartTaskRecord;
