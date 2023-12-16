import { Icon } from "@iconify/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import StarRating from "../../components/StarRating";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
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
  acceptedBy: string;
  categorys: string[];
  photos?: string[];
  hasBeenRated?: boolean;
}

const StartTaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>(); // 如果 useParams 不帶參數，它的預設型別是 { [key: string]: string }
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  // 存發案者名稱，以存取不同集合中的 user
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
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const [ratedUser, setRatedUser] = useState<string>("defaultRatedUserId");
  const [ratedStatus, setRatedStatus] = useState<boolean>(false);
  const [ratingComment, setRatingComment] = useState("");
  const [acceptorName, setAcceptorName] = useState<string>(""); // 用於保存接案人名稱的狀態

  const renderPhotoList = () => {
    const totalSlots = 5;

    const photos = taskDetails ? taskDetails.photos || [] : [];

    const emptySlots = totalSlots - photos.length;
    return (
      <>
        {photos.map((photo, index) => (
          <li
            key={photo}
            className="h-52 w-52 border-2 border-dashed border-[#368dcf]"
          >
            <img
              className="h-full w-full cursor-pointer object-cover p-2"
              src={photo}
              alt={`Task photo ${index + 1}`}
              onClick={() => {
                setSelectedPhoto(photo);
                setIsModalOpen(true);
              }}
            />
          </li>
        ))}
        {[...Array(emptySlots)].map((_, index) => (
          <li
            key={`empty-${index}`}
            className="flex h-52 w-52 items-center justify-center border-2 border-dashed border-[#368dcf] font-extrabold"
          >
            <span>未提供圖片</span>
          </li>
        ))}
      </>
    );
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
        setRatedUser(taskData.acceptedBy || ""); // 從任務數據中獲取接案者 ID
        setRatedStatus(taskData.hasBeenRated || false);
        if (taskData.acceptedBy) {
          const acceptorRef = doc(db, "users", taskData.acceptedBy);
          const acceptorSnap = await getDoc(acceptorRef);
          if (acceptorSnap.exists()) {
            setAcceptorName(acceptorSnap.data().name); // 更新接案者名稱
          } else {
            setAcceptorName("未知接案者");
          }
        }

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
            setPosterName(userSnap.data().name); // 更新發案者名稱
          } else {
            console.log("No such user!");
            setPosterName("找不到使用者");
          }
        }
      } else {
        console.log("No such task!", taskId);
        setTaskDetails(null);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingDetails = async (taskId: string) => {
    if (!taskId) return;

    try {
      // 建立針對 reviews 集合的查詢，篩選出與特定 taskId 相關的評價
      const querySnapshot = await getDocs(
        query(collection(db, "reviews"), where("reviewTaskId", "==", taskId)),
      );

      // 遍歷查詢結果
      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();
        if (reviewData) {
          setRatingComment(reviewData.ratedComment || "尚未有評價");
        }
      });
    } catch (error) {
      console.error("Error fetching rating details:", error);
    }
  };
  const handleFeedBack = async () => {
    if (!taskId) {
      console.error("Task ID is undefined");
      return;
    }

    const result = await Swal.fire({
      title: "🚨系統提醒",
      html: "<strong style='color: gray;'>回饋成功後將進入評價流程</strong>",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      reverseButtons: true,
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      try {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, {
          isFeedback: true,
          feedbackMessage: feedbackMessage,
          status: "已完成", // 更新狀態
        });
        setIsFeedbackSubmitted(true);
        await fetchTaskDetails();

        await Swal.fire({
          title: "✅已回饋成功",
          text: "將進入評價流程",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        });

        // 現在顯示評價模態框
        setIsRatingModalOpen(true);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
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

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkAndUpdateOverlayStatus = () => {
      if (taskDetails && currentUserId) {
        // 確保在 "任務回報完成" 或 "已完成" 狀態下遮罩不顯示
        if (
          taskDetails.createdBy === currentUserId &&
          (taskDetails.status === "任務回報完成" ||
            taskDetails.status === "已完成")
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
      setShowFeedbackContent(taskDetails.status === "已完成");
    }
  }, [taskDetails, currentUserId]);

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // 使用者已登入, 可以獲取 user.uid
        setCurrentUserId(user.uid);
      } else {
        // 使用者未登入
        console.log("使用者未登入");
      }
    });
  }, []);

  useEffect(() => {
    if (taskId) {
      fetchRatingDetails(taskId);
    }
  }, [taskId]);

  if (loading) {
    return <div>Loading task details...</div>;
  }

  if (!taskDetails) {
    return <div>No task details available.</div>;
  }
  console.log("taskDetails.status 的值：", taskDetails.status);
  return (
    <>
      <Header />
      <div className="container mx-auto max-w-[1280px] px-4 py-10 md:py-20 lg:px-20">
        <div className="mb-4 flex text-3xl font-semibold text-gray-700">
          <span className="h-8 w-2 bg-[#368dcf]"></span>
          <p className="pl-2">任務資訊</p>
        </div>
        {/* 任務進度 */}
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
                taskDetails.status === "已完成"
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
                taskDetails && taskDetails.status === "已完成"
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-black"
              }`}
            >
              已完成
            </div>
          </div>
        </div>
        {/* 任務資訊 */}

        <div className="flex flex-col lg:flex-row">
          {/* 左邊區塊開始 */}
          <div className="space-y-4 p-4 lg:w-1/3">
            {/* 案主 */}
            <div className="flex items-center space-x-2">
              <div className="flex-grow items-center text-xl font-semibold tracking-wider text-[#3178C6]">
                <span className="text-xl tracking-wider">發案者名稱：</span>
                {posterName}
              </div>
            </div>
            {/* 任務截止日期 */}
            <div className="flex items-center space-x-2">
              <div className="flex-grow font-semibold tracking-wider ">
                <span className="tracking-wider">任務截止日期：</span>
                {taskDetails.dueDate}
              </div>
            </div>
          </div>
          {/* 左邊區塊結束 */}

          {/* 右邊區塊開始 */}
          <div className="grid grid-cols-1 gap-4 rounded-md bg-[#B3D7FF] p-4 md:grid-cols-2 lg:w-2/3">
            {/* 以下是六個欄位，根據屏幕大小分為一列或兩列 */}
            <div className="rounded-md bg-white p-4">
              {/* 任務名稱 */}
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                任務名稱
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.title}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              {/* 任務地點 */}
              <div className="mb-3  border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                任務地點
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.city}
                {taskDetails.district}
                {taskDetails.address}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              {/* 任務類型 */}
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                任務類型
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.categorys
                  .map((category) => `#${category}`)
                  .join(" ")}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              {/* 任務報酬 Super Coins */}
              <div className="mb-3  border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                任務報酬 Super Coins
              </div>
              <div className="flex items-center font-medium text-[#3178C6]">
                <span>{taskDetails.cost}</span>
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              {/* 任務說明 */}
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                任務說明
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.description}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              {/* 其他備註 */}
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                其他備註
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.notes}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              {/* 接案者名稱 */}
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                接案者名稱
              </div>
              <div className="font-medium text-[#3178C6]">{acceptorName}</div>
            </div>
          </div>
          {/* 右邊區塊結束 */}
        </div>

        <div className="mb-4 flex text-3xl font-semibold text-gray-700">
          <span className="h-8 w-2 bg-[#368dcf]"></span>
          <p className="pl-2">任務照片</p>
        </div>
        <div className="mb-10 flex items-center justify-center">
          <ul className="flex flex-wrap justify-center gap-4">
            {taskDetails.photos?.map((photo) => (
              <li
                key={photo}
                className="h-52 w-52 border-2 border-dashed border-[#368dcf]"
              >
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
                  className="flex h-52 w-52 items-center justify-center border-2 border-dashed border-[#368dcf] font-extrabold"
                >
                  <span>未提供圖片</span>
                </li>
              ),
            )}
          </ul>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative h-full w-full max-w-screen-md overflow-auto">
                <div className="flex h-full items-center justify-center">
                  <img
                    className="max-h-full max-w-full object-cover"
                    src={selectedPhoto || "defaultImagePath"}
                    alt="Enlarged task photo"
                  />
                  <button
                    className="absolute bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-full p-2 text-black"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <span className="absolute -left-4 -top-4 flex h-10 w-10 animate-ping items-center justify-center rounded-full bg-[#2B79B4] text-sm text-white opacity-75">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.293 5.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 11-1.414-1.414L8.586 10 4.293 5.707a1 1 0 111.414-1.414L10 8.586l4.293-4.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* 驗收內容 */}
        {!showOverlay && (
          <form className="relative mb-10 bg-gray-400 p-4">
            <div className="flex items-center">
              <div className="mb-2 mr-3  flex items-center text-gray-700">
                <p className=" mr-2 text-3xl font-semibold">驗收內容</p>
                <p className="text-medium flex flex-col justify-end font-semibold text-red-600">
                  圖片大小不超過 5MB
                </p>
              </div>
            </div>
            <ul className="flex justify-between gap-4">{renderPhotoList()}</ul>
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
                htmlFor="comment"
                className="block text-xl font-extrabold text-gray-700"
              >
                To 超人的評價
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={3}
                className="mb-3 mt-1 block w-full resize-none rounded-md border border-gray-300 p-2.5 tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="尚未有評價內容"
                defaultValue={ratingComment}
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
                className="group relative w-52 overflow-hidden rounded-md bg-gray-200 px-6 py-3 [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-sky-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[10] hover:before:opacity-100"
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
              <div className="mb-2 mr-3 flex items-center text-gray-700">
                <p className=" mr-2 text-3xl font-semibold">驗收內容</p>
                <p className="text-medium flex flex-col justify-end font-semibold text-red-600">
                  圖片大小不超過 5MB
                </p>
              </div>
            </div>
            <ul className="flex justify-between gap-4">{renderPhotoList()}</ul>
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
                placeholder={
                  taskDetails.status === "已完成"
                    ? "已完成，不能輸入"
                    : "請填寫關於此任務的詳細完成成果"
                }
                defaultValue={taskDetails.reportDescription || ""}
                readOnly={taskDetails.status === "已完成"}
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
                placeholder={
                  taskDetails.status === "已完成"
                    ? "已完成，不能輸入"
                    : "請補充所需要讓發案者知道的資訊"
                }
                defaultValue={taskDetails.reportSupplementaryNotes || ""}
                readOnly={taskDetails.status === "已完成"}
              />
            </div>

            <div>
              <label
                htmlFor="comment"
                className="block text-xl font-extrabold text-gray-700"
              >
                To 超人的評價
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={3}
                className="mb-3 mt-1 block w-full resize-none rounded-md border border-gray-300 p-2.5 tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="尚未有評價內容"
                defaultValue={ratingComment}
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
                className={`group relative w-52 overflow-hidden rounded-md bg-gray-200 px-6 py-3 [transform:translateZ(0)] ${
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
        {isRatingModalOpen && (
          <StarRating
            taskId={taskId || "defaultTaskId"}
            currentUserId={currentUserId || "defaultUserId"}
            ratedUser={ratedUser} // 將接案者 ID 傳遞給 StarRating 組件
            ratedStatus={ratedStatus !== undefined ? ratedStatus : false}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default StartTaskDetail;
