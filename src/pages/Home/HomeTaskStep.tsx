import { Icon } from "@iconify/react";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../../config/firebase";

interface Task {
  title: string;
  dueDate: string;
  city: string;
  address: string;
  cost: number;
  id: string;
}

const HomeTaskStep = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(query(collection(db, "tasks")));
      const tasksArray: Task[] = [];
      querySnapshot.forEach((doc) => {
        const taskData = doc.data() as Task;
        tasksArray.push({ ...taskData, id: doc.id }); // 添加每個任務的 id
      });

      // 對任務按照 cost 降序排列，並選取前四個
      const sortedTasks = tasksArray
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 4);
      setTasks(sortedTasks);
    };

    fetchTasks();
  }, []);
  return (
    <div className="container mx-auto max-w-[1280px] px-4 shadow-xl shadow-neutral-100 md:px-20">
      {/* shadow-xl shadow-neutral-100 */}
      <div className="mb-20 py-20">
        <p className="mb-10 text-center text-4xl">發案 3 步驟，跟著一起 go</p>
        <div className="flex justify-between ">
          <p className="mb-1 font-bold sm:text-2xl">Step 1</p>
          <p className="font-bold sm:text-2xl">Step 2</p>
          <p className="font-bold sm:text-2xl">Step 3</p>
        </div>
        <div className="mb-2 flex items-center justify-center space-x-4">
          <Icon
            icon="cil:list"
            rotate={2}
            hFlip={true}
            vFlip={true}
            className="h-[40px] w-[40px] sm:h-[60px] sm:w-[60px]"
          />
          <div className="flex-auto border-t-2 border-gray-300"></div>
          <Icon
            icon="ant-design:thunderbolt-filled"
            className="h-[40px] w-[40px] sm:h-[60px] sm:w-[60px]"
            rotate={2}
            hFlip={true}
            vFlip={true}
          />

          <div className="flex-auto border-t-2 border-gray-300"></div>
          <Icon
            color="4B5563"
            className="ml-0 h-[40px] w-[40px] text-white sm:h-[60px] sm:w-[60px]"
            icon="icon-park-solid:good-two"
          />
        </div>
        <div className="mb-10 flex justify-between">
          <p className="mb-1 font-bold sm:text-2xl">刊登任務</p>
          <p className="font-bold sm:text-2xl">出任務囉</p>
          <p className="font-bold sm:text-2xl">完成評價</p>
        </div>
        <div className="mb-10 flex flex-col">
          {/* main card */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tasks.map((task, index) => (
              <div
                className="flex h-full w-full flex-col items-center justify-between rounded-xl bg-white p-4 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl"
                key={index}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Telenor_Logo.svg/1600px-Telenor_Logo.svg.png"
                  className="w-12"
                  alt="Telenor Logo"
                />
                <div className="mt-2 text-lg font-semibold">
                  {task.title}...
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <Icon icon="uim:clock" className="text-gray-400" />
                  <span>{task.dueDate}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <Icon icon="mdi:location" className="text-gray-400" />
                  <span>
                    {task.city}
                    {task.address}
                  </span>
                </div>
                <div className="my-4 bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text font-black text-transparent">
                  <span className="text-base font-bold">{task.cost}</span>
                  <span className="text-sm font-semibold">/ Super Coin</span>
                </div>
                <button
                  onClick={() => navigate(`/acceptDetail/${task.id}`)}
                  className="mt-2 w-full rounded-full border border-[#F0F0F6] bg-[#F4F5FA] px-4 py-3 shadow-lg transition duration-300 ease-in-out hover:bg-slate-300"
                >
                  See more
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/taskPage")}
            className="rounded-md bg-indigo-500 p-3 text-xl font-black tracking-wider text-white transition duration-500 ease-in-out hover:bg-indigo-700"
          >
            立即刊登任務
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeTaskStep;