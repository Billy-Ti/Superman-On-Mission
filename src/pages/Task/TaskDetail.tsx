import { Icon } from "@iconify/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingSpinner from "../../components/LoadingSpinner";
import ChatRoomWindow from "../../components/chatRoom";
import Footer from "../../layout/Footer";
import Header from "../../layout/Header";
import { db } from "../../utils/firebase";

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
  userId: string;
  address: string;
  categorys: string[];
  photos?: string[];
}

const TaskDetail = () => {
  const { taskId } = useParams();
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [posterName, setPosterName] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserID, setCurrentUserID] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const navigate = useNavigate();

  const handleAskDetails = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const createNotification = async (
    db: Firestore,
    taskId: string,
    createdBy: string,
    acceptedBy: string,
  ) => {
    const notificationRef = collection(db, "notifications");
    const q = query(
      notificationRef,
      where("taskId", "==", taskId),
      where("createdBy", "==", createdBy),
      where("acceptedBy", "==", acceptedBy),
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const newNotification = {
          taskId,
          createdBy,
          acceptedBy,
          message: "您的任務已被接受",
          read: false,
          timestamp: new Date(),
        };
        await addDoc(notificationRef, newNotification);
      } else {
        querySnapshot.forEach(async (docSnapshot) => {
          await updateDoc(docSnapshot.ref, { timestamp: new Date() });
        });
      }
    } catch (error) {
      console.error("錯誤創建/更新通知", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserID(user.uid);
      } else {
        setCurrentUserID(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
          const userId = taskData.createdBy;
          if (userId) {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setPosterName(userSnap.data().name);
            }
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
    return <LoadingSpinner />;
  }

  if (!taskDetails) {
    return <div>No task details available.</div>;
  }

  const handleConfirmAcceptTask = async () => {
    if (!currentUserID) {
      Swal.fire({
        title: "未登入",
        text: "您需要登入才能開始接案",
        icon: "warning",
        confirmButtonText: "好的",
        customClass: {
          confirmButton:
            "hover:bg-[#368DCF] text-white font-bold py-2 px-4 rounded",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signIn");
        }
      });
      return;
    }
    if (!taskId || !currentUserID) {
      console.error("Task ID or User ID is missing");
      return;
    }

    if (taskDetails && currentUserID === taskDetails.createdBy) {
      Swal.fire({
        title: "操作無效",
        text: "您不能接受自己創建的任務",
        icon: "error",
        confirmButtonText: "好的",
        customClass: {
          confirmButton:
            "hover:bg-[#2b79b4] text-white font-bold py-2 px-4 rounded-md",
        },
      });
      return;
    }

    Swal.fire({
      title: "確定要接下此任務嗎？",
      html: "<strong style='color: red;'>接下後請務必注意任務截止日期</strong>",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      reverseButtons: true,
      allowOutsideClick: false,
      customClass: {
        confirmButton:
          "hover:bg-[#368DCF] text-white font-bold py-2 px-4 rounded",
        cancelButton:
          "hover:bg-gray-700 text-white font-bold py-2 px-4 rounded",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const taskRef = doc(db, "tasks", taskId);
          await updateDoc(taskRef, {
            acceptedBy: currentUserID,
            status: "任務進行中",
            accepted: true,
          });
          await createNotification(
            db,
            taskId,
            taskDetails.createdBy,
            currentUserID,
          );

          Swal.fire({
            title: "已完成",
            html: "<div style='color: #000000; font-weight: bold;'>請至任務管理區查看</div><strong style='color: #22C55E;'>接下後請務必注意任務截止日期</strong>",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          navigate("/taskManagement");
        } catch (error) {
          console.error("Error updating task:", error);
        }
      }
    });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-[1280px] px-4 pt-10 pt-20 md:px-20">
        <div className="mb-4 flex text-3xl font-semibold text-gray-700">
          <span className="h-8 w-2 bg-[#368dcf]"></span>
          <p className="pl-2">任務資訊</p>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="space-y-4 p-4 lg:w-1/3">
            <div className="flex items-center space-x-2">
              <div className="flex-grow items-center text-xl font-semibold tracking-wider text-[#3178C6]">
                <span className="tracking-wider">發案者名稱：</span>
                {posterName}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-grow text-xl font-semibold tracking-wider">
                <span className="tracking-wider">任務截止日期：</span>
                {taskDetails.dueDate}
              </div>
            </div>
            <div className="my-auto mb-6 ml-auto">
              <button
                type="button"
                onClick={handleAskDetails}
                className="flex items-center rounded-md bg-[#368DCF] p-2 text-lg font-medium tracking-wider text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
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
                <div className="h-[100vh]">
                  <ChatRoomWindow onCloseRoom={handleCloseChat} />
                </div>
              )}
            </div>
          </div>
          <div className="mb-10 grid grid-cols-1 gap-4 rounded-md bg-[#B3D7FF] p-4 md:grid-cols-2 lg:w-2/3">
            <div className="rounded-md bg-white p-4">
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-bold text-gray-500">
                任務名稱
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.title}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              <div className="mb-3  border-b-4 border-b-[#B3D7FF] text-center text-xl font-bold text-gray-500">
                任務地點
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.city}
                {taskDetails.district}
                {taskDetails.address}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              <div className="mb-3  border-b-4 border-b-[#B3D7FF] text-center text-xl font-bold text-gray-500">
                任務類型
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.categorys
                  .map((category) => `#${category}`)
                  .join(" ")}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              <div className="mb-3  border-b-4 border-b-[#B3D7FF] text-center text-xl font-bold text-gray-500">
                任務報酬 Super Coins
              </div>
              <div className="flex items-center font-medium text-[#3178C6]">
                <span>{taskDetails.cost}</span>
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-bold text-gray-500">
                任務說明
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.description}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-bold text-gray-500">
                其他備註
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.notes}
              </div>
            </div>
          </div>
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
                  title="點擊預覽"
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
                <div className="mx-4 flex h-full items-center justify-center">
                  <img
                    className=" object-cover "
                    src={selectedPhoto || "defaultImagePath"}
                    alt="Enlarged task photo"
                  />
                  <button
                    type="button"
                    className="absolute bottom-24 left-1/2 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-full p-2 text-black"
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
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={handleConfirmAcceptTask}
            className="flex items-center rounded-md bg-[#368DCF] p-2 text-lg font-medium tracking-wider text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
          >
            <Icon icon="icon-park-outline:check-correct" className="mr-3" />
            確認接案
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TaskDetail;
