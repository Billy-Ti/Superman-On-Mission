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
import ChatRoomWindow from "../../components/chatRoom";
import Footer from "../../layout/Footer";
import Header from "../../layout/Header";
import { db, storage } from "../../utils/firebase";
import { showAlert } from "../../utils/showAlert";
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
  photos?: string[];
}
const AcceptTaskDetail = () => {
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [posterName, setPosterName] = useState<string>("");
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reportDescription, setReportDescription] = useState("");
  const [reportSupplementaryNotes, setReportSupplementaryNotes] = useState("");
  const [selectedImages, setSelectedImages] = useState(Array(5).fill(null));
  const [ratedComment, setRatedComment] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>(Array(5).fill(null));
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [acceptorName, setAcceptorName] = useState("");
  const [reportDescriptionError, setReportDescriptionError] = useState(false);

  const { taskId } = useParams<{ taskId: string }>();
  const taskIsAccepted = taskDetails && taskDetails.accepted;
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
    if (
      taskDetails.taskStatus === "任務回報完成" ||
      taskDetails.taskStatus === "已完成"
    ) {
      return;
    }
    const newReportDescription = event.target.value;
    setReportDescription(newReportDescription);
    setTaskDetails((prevDetails) => {
      if (prevDetails === null) return null;
      return {
        ...prevDetails,
        reportDescription: newReportDescription,
      };
    });
    if (reportDescriptionError) {
      setReportDescriptionError(false);
    }
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
    if (!file) {
      return;
    }

    if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
      showAlert("錯誤", "只能上傳圖片格式（.png / .jpg / .jpeg）", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert("錯誤", "圖片大小不能超過 5 MB", "error");
      return;
    }

    updateSelectedImages(file, index);
  };

  const updateSelectedImages = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (result) {
        const updatedImages = [...selectedImages];
        updatedImages[index] = result.toString();
        setSelectedImages(updatedImages);

        const updatedImageFiles = [...imageFiles];
        updatedImageFiles[index] = file;
        setImageFiles(updatedImageFiles);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadImages = async (): Promise<string[]> => {
    try {
      const uploadAndGetURL = async (
        file: File | null,
      ): Promise<string | null> => {
        if (!file) return null;

        const fileRef = ref(storage, `tasks/${taskId}/${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      };

      const validFiles = imageFiles.filter(
        (file): file is File => file instanceof File,
      );

      const urls = await Promise.all(validFiles.map(uploadAndGetURL));
      return urls.filter((url): url is string => url !== null);
    } catch (error) {
      console.error("Error uploading images:", error);
      showAlert("上傳錯誤", "圖片上傳失敗", "error");
      return [];
    }
  };

  const fetchTask = async () => {
    if (!taskId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const taskRef = doc(db, "tasks", taskId);
    try {
      const docSnap = await getDoc(taskRef);
      if (docSnap.exists()) {
        const taskData = docSnap.data() as Task;
        setTaskDetails(taskData);
        setTaskStatus(taskData.status);
        setReportDescription(taskData.reportDescription ?? "");
        setReportSupplementaryNotes(taskData.reportSupplementaryNotes ?? "");
        const userRef = doc(db, "users", taskData.createdBy);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setPosterName(userSnap.data().name);
        } else {
          setPosterName("未知用戶");
        }
      } else {
        setTaskDetails(null);
      }
    } catch (error) {
      console.error("Error getting document:", error);
    } finally {
      setLoading(false);
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
    if (!reportDescription.trim()) {
      setReportDescriptionError(true);
      showAlert("🚨 系統提醒", "請填寫必填項目...", "error");
      return;
    } else {
      setReportDescriptionError(false);
    }
    if (reportDescription === undefined) {
      console.error("reportDescription is undefined");
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
          setLoading(true);
          const imageUrls = await uploadImages();
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
      setLoading(false);
    });
  };
  useEffect(() => {
    const fetchRatedComment = async () => {
      if (typeof taskId === "string") {
        const reviewsRef = collection(db, "reviews");
        const q = query(reviewsRef, where("reviewTaskId", "==", taskId));
        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
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
          const auth = getAuth();
          const currentUser = auth.currentUser;
          const isPoster = currentUser?.uid === taskData.createdBy;
          if (isPoster && taskData.status === "任務回報完成") {
            setShowOverlay(false);
          }
        } else {
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
      <div className="flex h-screen items-center justify-center">
        <p>資料載入中...</p>
      </div>
    );
  }

  if (!taskDetails) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>資訊不存在...</p>
      </div>
    );
  }
  return (
    <>
      <Header />
      <div className="container mx-auto max-w-[1280px] px-4 py-10 md:pb-20 md:pt-10 lg:px-20">
        <div className="mb-4 mt-4 flex text-3xl font-semibold text-gray-700">
          <span className="h-8 w-2 bg-[#368dcf]"></span>
          <p className="pl-2">任務資訊</p>
        </div>
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
        <div className="flex flex-col lg:flex-row">
          <div className="space-y-4 p-4 lg:w-1/3">
            <div className="flex items-center space-x-2">
              <div className="flex-grow items-center text-xl  font-semibold tracking-wider text-[#3178C6]">
                <span className="text-xl tracking-wider">發案者名稱：</span>
                {posterName}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="grow text-xl font-semibold tracking-wider ">
                <span className="tracking-wider">任務截止日期：</span>
                {taskDetails.dueDate}
              </div>
            </div>
            <div className="my-auto mb-6 ml-auto">
              <button
                type="button"
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
          <div className="mb-10 grid grid-cols-1 gap-4 rounded-md bg-[#B3D7FF] p-4 md:grid-cols-2 lg:w-2/3">
            <div className="rounded-md bg-white p-4">
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                任務名稱
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.title}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
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
              <div className="mb-3  border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                任務報酬 Super Coins
              </div>
              <div className="flex items-center font-medium text-[#3178C6]">
                <span>{taskDetails.cost}</span>
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                任務說明
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.description}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                其他備註
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.notes}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-black text-gray-500">
                接案者名稱
              </div>
              <div className="font-medium text-[#3178C6]">{acceptorName}</div>
            </div>
          </div>
        </div>
        <div className="mb-4 mt-4 flex text-3xl font-semibold text-gray-700">
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
              <div className="relative overflow-auto">
                <div className="mx-4 flex h-full items-center justify-center">
                  <img
                    className="object-cover"
                    src={selectedPhoto || "defaultImagePath"}
                    alt="Enlarged task photo"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-full p-2 text-black"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <span className="absolute -left-4 -top-4 flex h-10 w-10 animate-ping items-center justify-center rounded-full bg-[#2B79B4] text-sm text-white opacity-75">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        role="img"
                        aria-label="關閉icon"
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
        <form className="relative mb-10 py-4">
          <div className="flex items-center">
            <div className="mb-2 flex items-center text-gray-700">
              <p className=" mr-2 text-3xl font-semibold">驗收內容</p>
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
                  disabled={
                    taskStatus === "任務回報完成" || taskStatus === "已完成"
                  }
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

          <div>
            <label
              htmlFor="mission-return"
              className="text-xl font-medium text-gray-700"
            >
              任務回報說明
            </label>
            <span className="mr-2 text-sm text-red-600">*必填</span>
            <textarea
              id="mission-return"
              name="mission-return"
              rows={3}
              readOnly={taskStatus === "已完成"}
              className={`mb-3 mt-1 block w-full resize-none rounded-md border p-2.5 font-medium tracking-wider shadow-sm focus:outline-none ${
                reportDescriptionError ? "border-red-500" : "border-gray-300"
              } ${
                taskStatus === "任務回報完成" || taskStatus === "已完成"
                  ? "cursor-not-allowed"
                  : "focus:border-blue-500 focus:ring-blue-500"
              }`}
              value={taskDetails.reportDescription}
              onChange={handleReportDescriptionChange}
              placeholder="請填寫關於此次任務的詳細內容"
            />
          </div>
          <div>
            <label
              htmlFor="additional"
              className="block text-xl font-medium text-gray-700"
            >
              超人補充說明
            </label>
            <textarea
              id="additional"
              name="additional"
              rows={3}
              readOnly={taskStatus === "已完成"}
              onChange={handleReportSupplementaryNotesChange}
              className={`mb-3 mt-1 block w-full resize-none rounded-md border border-gray-300 p-2.5 font-medium tracking-wider ${
                taskStatus === "任務回報完成" || taskStatus === "已完成"
                  ? "cursor-not-allowed"
                  : ""
              } shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              value={taskDetails.reportSupplementaryNotes}
              placeholder="如要備註其他事項可填寫於此"
            />
          </div>
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
              className={`bg-[#f7f4f0]] mb-3 mt-1 block w-full cursor-not-allowed resize-none rounded-md border border-gray-300 p-2.5 font-medium tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-300`}
              readOnly
              value={ratedComment}
              placeholder="案主評價內容將顯示於此"
            />
          </div>
          <div>
            <label
              htmlFor="acceptance-feedback"
              className="flex text-xl font-medium text-gray-700"
            >
              發案者回饋
              <span className="flex items-center text-sm font-medium text-[#2B79B4]">
                <Icon icon="solar:star-bold" />
                案主填寫
              </span>
            </label>
            <textarea
              id="acceptance-feedback"
              name="acceptance-feedback"
              rows={3}
              className="bg-[#f7f4f0]] mb-10 mt-1 block w-full cursor-not-allowed resize-none rounded-md border border-gray-300 p-2.5 font-medium tracking-wider shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              readOnly
              value={taskDetails.feedbackMessage}
            />
          </div>
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
              {loading ? (
                <>
                  <svg
                    className="mr-2 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  送出中...
                </>
              ) : (
                "送出"
              )}
            </button>
          </div>
          {showOverlay && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50">
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
