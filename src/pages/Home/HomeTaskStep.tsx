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
        tasksArray.push({ ...taskData, id: doc.id });
      });

      const sortedTasks = tasksArray
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 4);
      setTasks(sortedTasks);
    };

    fetchTasks();
  }, []);
  return (
    <div className="container mx-auto max-w-[1280px] px-4 md:px-20">
      <div className="py-10 md:py-20">
        <p className="mb-3 text-center text-3xl font-bold">
          發案 3 步驟，跟著一起 go
        </p>
        <div className="mx-auto mb-10 h-[10px] w-4/5 bg-[#2B79B4] sm:w-1/5"></div>
        <div className="flex justify-between">
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
          <div className="flex-auto border-t-2 border-[#000]"></div>
          <Icon
            icon="ant-design:thunderbolt-filled"
            className="h-[40px] w-[40px] sm:h-[60px] sm:w-[60px]"
            rotate={2}
            hFlip={true}
            vFlip={true}
          />
          <div className="flex-auto border-t-2 border-[#000]"></div>
          <Icon
            color="4B5563"
            className="ml-0 h-[40px] w-[40px] text-white sm:h-[60px] sm:w-[60px]"
            icon="icon-park-solid:good-two"
          />
        </div>
        <ul className="mb-10 flex justify-between">
          <li className="mb-1 font-bold sm:text-lg">刊登任務</li>
          <li className="font-bold sm:text-lg">出任務囉</li>
          <li className="font-bold sm:text-lg">完成評價</li>
        </ul>
        <div className="mb-10 flex flex-col">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tasks.map((task, index) => (
              <div
                className="group relative flex h-full w-full flex-col items-center justify-between rounded-xl bg-white p-4 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl"
                key={index}
              >
                <div className="flex items-center text-xl font-black text-[#2b79b4]">
                  <p className="mr-1 italic">SuperTask co.</p>
                </div>
                <div className="my-2 text-xl font-bold">{task.title}</div>
                <div className="mb-1 flex items-center gap-1 text-sm font-semibold">
                  <Icon icon="mdi:location" className="text-gray-400" />
                  <span>
                    {task.city}
                    {task.address}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <Icon icon="uim:clock" className="text-gray-400" />
                  <span>{task.dueDate}</span>
                </div>
                <div className="font-semibold">
                  <span className="text-base">{task.cost}</span>
                  <span className="text-sm">/ Super Coins</span>
                </div>
                <button
                  onClick={() => navigate(`/acceptDetail/${task.id}`)}
                  className="mt-2 w-full items-center justify-center rounded-md  bg-[#368DCF] py-2 text-xl font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
                >
                  看更多
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/taskPage")}
            className="items-center justify-center rounded-md  bg-[#368DCF] px-5 py-3 text-xl font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
          >
            立即刊登任務
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeTaskStep;
