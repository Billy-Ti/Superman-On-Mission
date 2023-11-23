import { Icon } from "@iconify/react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
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
  reportSupplementaryNotes: string;
  createdBy: string;
  notes: string;
  reportFiles: string[];
  status: string;
  reportDescription: string;
  address: string;
  feedbackMessage: string;
  isFeedback: boolean;
  categorys: string[];
  photos?: string[]; // photos 是可選的
}

const StartTaskDetail = () => {
  const { taskId } = useParams();
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  // 存發案者姓名，以存取不同集合中的 user
  const [posterName, setPosterName] = useState<string>("");

  // 儲存已選擇的圖片，用作點及圖片可放大的前置準備
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  // 建立一個視窗，讓圖片可以被點擊後放大，有預覽的效果
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [showFeedbackContent, setShowFeedbackContent] = useState(false);

  const navigate = useNavigate();

  const handleBackToTaskManagement = () => {
    navigate("/taskManagement");
  };

  const fetchTaskDetails = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const taskRef = doc(db, "tasks", taskId);
      const taskSnap = await getDoc(taskRef);

      if (taskSnap.exists()) {
        const taskData = taskSnap.data() as Task;
        setTaskDetails(taskData);

        if (taskData.feedbackMessage) {
          setFeedbackMessage(taskData.feedbackMessage);
          setIsFeedbackSubmitted(taskData.isFeedback || false);
        } else {
          setFeedbackMessage("");
          setIsFeedbackSubmitted(false);
        }
        console.log(taskData);

        // 使用 taskData.createdBy 來讀取發案者的使用者 ID 並更新 posterName 狀態
        const userId = taskData.createdBy;
        if (userId) {
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            console.log("User data:", userSnap.data());
            setPosterName(userSnap.data().name); // 更新發案者姓名
          } else {
            console.log("No such user!");
            setPosterName("找不到使用者");
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

  const handleFeedBack = async () => {
    if (!taskId) {
      console.error("Task ID is undefined");
      return;
    }

    Swal.fire({
      title: "🚨系統提醒",
      html: "<strong style='color: gray;'>回饋成功後將進入評價流程</strong>",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const taskRef = doc(db, "tasks", taskId);
          await updateDoc(taskRef, {
            isFeedback: true,
            feedbackMessage: feedbackMessage,
            status: "發案者確認", // 更新狀態
          });
          setIsFeedbackSubmitted(true);
          fetchTaskDetails();

          Swal.fire({
            title: "✅已回饋成功",
            text: "將進入評價流程",
            icon: "success",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        } catch (error) {
          console.error("Error updating task:", error);
        }
      }
    });
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe(); // 清理訂閱
  }, []);

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId, db]);

  useEffect(() => {
    const checkAndUpdateOverlayStatus = () => {
      if (taskDetails && currentUserId) {
        // 確保在 "任務回報完成" 或 "發案者確認" 狀態下遮罩不顯示
        if (
          taskDetails.createdBy === currentUserId &&
          (taskDetails.status === "任務回報完成" ||
            taskDetails.status === "發案者確認")
        ) {
          setShowOverlay(false);
        } else {
          setShowOverlay(true);
        }
      }
    };

    checkAndUpdateOverlayStatus();
  }, [taskDetails, currentUserId]);

  useEffect(() => {
    if (taskDetails && currentUserId) {
      if (
        taskDetails.createdBy === currentUserId &&
        taskDetails.status === "任務回報完成"
      ) {
        setShowOverlay(false);
      } else {
        setShowOverlay(true);
      }
    }
  }, [taskDetails, currentUserId]);

  useEffect(() => {
    if (taskDetails && currentUserId) {
      setShowOverlay(
        !(
          taskDetails.createdBy === currentUserId &&
          taskDetails.status === "任務回報完成"
        ),
      );
      setShowFeedbackContent(taskDetails.status === "發案者確認");
    }
  }, [taskDetails, currentUserId]);

  if (loading) {
    return <div>Loading task details...</div>;
  }

  if (!taskDetails) {
    return <div>No task details available.</div>;
  }

  return (
    <div className="container mx-auto mt-10 px-4 md:max-w-7xl">
      <div className="mb-10 flex items-center">
        <h3 className="text-4xl font-bold">發案紀錄詳情</h3>
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
              taskDetails && taskDetails.status !== "任務媒合中"
                ? "bg-green-500 text-white"
                : "bg-gray-400"
            }`}
          >
            任務進行中
          </div>
        </div>
        <div className="flex-auto border-t-2 border-black"></div>

        <div className="flex items-center justify-center">
          <div
            className={`flex h-40 w-40 items-center justify-center rounded-full text-xl font-bold ${
              (taskDetails && taskDetails.status === "任務回報完成") ||
              taskDetails.status === "發案者確認"
                ? "bg-green-500 text-white"
                : "bg-gray-400"
            }`}
          >
            任務回報完成
          </div>
        </div>
        <div className="flex-auto border-t-2 border-black"></div>
        <div className="flex items-center justify-center">
          <div
            className={`flex h-40 w-40 items-center justify-center rounded-full text-xl font-bold ${
              taskDetails && taskDetails.status === "發案者確認"
                ? "bg-green-500 text-white"
                : "bg-gray-400 text-black"
            }`}
          >
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
            {taskDetails.photos?.map((fileUrl, index) => (
              <li key={index} className="mb-2 h-52 w-52 bg-gray-700">
                <img
                  className="h-full w-full cursor-pointer object-cover p-2"
                  src={fileUrl}
                  alt={`Report Photo ${index}`}
                  onClick={() => {
                    setSelectedPhoto(fileUrl); // 設置選中的圖片
                    setIsModalOpen(true); // 打開模態視窗
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
                <Icon icon="mingcute:search-fill" />
                查看接案者
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
      {!showOverlay && (
        <form className="relative mb-10 bg-gray-400 p-4">
          <div className="flex items-center">
            <div className="mb-2 mr-3 text-3xl font-semibold text-gray-700">
              驗收內容
            </div>
          </div>
          <ul className="flex justify-between gap-4">
            {taskDetails.reportFiles?.map((fileUrl, index) => (
              <li key={index} className="mb-2 h-52 w-52 bg-gray-700">
                <img
                  className="h-full w-full cursor-pointer object-cover p-2"
                  src={fileUrl}
                  alt={`Report Photo ${index}`}
                  onClick={() => {
                    setSelectedPhoto(fileUrl); // 設置選中的圖片
                    setIsModalOpen(true); // 打開模態視窗
                  }}
                />
              </li>
            ))}

            {[...Array(6 - (taskDetails.photos?.length || 0))].map(
              (_, index) => (
                <li
                  key={index}
                  className="mb-2 flex h-52 w-52 flex-col items-center justify-center bg-gray-700 font-extrabold"
                >
                  <span>No more images</span>
                  <Icon icon="openmoji:picture" className="text-8xl" />
                </li>
              ),
            )}
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
              defaultValue={taskDetails.reportDescription || ""}
              readOnly
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
              defaultValue={taskDetails.reportSupplementaryNotes || ""}
              readOnly
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
              placeholder={
                isFeedbackSubmitted
                  ? feedbackMessage
                  : "請針對此任務驗收成果填寫。"
              }
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              readOnly={isFeedbackSubmitted}
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleFeedBack}
              type="button"
              className="group relative w-52 overflow-hidden rounded-lg bg-gray-200 px-6 py-3 [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-sky-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[10] hover:before:opacity-100"
            >
              <span className="relative z-0 text-2xl text-black transition duration-500 ease-in-out group-hover:text-gray-200">
                送出
              </span>
            </button>
          </div>
          {/* 遮罩區塊 */}
          {showOverlay && (
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
          )}
        </form>
      )}
      {showFeedbackContent && (
        <form className="relative mb-10 bg-gray-400 p-4">
          <div className="flex items-center">
            <div className="mb-2 mr-3 text-3xl font-semibold text-gray-700">
              驗收內容
            </div>
          </div>
          <ul className="flex justify-between gap-4">
            {taskDetails.reportFiles?.map((fileUrl, index) => (
              <li key={index} className="mb-2 h-52 w-52 bg-gray-700">
                <img
                  className="h-full w-full cursor-pointer object-cover p-2"
                  src={fileUrl}
                  alt={`Report Photo ${index}`}
                  onClick={() => {
                    setSelectedPhoto(fileUrl); // 設置選中的圖片
                    setIsModalOpen(true); // 打開模態視窗
                  }}
                />
              </li>
            ))}

            {[...Array(6 - (taskDetails.photos?.length || 0))].map(
              (_, index) => (
                <li
                  key={index}
                  className="mb-2 flex h-52 w-52 flex-col items-center justify-center bg-gray-700 font-extrabold"
                >
                  <span>No more images</span>
                  <Icon icon="openmoji:picture" className="text-8xl" />
                </li>
              ),
            )}
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
              defaultValue={taskDetails.reportDescription || ""}
              readOnly
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
              defaultValue={taskDetails.reportSupplementaryNotes || ""}
              readOnly
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
              placeholder={
                isFeedbackSubmitted
                  ? feedbackMessage
                  : "請針對此任務驗收成果填寫"
              }
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              readOnly={isFeedbackSubmitted}
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleFeedBack}
              type="button"
              disabled={isFeedbackSubmitted} // 禁用按鈕
              className={`group relative w-52 overflow-hidden rounded-lg bg-gray-200 px-6 py-3 [transform:translateZ(0)] ${
                isFeedbackSubmitted ? "opacity-50" : ""
              } before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-sky-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[10] hover:before:opacity-100`}
            >
              <span className="relative z-0 text-2xl text-black transition duration-500 ease-in-out group-hover:text-gray-200">
                送出
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StartTaskDetail;
