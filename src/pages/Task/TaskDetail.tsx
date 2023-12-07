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

  const handleBackToTask = () => navigate("/acceptTask");

  const handleConfirmAcceptTask = async () => {
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
          navigate("/");
        } catch (error) {
          console.error("Error updating task:", error);
        }
      }
    });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-[1280px] px-4 pt-4 md:px-20">
        <div className="p-4">
          <div className="mb-2 text-3xl font-semibold text-gray-700">
            任務資訊{">>"}
            <button
              onClick={handleBackToTask}
              type="button"
              className="text-xl"
            >
              回任務頁
            </button>
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
          <div className="flex items-center justify-between">
            <ul className="flex gap-4 ">
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
          </div>

          <div className="space-y-4 p-4">
            <div className="flex items-center space-x-2">
              <div className="flex-none">
                <Icon
                  icon="openmoji:european-name-badge"
                  width="50"
                  height="50"
                />
              </div>
              <div className="flex-grow tracking-wider">
                <span className="font-semibold tracking-wider">
                  發案者名稱：
                </span>
                {posterName}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-none">
                <Icon
                  icon="material-symbols:other-admission"
                  width="50"
                  height="50"
                />
              </div>
              <div className="flex-grow tracking-wider">
                <span className="font-semibold tracking-wider">任務說明：</span>
                {taskDetails.description}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-none">
                <Icon icon="uiw:date" width="50" height="50" />
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
                <Icon icon="fxemoji:note" width="50" height="50" />
              </div>
              <div className="flex-grow tracking-wider">
                <span className="font-semibold tracking-wider">
                  其他備註 :{" "}
                </span>
                {taskDetails.notes}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            {/* <button
          type="button"
          onClick={handleAskDetails}
          className="group relative overflow-hidden rounded-md bg-gray-300 px-6 py-3 [transform:translateZ(0)] before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-[100%_100%] before:scale-x-0 before:bg-sky-600 before:transition before:duration-500 before:ease-in-out hover:before:origin-[0_0] hover:before:scale-x-100"
        >
          <span className="relative z-0 flex w-60 items-center justify-center rounded-md p-4 text-2xl text-black transition duration-500 ease-in-out group-hover:text-gray-200">
            <Icon icon="uiw:message" className="mr-3" />
            點我詢問細節
          </span>
        </button>
        {isChatOpen && taskId && (
          <ChatRoomWindow onCloseRoom={handleCloseChat} taskId={taskId} />
        )} */}
            <button
              type="button"
              onClick={handleConfirmAcceptTask}
              className="group relative overflow-hidden rounded-md bg-gray-300 px-6 py-3 [transform:translateZ(0)] before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-[100%_100%] before:scale-x-0 before:bg-green-500 before:transition before:duration-500 before:ease-in-out hover:before:origin-[0_0] hover:before:scale-x-100"
            >
              <span className="relative z-0 flex w-60 items-center justify-center rounded-md p-4 text-2xl text-black transition duration-500 ease-in-out group-hover:text-gray-200">
                <Icon icon="icon-park-outline:check-correct" className="mr-3" />
                確認接案
              </span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TaskDetail;
