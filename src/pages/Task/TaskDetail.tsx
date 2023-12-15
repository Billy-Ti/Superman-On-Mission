import { Icon } from "@iconify/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { db } from "../../config/firebase";

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
  // 存發案者名稱，以存取不同集合中的 user
  const [posterName, setPosterName] = useState("");

  // 儲存已選擇的圖片，用作點及圖片可放大的前置準備
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  // 建立一個視窗，讓圖片可以被點擊後放大，有預覽的效果
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentUserID, setCurrentUserID] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 使用者登錄了，設置使用者 ID
        setCurrentUserID(user.uid);
      } else {
        // 使用者未登錄
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
          {/* 左邊區塊開始 */}
          <div className="space-y-4 p-4 lg:w-1/3">
            {/* 案主 */}
            <div className="flex items-center space-x-2">
              <div className="flex-grow items-center text-xl tracking-wider">
                <span className="font-semibold tracking-wider">
                  發案者名稱：
                </span>
                {posterName}
              </div>
            </div>
            {/* 任務截止日期 */}
            <div className="flex items-center space-x-2">
              <div className="flex-grow tracking-wider text-xl">
                <span className="font-semibold tracking-wider">
                  任務截止日期：
                </span>
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
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-bold text-gray-500">
                任務名稱
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.title}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              {/* 任務地點 */}
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
              {/* 任務類型 */}
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
              {/* 任務報酬 Super Coins */}
              <div className="mb-3  border-b-4 border-b-[#B3D7FF] text-center text-xl font-bold text-gray-500">
                任務報酬 Super Coins
              </div>
              <div className="flex items-center font-medium text-[#3178C6]">
                <span>{taskDetails.cost}</span>
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              {/* 任務說明 */}
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-bold text-gray-500">
                任務說明
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.description}
              </div>
            </div>
            <div className="rounded-md bg-white p-4">
              {/* 其他備註 */}
              <div className="mb-3 border-b-4 border-b-[#B3D7FF] text-center text-xl font-bold text-gray-500">
                其他備註
              </div>
              <div className="font-medium text-[#3178C6]">
                {taskDetails.notes}
              </div>
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
        <div className="flex justify-center gap-4">
          <button
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
