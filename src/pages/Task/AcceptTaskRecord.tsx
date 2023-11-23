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
      const tasksData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Task[];

      setTasks(tasksData);
    };

    fetchTasks();
  }, []);

  return (
    <>
      {tasks.map((task) => (
        <div key={task.id} className="border-2 border-gray-200 p-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-start">
              <div className="h-full border-2 border-gray-300 p-2">
                {task.photos?.[0] ? (
                  <img
                    src={task.photos[0]}
                    alt="任務"
                    className="h-32 w-32 object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 flex-col items-center justify-center bg-gray-200">
                    <span>No more images</span>
                    <Icon icon="openmoji:picture" className="text-8xl" />
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h5 className="text-lg font-bold">
                  {task.categorys.map((category) => `#${category}`).join(" ")}
                </h5>
                <p className="text-sm">{task.title}</p>
                <div className="mt-1 flex items-center">
                  <a
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
                <div className="flex">
                  <p className="mr-1">任務截止日期 :</p>
                  <span>{task.dueDate}</span>
                </div>
                <div className="mt-1">
                  <span className="text-lg font-bold">任務狀態 :</span>
                  <span className="ml-2 text-lg font-bold">
                    {task.status || "未知"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center">
                {task.isUrgent ? (
                  <>
                    <Icon icon="bi:fire" color="#dc2026" />
                    <span className="text-center text-lg font-bold">
                      是否急件&emsp;:
                    </span>
                    <span className="text-center text-lg font-bold">
                      &emsp;十萬火急
                    </span>
                  </>
                ) : (
                  <>
                    <Icon icon="lets-icons:flag-finish-fill" />
                    <span className="text-center text-lg font-bold">
                      是否急件&emsp;:
                    </span>
                    <span className="text-center text-lg font-bold">
                      &emsp;否
                    </span>
                  </>
                )}
              </div>
              <div
                className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-200 px-6 py-3 [transform:translateZ(0)] before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-[100%_100%] before:scale-x-0 before:bg-sky-600 before:transition before:duration-500 before:ease-in-out hover:before:origin-[0_0] hover:before:scale-x-100"
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

      <div className="mb-10 h-5 bg-slate-300"></div>
    </>
  );
};

export default AcceptTaskRecord;
