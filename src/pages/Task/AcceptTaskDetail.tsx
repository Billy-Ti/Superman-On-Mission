import { Icon } from "@iconify/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ChatRoomWindow from "../../components/chatRoom/ChatRoomWindow";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
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
  taskStatus: string;
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
  const [selectedImages, setSelectedImages] = useState(Array(5).fill(null));
  const [ratedComment, setRatedComment] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>(Array(5).fill(null));
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [acceptorName, setAcceptorName] = useState(""); // 用於保存接案人名稱的狀態

  const handleOverlay = () => {
    setShowOverlay(false);
  };
  const handleAskDetails = () => {
    setIsChatOpen(true);
  };
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };
  const handleReportDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (taskDetails === null) return;
    // 檢查 taskStatus 是否為 "任務回報完成" 或 "已完成"
    if (
      taskDetails.taskStatus === "任務回報完成" ||
      taskDetails.taskStatus === "已完成"
    ) {
      return;
    }
    // 更新 reportDescription 並同時更新 taskDetails 的 reportDescription 屬性
    const newReportDescription = event.target.value;
    setReportDescription(newReportDescription);
    setTaskDetails((prevDetails) => {
      if (prevDetails === null) return null;
      return {
        ...prevDetails,
        reportDescription: newReportDescription,
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
        ...prevDetails,
        reportSupplementaryNotes: event.target.value,
      };
    });
  };
  const handleImgSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // 判断是否为图片格式（.png / .jpg / .jpeg）
      if (file.type.match(/image\/(png|jpg|jpeg)/)) {
        // 判断文件大小是否小于等于5MB
        if (file.size <= 5 * 1024 * 1024) {
          // 更新图片文件
          const updatedImageFiles = [...imageFiles];
          updatedImageFiles[index] = file;
          setImageFiles(updatedImageFiles);
          // 生成 Base64 预览
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result;
            if (result) {
              const updatedImages = [...selectedImages];
              updatedImages[index] = result.toString();
              setSelectedImages(updatedImages);
            }
          };
          reader.readAsDataURL(file);
        } else {
          showAlert("錯誤", "圖片大小不能超過 5 MB", "error");
        }
      } else {
        showAlert("錯誤", "只能上傳圖片格式（.png / .jpg / .jpeg）", "error");
      }
    }
  };
  const uploadImages = async () => {
    const urls = await Promise.all(
      imageFiles.map(async (file) => {
        if (file) {
          const fileRef = ref(storage, `tasks/${taskId}/${file.name}`);
          await uploadBytes(fileRef, file);
          return getDownloadURL(fileRef);
        }
        return null;
      }),
    );
    // 過濾掉所有 null 值
    return urls.filter((url) => url != null);
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
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          // 設置接案人的名稱
          setAcceptorName(userSnap.data().name);
        }
      }
    });
  }, []);
  useEffect(() => {
    if (taskStatus === "已完成") {
      setShowOverlay(false);
    }
  }, [taskStatus]);
  const handleReportSubmit = async () => {
    if (!taskId) {
      console.error("Task ID is undefined");
      return;
    }
    if (reportDescription === undefined) {
      console.error("reportDescription is undefined");
      // 處理這個錯誤，比如通過顯示錯誤消息給用戶
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
          // 确保 imageUrls 不包含 null 值
          const filteredImageUrls = imageUrls.filter(
            (url) => url !== null,
          ) as string[];
          const updates = {
            reportFiles: filteredImageUrls,
            reportDescription: reportDescription ?? "",
            reportSupplementaryNotes: reportSupplementaryNotes ?? "",
            status: "任務回報完成",
          };
          const taskRef = doc(db, "tasks", taskId);
          await updateDoc(taskRef, updates);
          setTaskDetails((prev) =>
            prev ? { ...prev, ...updates, photos: filteredImageUrls } : null,
          );
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
          Swal.fire({
            title: "發生錯誤",
            text: "無法送出驗收結果",
            icon: "error",
          });
        }
      }
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
    return (
      <div>
        <p>任務載入中...請稍等</p>
      </div>
    );
  }
  if (!taskDetails) {
    return (
      <div>
        <p>目前沒有任務...</p>
      </div>
    );
  }
  return (
    <>
      <Header />
      <div className="container mx-auto max-w-[1280px] px-4 py-10 md:pb-20 md:pt-10 lg:px-20">
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
        <div className="flex flex-col lg:flex-row">
          {/* 左邊區塊開始 */}
          <div className="space-y-4 p-4 lg:w-1/3">
            {/* 案主 */}
            <div className="flex items-center space-x-2">
              <div className="flex-grow items-center text-xl  font-semibold tracking-wider text-[#3178C6]">
                <span className="text-xl tracking-wider">發案者名稱：</span>
                {posterName}
              </div>
            </div>
            {/* 任務截止日期 */}
            <div className="flex items-center space-x-2">
              <div className="grow text-xl font-semibold tracking-wider ">
                <span className="tracking-wider">任務截止日期：</span>
                {taskDetails.dueDate}
              </div>
            </div>
            <div className="my-auto mb-6 ml-auto">
              <button
                onClick={handleAskDetails}
                className="flex items-center justify-center rounded-md bg-[#368DCF] px-4 py-2 text-lg font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
              >
                <Icon icon="ant-design:message-filled" className="mr-3" />
                <span className="flex items-center text-xl">
                  聯繫發案者
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-block translate-x-0 transition-transform duration-300 ease-in-out group-hover:translate-x-2"
                  ></span>
                </span>
              </button>
              {isChatOpen && taskId && (
                <ChatRoomWindow onCloseRoom={handleCloseChat} />
              )}
            </div>
          </div>
          {/* 左邊區塊結束 */}
          {/* 右邊區塊開始 */}
          <div className="grid grid-cols-1 gap-4 rounded-md bg-[#B3D7FF] p-4 md:grid-cols-2 lg:w-2/3">
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
              {/* 其他備註 */}
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
        <div className="mb-10 flex items-center justify-between">
          <ul className="flex flex-wrap justify-center gap-4">
            {taskDetails.photos?.map((photo) => (
              <li
                key={photo}
                className="h-52 w-full border-2 border-dashed border-[#368dcf] sm:w-52"
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

            {[...Array(5 - (taskDetails.photos?.length || 0))].map(
              (_, index) => (
                <li
                  key={index}
                  className="flex h-52 w-full items-center justify-center border-2 border-dashed border-[#368dcf] font-extrabold sm:w-52"
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
        <form className="relative mb-10  p-4">
          <div className="flex items-center">
            <div className="mb-2 flex items-center text-gray-700">
              <p className=" mr-2 text-3xl font-semibold">驗收內容</p>
              {/* 條件渲染：僅在非"已完成"狀態時顯示 */}
              <p className="text-medium flex flex-col justify-end font-semibold text-red-600">
                圖片大小不超過 5MB
              </p>
            </div>
          </div>
          <ul className="flex flex-wrap gap-4">
            {selectedImages.map((image, index) => (
              <li
                key={index}
                className="relative mb-2 h-48 w-full border-2 border-dashed border-[#368dcf] md:w-48"
              >
                <input
                  type="file"
                  name="taskPhoto"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={(e) => handleImgSelect(e, index)}
                  className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                {!image && (
                  <span className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transform text-center font-medium text-[#368dcf]">
                    請選擇圖片檔案
                  </span>
                )}
                {image && (
                  <img
                    src={image}
                    alt={`Uploaded ${index}`}
                    className="h-full w-full object-cover"
                  />
                )}
              </li>
            ))}
          </ul>

          {/* 顯示任務回報說明 */}
          <div>
            <label
              htmlFor="input1"
              className="text-xl font-medium text-gray-700"
            >
              任務回報說明
            </label>
            <textarea
              id="input1"
              name="input1"
              rows={3}
              readOnly={taskStatus === "已完成"}
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
              className="block text-xl font-medium text-gray-700"
            >
              超人補充說明
            </label>
            <textarea
              id="input2"
              name="input2"
              rows={3}
              readOnly={taskStatus === "已完成"}
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
              className="flex text-xl font-medium text-gray-700"
            >
              To 超人的評價
              <span className="flex items-center text-sm font-medium text-[#2B79B4]">
                <Icon icon="solar:star-bold" />
                案主填寫
              </span>
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              className={`bg-[#f7f4f0]] mb-3 mt-1 block w-full cursor-not-allowed resize-none rounded-md border border-gray-300 p-2.5 tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-300`}
              readOnly
              value={ratedComment} // ratedComment 是從 reviews 集合獲取
            />
          </div>
          {/* 發案者回饋 */}
          <div>
            <label
              htmlFor="input3"
              className="flex text-xl font-medium text-gray-700"
            >
              發案者回饋
              <span className="flex items-center text-sm font-medium text-[#2B79B4]">
                <Icon icon="solar:star-bold" />
                案主填寫
              </span>
            </label>
            <textarea
              id="input3"
              name="input3"
              rows={3}
              className="bg-[#f7f4f0]] mb-10 mt-1 block w-full cursor-not-allowed resize-none rounded-md border border-gray-300 p-2.5 tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
              }rounded-md bg-[#368DCF] px-6 py-3 text-xl font-medium tracking-wider text-white transition duration-500 ease-in-out hover:bg-[#3178C6]`}
            >
              送出
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
                        <span className="font-extrabold text-blue-500">
                          確定
                        </span>
                        開始驗收
                      </p>
                      <button
                        type="button"
                        className="absolute bottom-5 left-1/2 -translate-x-1/2 transform rounded-md bg-[#368DCF]  p-3 px-4 py-2 text-xl font-medium tracking-wider text-white transition duration-500 ease-in-out hover:bg-[#3178C6]"
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
      <Footer />
    </>
  );
};
export default AcceptTaskDetail;
