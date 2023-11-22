import { Icon } from "@iconify/react";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
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
  categorys: string[];
  photos?: string[]; // photos是可選的字串陣列的 URL，有可能不會有上傳圖片的可能
  accepted?: boolean;
}
const AcceptTask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hoverText, setHoverText] = useState("查看任務詳情 >>");

  const navigate = useNavigate();

  const handleAcceptTask = async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      accepted: true,
    });
    navigate(`/acceptDetail/${taskId}`);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(collection(db, "tasks"));
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs
        .map((doc) => {
          const data = doc.data() as Task;
          return {
            ...data,
            id: doc.id,
          };
        })
        .filter((task) => !task.accepted); // 只保留那些未被接受的任務

      setTasks(tasksData);
    };

    fetchTasks();
  }, []);

  const handleBackToTask = () => navigate("/");
  return (
    <div className="container mx-auto px-4 md:max-w-7xl">
      <h3 className="mb-4 mt-10 border-b-8 border-black pb-3 text-4xl font-bold">
        找任務 {`>>`}
        <button onClick={handleBackToTask} type="button" className="text-xl">
          回首頁
        </button>
      </h3>
      {tasks.map((task) => (
        <>
          <div key={task.id} className="border-2 border-gray-200 p-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-start">
                <div className="border-2 border-gray-300 p-2">
                  <img
                    src={task.photos?.[0] ?? "/path-to-your-image.jpg"}
                    alt="任務"
                    className="h-32 w-32 object-cover"
                  />
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
                  <div>
                    {/* <p>支付 Super Coins : {task.cost}</p> */}
                    <p>任務截止日期 : {task.dueDate}</p>
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
                <p>支付 Super Coins : {task.cost}</p>
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-200 px-6 py-3 [transform:translateZ(0)] before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-[100%_100%] before:scale-x-0 before:bg-green-400 before:transition before:duration-500 before:ease-in-out hover:before:origin-[0_0] hover:before:scale-x-100"
                  onMouseMove={() => setHoverText("準備接任務囉 >>")}
                  onMouseOut={() => setHoverText("查看任務詳情 >>")}
                  onClick={() => handleAcceptTask(task.id)}
                >
                  <span className="relative z-0 text-black transition duration-500 ease-in-out group-hover:text-black">
                    {hoverText}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-10 h-5 bg-slate-500"></div>
        </>
      ))}
    </div>
  );
};

export default AcceptTask;
