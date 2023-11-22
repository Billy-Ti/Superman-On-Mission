import { Icon } from "@iconify/react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../config/firebase";

// 使用 Task interface 替代原來的 TaskData
interface Task {
  id: string;
  cost: number;
  dueDate: string;
  isUrgent: boolean;
  title: string;
  city: string;
  description: string;
  district: string;
  createdBy: string;
  notes: string;
  accepted: boolean;
  address: string;
  categorys: string[];
  photos?: string[]; // photos 是可選的
}

const AcceptTaskDetail = () => {
  const { taskId } = useParams();
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // 存發案者姓名，以存取不同集合中的 user
  const [posterName, setPosterName] = useState<string>("");
  const [showOverlay, setShowOverlay] = useState<boolean>(true);

  // 儲存已選擇的圖片，用作點及圖片可放大的前置準備
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  // 建立一個視窗，讓圖片可以被點擊後放大，有預覽的效果
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const taskIsAccepted = taskDetails && taskDetails.accepted;

  const navigate = useNavigate();

  const handleBackToTaskManagement = () => {
    navigate("/taskManagement");
  };

  const handleOverlay = () => {
    console.log("Before setting showOverlay to false");
    setShowOverlay(false);
    console.log("After setting showOverlay to false");
  };

  console.log(taskDetails);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!taskId) return;
      setLoading(true);
      try {
        const taskRef = doc(db, "tasks", taskId);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
          const taskData = taskSnap.data() as Task;
          setTaskDetails(taskData);

          // 使用 taskData.createdBy 來讀取發案者的使用者 ID
          const userId = taskData.createdBy;
          if (userId) {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              // 找 users 集合內的 user 名字，資料結構叫 name
              setPosterName(userSnap.data().name);
            } else {
              console.log("No such user!");
            }
          }
        } else {
          console.log("No such task!");
          setTaskDetails(null);
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  if (loading) {
    return <div>Loading task details...</div>;
  }

  if (!taskDetails) {
    return <div>No task details available.</div>;
  }

  return (
    <div className="container mx-auto mt-10 px-4 md:max-w-7xl">
      <div className="mb-10 flex items-center">
        <h3 className="text-4xl font-bold">接案紀錄詳情</h3>
        <button
          type="button"
          onClick={handleBackToTaskManagement}
          className="text-3xl font-bold text-gray-500"
        >
          &emsp;{">>"}&emsp;回任務列表
        </button>
      </div>
      <div className="flex justify-between py-4">
        <button
          type="button"
          className="w-1/5 rounded bg-gray-300 p-4 text-center"
        >
          會員中心
        </button>
        <button
          type="button"
          className="w-1/5 rounded bg-gray-300 p-4 text-center"
        >
          任務管理
        </button>
        <button
          type="button"
          className="w-1/5 rounded bg-gray-300 p-4 text-center"
        >
          我的評價
        </button>
      </div>
      {/* 任務進度 */}
      <div className="mb-10 h-3 bg-black"></div>
      <div className="mb-10 flex items-center justify-center space-x-2 py-4">
        <div className="flex items-center justify-center">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white">
            任務媒合中
          </div>
        </div>
        <div className="flex-auto border-t-2 border-black"></div>
        <div className="flex items-center justify-center">
          <div
            className={`flex h-40 w-40 items-center justify-center rounded-full text-xl font-bold ${
              taskIsAccepted ? "bg-green-500 text-white" : "bg-gray-400"
            } text-black`}
          >
            任務進行中
          </div>
        </div>
        <div className="flex-auto border-t-2 border-black"></div>

        <div className="flex items-center justify-center">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gray-400 text-xl font-bold text-black">
            任務回報完成
          </div>
        </div>
        <div className="flex-auto border-t-2 border-black"></div>
        <div className="flex items-center justify-center">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gray-400 text-xl font-bold text-black">
            發案者確認中
          </div>
        </div>
      </div>
      {/* 任務資訊 */}
      <div className="bg-gray-200 p-4">
        <div className="mb-2 text-3xl font-semibold text-gray-700">
          任務資訊
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4">
            <div className="mb-3 bg-gray-200 text-center font-black text-gray-500">
              任務名稱
            </div>
            <div>{taskDetails.title}</div>
          </div>
          <div className="bg-white p-4">
            <div className="mb-3 bg-gray-200 text-center font-black text-gray-500">
              任務地點
            </div>
            <div>
              {taskDetails.city}
              {taskDetails.district}
              {taskDetails.address}
            </div>
          </div>
          <div className="bg-white p-4">
            <div className="mb-3 bg-gray-200 text-center font-black text-gray-500">
              任務類型
            </div>
            <div>
              {taskDetails.categorys
                .map((category) => `#${category}`)
                .join(" ")}
            </div>
          </div>
          <div className="bg-white p-4">
            <div className="mb-3 bg-gray-200 text-center font-black text-gray-500">
              任務報酬 Super Coin
            </div>
            <div className="flex items-center justify-center text-4xl font-extrabold text-amber-400">
              <span>{taskDetails.cost}</span>
            </div>
          </div>
          {/* 任務照片 */}
          <div className="mb-2 text-2xl font-semibold text-gray-700">
            任務照片
          </div>
        </div>
        <div className="flex items-center">
          <ul className="flex gap-4">
            {taskDetails.photos?.map((photo) => (
              <li key={photo} className="h-52 w-52 bg-gray-400">
                <img
                  className="h-full w-full cursor-pointer object-cover p-2"
                  src={photo}
                  alt="Task photo"
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setIsModalOpen(true);
                  }}
                />
              </li>
            ))}

            {[...Array(4 - (taskDetails.photos?.length || 0))].map(
              (_, index) => (
                <li
                  key={index}
                  className="mb-2 flex h-52 w-52 flex-col items-center justify-center bg-gray-400 font-extrabold"
                >
                  <span>No more images</span>
                  <Icon icon="openmoji:picture" className="text-8xl" />
                </li>
              ),
            )}
          </ul>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className=" relative max-w-full overflow-auto bg-white p-4">
                <img
                  className="min-w-[500px] max-w-[800px] object-cover"
                  src={selectedPhoto || "defaultImagePath"}
                  alt="Enlarged task photo"
                />
                <button
                  className="absolute bottom-10 left-1/2 mt-4 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-full bg-gray-200 p-2 text-black"
                  onClick={() => setIsModalOpen(false)}
                >
                  <span className="absolute -left-4 -top-4 h-16 w-16 animate-ping rounded-full bg-gray-200 opacity-75" />
                  <span className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-red-200" />
                  <span className="relative z-10 text-center text-sm">
                    Close
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="my-auto mb-6 ml-auto">
            <div className="flex flex-col items-center">
              <p className="text-center text-3xl">請點選此按鈕查看</p>
              <Icon icon="icon-park:down-two" width="100" height="100" />
            </div>
            <button
              type="button"
              className="group relative overflow-hidden rounded-lg bg-gray-300 px-6 py-3 [transform:translateZ(0)] before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-[100%_100%] before:scale-x-0 before:bg-sky-600 before:transition before:duration-500 before:ease-in-out hover:before:origin-[0_0] hover:before:scale-x-100"
            >
              <span className="relative z-0 flex w-60 items-center justify-center rounded p-4 text-2xl text-black transition duration-500 ease-in-out group-hover:text-gray-200">
                <Icon icon="ant-design:message-filled" className="mr-3" />
                聯繫發案者
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-none">
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-grow tracking-wider">
              <span className="font-semibold tracking-wider">發案者姓名：</span>
              {posterName}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-none">
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-grow tracking-wider">
              <span className="font-semibold tracking-wider">任務說明：</span>
              {taskDetails.description}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-none">
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-grow tracking-wider">
              <span className="font-semibold tracking-wider">
                任務截止日期：
              </span>
              {taskDetails.dueDate}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-none">
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-grow tracking-wider">
              <span className="font-semibold tracking-wider">其他備註 : </span>
              {taskDetails.notes}
            </div>
          </div>
        </div>
      </div>
      {/* 驗收內容 */}
      <form className="relative mb-10 bg-gray-400 p-4">
        <div className="flex items-center">
          <div className="mb-2 mr-3 text-3xl font-semibold text-gray-700">
            驗收內容
          </div>
        </div>
        <ul className="flex justify-between gap-2">
          <li className="mb-2 h-48 w-48 bg-gray-700">
            <input className="w-[190px]" type="file" name="taskPhoto" />
          </li>
          <li className="mb-2 h-48 w-48 bg-gray-700">
            <input className="w-[190px]" type="file" name="taskPhoto" />
          </li>
          <li className="mb-2 h-48 w-48 bg-gray-700">
            <input className="w-[190px]" type="file" name="taskPhoto" />
          </li>
          <li className="mb-2 h-48 w-48 bg-gray-700">
            <input className="w-[190px]" type="file" name="taskPhoto" />
          </li>
          <li className="mb-2 h-48 w-48 bg-gray-700">
            <input className="w-[190px]" type="file" name="taskPhoto" />
          </li>
          <li className="mb-2 h-48 w-48 bg-gray-700">
            <input className="w-[190px]" type="file" name="taskPhoto" />
          </li>
        </ul>
        <div>
          <label
            htmlFor="input1"
            className="block text-xl font-extrabold text-gray-700"
          >
            任務回報說明
          </label>
          <textarea
            id="input1"
            name="input1"
            rows={3}
            className="mb-3 mt-1 block w-full resize-none rounded-md border border-gray-300 p-2.5 tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="請填寫關於此任務的詳細完成成果"
            defaultValue={""}
          />
        </div>
        <div>
          <label
            htmlFor="input2"
            className="block text-xl font-extrabold text-gray-700"
          >
            超人補充說明
          </label>
          <textarea
            id="input2"
            name="input2"
            rows={3}
            className="mb-3 mt-1 block w-full resize-none rounded-md border border-gray-300 p-2.5 tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="請補充所需要讓發案者知道的資訊"
            defaultValue={""}
          />
        </div>
        <div>
          <label
            htmlFor="input3"
            className="flex text-xl font-extrabold text-gray-700"
          >
            發案者回饋
            <span className="flex items-center text-sm font-extrabold text-red-500">
              <Icon icon="solar:star-bold" />
              案主填寫
            </span>
          </label>
          <textarea
            id="input3"
            name="input3"
            rows={3}
            className="mb-10 mt-1 block w-full resize-none rounded-md border border-gray-300 bg-blue-200 p-2.5 tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="若有其他需要讓我們知道的資訊，請填寫於此。"
            defaultValue={""}
          />
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="group relative w-52 overflow-hidden rounded-lg bg-gray-200 px-6 py-3 [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-sky-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[10] hover:before:opacity-100"
          >
            <span className="relative z-0 text-2xl text-black transition duration-500 ease-in-out group-hover:text-gray-200">
              送出
            </span>
          </button>
        </div>
        {/* 遮罩區塊 */}
        {/* {showOverlay && taskIsAccepted ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative flex h-[200px] w-[400px] items-center justify-center">
              <span className="absolute -left-4 -top-4 h-[200px] w-[400px] animate-ping rounded-full bg-gray-200 opacity-75" />
              <span className="absolute -left-4 -top-4 flex h-[200px] w-[400px] items-center justify-center rounded-full bg-gray-200">
                <p className="z-10 text-2xl font-extrabold text-black">
                  任務完成後，請點擊確定開始驗收
                </p>
                <button
                  type="button"
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 transform rounded bg-blue-500 px-4 py-2 text-white"
                  onClick={handleOverlay}
                >
                  確定
                </button>
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative flex h-[100px] w-[400px] items-center justify-center">
              <span className="absolute -left-4 -top-4 h-[100px] w-[400px] animate-ping rounded-full bg-gray-200 opacity-75" />
              <span className="absolute -left-4 -top-4 flex h-[100px] w-[400px] items-center justify-center rounded-full bg-gray-200">
                <p className="z-10 text-2xl font-extrabold text-black">
                  等待『任務進行中』才會開放
                </p>
              </span>
            </div>
          </div>
        )} */}

        {showOverlay &&
          (taskIsAccepted ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative flex h-[200px] w-[400px] items-center justify-center">
                <span className="absolute -left-4 -top-4 h-[200px] w-[400px] animate-ping rounded-full bg-gray-200 opacity-75" />
                <span className="absolute -left-4 -top-4 flex h-[200px] w-[400px] items-center justify-center rounded-full bg-gray-200">
                  <div>
                    <p className="z-10 mb-3 text-center text-2xl font-extrabold text-black">
                      當前任務進行中
                    </p>

                    <p className="z-10 mb-3 text-xl font-extrabold text-gray-400">
                      確認完成後，請點擊
                      <span className="font-extrabold text-blue-500">確定</span>
                      開始驗收
                    </p>
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 transform rounded bg-blue-500 px-4 py-2 text-white"
                    onClick={handleOverlay}
                  >
                    確定
                  </button>
                </span>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative flex h-[100px] w-[400px] items-center justify-center">
                <span className="absolute -left-4 -top-4 h-[100px] w-[400px] animate-ping rounded-full bg-gray-200 opacity-75" />
                <span className="absolute -left-4 -top-4 flex h-[100px] w-[400px] items-center justify-center rounded-full bg-gray-200">
                  <p className="z-10 text-2xl font-extrabold text-black">
                    等待『任務進行中』才會開放
                  </p>
                </span>
              </div>
            </div>
          ))}
      </form>
    </div>
  );
};

export default AcceptTaskDetail;
