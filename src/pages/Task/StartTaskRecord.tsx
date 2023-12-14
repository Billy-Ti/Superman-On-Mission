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
  const [hoverText, setHoverText] = useState("查看任務詳情 >>");
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
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col border-2 border-gray-200 p-3"
          >
            <div className="space-y-4 lg:justify-between  lg:space-y-0">
              <div className="flex-1 space-y-4 lg:space-y-0 ">
                <div className="relative">
                  {task.photos?.[0] ? (
                    <img
                      src={task.photos[0]}
                      alt="任務"
                      className="mb-4 h-60 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center font-extrabold">
                      <span className="text-center">未提供圖片</span>
                    </div>
                  )}
                  {task.isUrgent && (
                    <div className="absolute -right-[20px] -top-[20px] h-10 w-10">
                      <Icon
                        icon="bxs:label"
                        color="red"
                        width="40"
                        height="40"
                        rotate={1}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white">
                        急
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <div className="mb-4 flex flex-col items-center justify-between">
                    <p className="mb-3 text-2xl underline">{task.title}</p>
                    <h5 className="rounded-md bg-gray-400 p-1 text-white">
                      {task.categorys
                        .map((category) => `#${category}`)
                        .join(" ")}
                    </h5>
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

              <div className="text-lg font-medium">
                <p className="mb-3">支付 Super Coins : {task.cost}</p>
                <p className="mb-3">任務截止日期 : {task.dueDate}</p>
                <div className="mb-3 mt-1">
                  <span>任務狀態 :</span>
                  <span
                    className={`ml-2 ${
                      task.status === "已完成" ? "text-[#3178C6]" : ""
                    }`}
                  >
                    {task.status || "未知"}
                  </span>
                </div>
              </div>

              {/* 查看任务详情按钮 */}
              <div className="mt-4 lg:mt-0">
                <button
                  type="button"
                  className="w-full cursor-pointer rounded-md bg-gray-200 px-6 py-3 hover:bg-sky-600 hover:text-white"
                  onMouseMove={() => setHoverText("發案紀錄查詢 >>")}
                  onMouseOut={() => setHoverText("查看任務詳情 >>")}
                  onClick={() => handleStartTask(task.id)}
                >
                  {hoverText}
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
