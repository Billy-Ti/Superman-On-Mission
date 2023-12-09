import { Icon } from "@iconify/react";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ChatRoomWindow from "../../components/chatRoom/ChatRoomWindow";
import { db, storage } from "../../config/firebase";
import { showAlert } from "../../utils/showAlert";

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
  reportFiles: string[];
  reportDescription: string;
  reportSupplementaryNotes: string;
  feedbackMessage: string;
  notes: string;
  accepted: boolean;
  address: string;
  status: string;
  ratedComment: string;
  taskId: string;
  categorys: string[];
  photos?: string[]; // photos 是可選的
}

const AcceptTaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // 存發案者名稱，以存取不同集合中的 user
  const [posterName, setPosterName] = useState<string>("");
  const [showOverlay, setShowOverlay] = useState<boolean>(true);

  // 儲存已選擇的圖片，用作點及圖片可放大的前置準備
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  // 建立一個視窗，讓圖片可以被點擊後放大，有預覽的效果
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const taskIsAccepted = taskDetails && taskDetails.accepted;

  // 建立回報說明欄位的狀態
  const [reportDescription, setReportDescription] = useState("");
  const [reportSupplementaryNotes, setReportSupplementaryNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>(
    Array(6).fill(null),
  );
  const [ratedComment, setRatedComment] = useState<string>("");

  const [taskStatus, setTaskStatus] = useState("");

  const [isChatOpen, setIsChatOpen] = useState(false);

  const navigate = useNavigate();

  const handleBackToTaskManagement = () => {
    navigate("/taskManagement");
  };

  const handleOverlay = () => {
    setShowOverlay(false);
  };

  const handleAskDetails = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // 處理檔案選擇
  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newSelectedFiles = [...selectedFiles];
    const file = event.target.files ? event.target.files[0] : null;
    newSelectedFiles[index] = file;
    setSelectedFiles(newSelectedFiles);
  };

  const handleReportDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setReportDescription(event.target.value);
    setTaskDetails((prevDetails) => {
      // 確保 prevDetails 不是 null
      if (prevDetails === null) return null;

      return {
        ...prevDetails, // 保留所有現有的屬性
        reportDescription: event.target.value, // 更新 reportDescription 屬性
      };
    });
  };

  const handleReportSupplementaryNotesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setReportSupplementaryNotes(event.target.value);
    setTaskDetails((prevDetails) => {
      if (prevDetails === null) return null;

      return {
        ...prevDetails, // 保留所有現有的屬性
        reportSupplementaryNotes: event.target.value, // 更新 reportSupplementaryNotes 屬性
      };
    });
  };

  const uploadImages = async () => {
    const urls = await Promise.all(
      selectedFiles.map(async (file) => {
        if (file) {
          const fileRef = ref(storage, `tasks/${taskId}/${file.name}`);
          await uploadBytes(fileRef, file);
          return getDownloadURL(fileRef);
        } else {
          console.log("沒有選擇檔案");
        }
        return null;
      }),
    );

    return urls.filter((url) => url !== null); // 過濾掉 null 值
  };

  const fetchTask = async () => {
    if (!taskId) {
      console.log("Task ID is not defined");
      return;
    }

    console.log("Fetching task with ID:", taskId);

    const taskRef = doc(db, "tasks", taskId);
    try {
      const docSnap = await getDoc(taskRef);
      if (docSnap.exists()) {
        const taskData = docSnap.data() as Task;
        console.log("Task data retrieved:", taskData);

        setTaskDetails(taskData);
        setTaskStatus(taskData.status);
        setReportDescription(taskData.reportDescription ?? "");
        setReportSupplementaryNotes(taskData.reportSupplementaryNotes ?? "");
        console.log("taskStatus", taskStatus);

        const userRef = doc(db, "users", taskData.createdBy);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setPosterName(userSnap.data().name);
        } else {
          console.log("No such user!");
          setPosterName("未知用戶");
        }
      } else {
        console.log("No such task!");
        setTaskDetails(null);
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  useEffect(() => {
    if (taskDetails) {
      setTaskStatus(taskDetails.status);
    }
  }, [taskDetails]);

  useEffect(() => {
    if (taskStatus === "已完成") {
      setShowOverlay(false);
    }
  }, [taskStatus]);

  const handleReportSubmit = async () => {
    console.log("Report Description:", reportDescription);
    console.log("Report Supplementary Notes:", reportSupplementaryNotes);

    if (!taskId) {
      console.error("Task ID is undefined");
      return;
    }

    if (reportDescription === undefined) {
      console.error("reportDescription is undefined");
      // 處理這個錯誤，比如通過顯示錯誤消息給用戶
      return;
    }

    // 檢查所有選擇的文件是否為圖片
    const isValidFiles = selectedFiles.every((file) => {
      if (file) {
        // 如果選擇了檔案，則檢查格式
        return (
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/gif"
        );
      }
      // 如果沒有選擇檔案，則認為是有效的
      return true;
    });

    if (!isValidFiles) {
      showAlert("🚨系統提醒", "請上傳圖片格式...", "error");
      return;
    }

    Swal.fire({
      title: "確定提交驗收？",
      html: "<strong style='color: red;'>請檢查所輸入的資料有無正確</strong>",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const imageUrls = await uploadImages();
          const taskRef = doc(db, "tasks", taskId);
          await updateDoc(taskRef, {
            reportFiles: imageUrls,
            reportDescription: reportDescription ?? "",
            reportSupplementaryNotes: reportSupplementaryNotes ?? "",
            status: "任務回報完成",
          });

          // 更新狀態並顯示成功消息
          setShowOverlay(true);
          setTaskStatus("任務回報完成");
          Swal.fire({
            title: "已送出結果",
            text: "等待發案者確認",
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
      // 如果按下"取消"，則不執行任何操作
    });
  };

  useEffect(() => {
    const fetchRatedComment = async () => {
      if (typeof taskId === "string") {
        // 創建指向 reviews 集合的引用
        const reviewsRef = collection(db, "reviews");
        // 創建一個查詢，根據 reviewTaskId 篩選文檔
        const q = query(reviewsRef, where("reviewTaskId", "==", taskId));

        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            // 假設每個任務只有一條評價
            const reviewData = doc.data();
            console.log("Review data:", reviewData); // 檢查獲取到的數據
            setRatedComment(reviewData.ratedComment);
          });
        } catch (error) {
          console.error("Error getting reviews:", error);
        }
      }
    };

    fetchRatedComment();
  }, [taskId]);

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

          // 判斷當前用戶是否為發案者
          const auth = getAuth();
          const currentUser = auth.currentUser;
          const isPoster = currentUser?.uid === taskData.createdBy;

          // 如果是發案者，且任務狀態是"任務回報完成"，則移除遮罩
          if (isPoster && taskData.status === "任務回報完成") {
            setShowOverlay(false);
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
        <Link
          to="/signIn"
          className="w-1/5 rounded-md bg-gray-300 p-4 text-center"
        >
          會員中心
        </Link>
        <Link
          to="/taskManagement"
          className="w-1/5 rounded-md bg-gray-300 p-4 text-center"
        >
          任務管理
        </Link>
        <Link
          to="/reviewLists"
          className="w-1/5 rounded-md bg-gray-300 p-4 text-center"
        >
          我的評價
        </Link>
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
          <div
            className={`flex h-40 w-40 items-center justify-center rounded-full text-xl font-bold ${
              taskStatus === "任務回報完成" || taskStatus === "已完成"
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
              taskStatus === "已完成"
                ? "bg-green-500 text-white"
                : "bg-gray-400"
            }`}
          >
            已完成
          </div>
        </div>
      </div>
      {/* 任務資訊 */}
      <div className="mb-10 bg-gray-200 p-4">
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
              <div className="relative max-w-full overflow-auto bg-white p-4">
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
              onClick={handleAskDetails}
              type="button"
              className="group relative overflow-hidden rounded-md bg-gray-300 px-6 py-3 [transform:translateZ(0)] before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-[100%_100%] before:scale-x-0 before:bg-sky-600 before:transition before:duration-500 before:ease-in-out hover:before:origin-[0_0] hover:before:scale-x-100"
            >
              <span className="relative z-0 flex w-60 items-center justify-center rounded-md p-4 text-2xl text-black transition duration-500 ease-in-out group-hover:text-gray-200">
                <Icon icon="ant-design:message-filled" className="mr-3" />
                聯繫發案者
              </span>
            </button>
            {isChatOpen && taskId && (
              <ChatRoomWindow
                onCloseRoom={handleCloseChat}
              />
            )}
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
              <span className="font-semibold tracking-wider">發案者名稱：</span>
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
          <div className="mb-2 flex items-center text-3xl font-semibold text-gray-700">
            驗收內容
            {/* 條件渲染：僅在非"已完成"狀態時顯示 */}
            {taskStatus !== "已完成" && (
              <p className="ml-3 text-xl font-extrabold text-red-500">
                僅限上傳圖片格式為 {"("}png / jpg / gif{")"}
              </p>
            )}
          </div>
        </div>
        <ul className="flex gap-4">
          {taskStatus === "已完成" ? (
            taskDetails.reportFiles.length > 0 ? (
              taskDetails.reportFiles.map((fileUrl, index) => (
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
              ))
            ) : (
              <li className="mb-2 flex h-52 w-52 flex-col items-center justify-center bg-gray-400 font-extrabold">
                <span>No more images</span>
                <Icon icon="openmoji:picture" className="text-8xl" />
              </li>
            )
          ) : (
            Array.from({ length: 6 }).map((_, index) => (
              <li key={index} className="mb-2 h-48 w-48 bg-gray-700">
                <input
                  type="file"
                  name="taskPhoto"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={(e) => handleFileSelect(e, index)}
                />
              </li>
            ))
          )}
        </ul>
        {/* 顯示任務回報說明 */}
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
            className={`mb-3 mt-1 block w-full resize-none rounded-md border border-gray-300 p-2.5 tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${
              taskStatus === "任務回報完成" || taskStatus === "已完成"
                ? "cursor-not-allowed "
                : ""
            }`}
            value={taskDetails.reportDescription}
            onChange={handleReportDescriptionChange}
          />
        </div>
        {/* 顯示超人補充說明 */}
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
            onChange={handleReportSupplementaryNotesChange}
            className={`mb-3 mt-1 block w-full resize-none rounded-md border border-gray-300 p-2.5 tracking-wider ${
              taskStatus === "任務回報完成" || taskStatus === "已完成"
                ? "cursor-not-allowed"
                : ""
            } shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
            value={taskDetails.reportSupplementaryNotes}
          />
        </div>
        {/* To 超人的評價 */}
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
            className={`mb-3 mt-1 block w-full cursor-not-allowed resize-none rounded-md border border-gray-300 p-2.5 tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
            readOnly
            value={ratedComment} // ratedComment 是從 reviews 集合獲取
          />
        </div>
        {/* 發案者回饋 */}
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
            className="mb-10 mt-1 block w-full cursor-not-allowed resize-none rounded-md border border-gray-300 bg-blue-200 p-2.5 tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            readOnly
            value={taskDetails.feedbackMessage} // feedbackMessage 是從 taskDetails 獲取
          />
        </div>

        {/* 禁用送出按鈕 */}
        <div className="flex justify-center">
          <button
            onClick={handleReportSubmit}
            type="button"
            disabled={taskStatus === "已完成"}
            className={`${
              taskStatus === "任務回報完成" || taskStatus === "已完成"
                ? "cursor-not-allowed "
                : ""
            }}group relative w-52 overflow-hidden rounded-md bg-gray-200 px-6 py-3 [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-sky-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[10] hover:before:opacity-100`}
          >
            <span className="relative z-0 text-2xl text-black transition duration-500 ease-in-out group-hover:text-gray-200">
              送出
            </span>
          </button>
        </div>
        {/* 遮罩區塊 */}
        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative flex h-[200px] w-[400px] items-center justify-center">
              <span className="absolute -left-4 -top-4 h-[200px] w-[400px] animate-ping rounded-full bg-gray-200 opacity-75" />
              <span className="absolute -left-4 -top-4 flex h-[200px] w-[400px] items-center justify-center rounded-full bg-gray-200">
                {taskStatus === "任務回報完成" ? (
                  <div>
                    <p className="z-10 mb-3 text-center text-2xl font-extrabold text-black">
                      任務回報已完成，等待驗收結果
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="z-10 mb-3 text-center text-2xl font-extrabold text-black">
                      當前任務進行中
                    </p>
                    <p className="z-10 mb-3 text-xl font-extrabold text-gray-400">
                      確認完成後，請點擊
                      <span className="font-extrabold text-blue-500">確定</span>
                      開始驗收
                    </p>
                    <button
                      type="button"
                      className="absolute bottom-5 left-1/2 -translate-x-1/2 transform rounded-md bg-blue-500 px-4 py-2 text-white"
                      onClick={handleOverlay}
                    >
                      確定
                    </button>
                  </div>
                )}
              </span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AcceptTaskDetail;
