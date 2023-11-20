import { Icon } from "@iconify/react";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";

interface Task {
  id: string;
  title: string;
  city: string;
  district: string;
  address: string;
  categorys: string[];
  photos?: string[]; // photos是可選的字串陣列的 URL，有可能不會有上傳圖片的可能
}

const StartTaskRecord = () => {
  const [hoverText, setHoverText] = useState("查看任務詳情 >>");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(collection(db, "tasks"));
      const querySnapshot = await getDocs(q);
      const tasksData = querySnapshot.docs.map((doc) => {
        // 先讀取資料，然後再加 id
        const data = doc.data() as Task; // 確保資料符合 Task 類型
        return {
          ...data, // 先展開資料
          id: doc.id, // 然後再加 id，避免 id 被覆蓋
        };
      });
      setTasks(tasksData);
    };

    fetchTasks();
  }, []);

  return (
    <>
      {tasks.map((task) => (
        <>
          <div key={task.id} className="border-2 border-gray-200 p-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-start">
                <div className="border-2 border-gray-300 p-2">
                  <img
                    src={task.photos?.[0] ?? "/path-to-your-image.jpg"}
                    alt="任務"
                    className="h-16 w-16 object-cover"
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
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center">
                  <Icon icon="bi:fire" color="#dc2626" />
                  <span className="text-center text-lg font-bold">
                    十萬火急
                  </span>
                </div>
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-200 px-6 py-3 [transform:translateZ(0)] before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-[100%_100%] before:scale-x-0 before:bg-sky-600 before:transition before:duration-500 before:ease-in-out hover:before:origin-[0_0] hover:before:scale-x-100"
                  onMouseMove={() => setHoverText("發案紀錄查詢 >>")}
                  onMouseOut={() => setHoverText("查看任務詳情 >>")}
                >
                  <span className="relative z-0 text-black transition duration-500 ease-in-out group-hover:text-gray-200">
                    {hoverText}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-10 h-5 bg-slate-500"></div>
        </>
      ))}
    </>
  );
};

export default StartTaskRecord;
