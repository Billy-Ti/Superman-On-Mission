import { Icon } from "@iconify/react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoRecordsComponent from "../../components/NoRecordsComponent";
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
  acceptedBy?: string;
}

const FinishTaskRecord = () => {
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

      const q = query(collection(db, "tasks"), where("status", "==", "已完成"));

      const querySnapshot = await getDocs(q);
      const fetchedTasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        const task = doc.data() as Task;
        if (
          task.createdBy === currentUser.uid ||
          task.acceptedBy === currentUser.uid
        ) {
          fetchedTasks.push({ ...task, id: doc.id });
        }
      });

      setTasks(fetchedTasks);
    };

    fetchTasks();
  }, []);
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="relative flex flex-col rounded-md border-2 border-gray-200 bg-white p-4 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl"
            >
              <div className="flex flex-1 flex-col space-y-4  lg:justify-between lg:space-y-0">
                <div className="overflow-hidden">
                  {task.photos?.[0] ? (
                    <img
                      src={task.photos[0]}
                      alt="任務"
                      className=" mb-4 h-60 w-full rounded-md object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="mb-4 flex h-60 w-full items-center justify-center border font-extrabold">
                      <span className="text-center text-lg text-gray-600">
                        無提供圖片
                      </span>
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
                  <div className="mb-4 flex flex-col items-start gap-4">
                    <p className="ai line-clamp-1 grow self-center text-2xl font-semibold">
                      {task.title}
                    </p>
                    <div className="mt-1 flex grow items-center font-semibold">
                      <a
                        href={`https://www.google.com/maps/search/${task.city}${task.district}${task.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex  items-center"
                      >
                        <Icon
                          icon="mdi:location"
                          className="mr-1 flex-shrink-0"
                          width="20"
                          height="20"
                        />
                        {task.city}
                        {task.district}
                        {task.address}
                      </a>
                    </div>
                    <h5 className="inline-flex grow font-semibold">
                      <Icon
                        icon="mdi:tag"
                        width="20"
                        height="20"
                        className="mr-1 flex-shrink-0"
                      />
                      {task.categorys.map((category, index) => (
                        <>{index > 0 ? `、${category}` : category}</>
                      ))}
                    </h5>
                    <div className="flex grow flex-col">
                      <div className="flex items-center">
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
                      <p className="flex items-center font-semibold">
                        <Icon
                          className="mr-1 flex-shrink-0"
                          icon="tabler:coin-filled"
                          width="20"
                          height="20"
                        />
                        Super Coins : {task.cost}
                      </p>
                    </div>
                    <p className="flex items-center font-semibold">
                      <Icon
                        className="mr-1 flex-shrink-0"
                        icon="fluent-mdl2:date-time"
                        width="20"
                        height="20"
                      />
                      截止日期 : {task.dueDate}
                    </p>
                  </div>
                </div>
                <div className="flex-1 text-center text-lg font-medium">
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
                                ? "text-[#368dcfea]"
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
                                ? "text-[#368dcfea]"
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
          ))
        ) : (
          <NoRecordsComponent message="暫無資料" />
        )}
      </div>
    </div>
  );
};
export default FinishTaskRecord;
