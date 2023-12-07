import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { app, auth } from "../../config/firebase"; // 導入初始化的 Firebase app
import { showAlert } from "../../utils/showAlert";
import ServiceType, { ServiceTypeRef } from "../components/ServiceType";
import countyToRegion from "../components/TaiwanRegion";
const db = getFirestore(app);
// 使用Firebase App實例獲取Storage的參考
const storage = getStorage(app);
const Task = () => {
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState("");
  // const [taskDetails, setTaskDetails] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  // 保留 selectedRegion 儲存地區的 state
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [taskReward, setTaskReward] = useState("");
  const [superCoins, setSuperCoins] = useState(5000); // 初始 Super Coin 數量
  const [originalSuperCoins] = useState(5000); // 保存原始 Super Coin 數量
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const serviceTypeRef = useRef<ServiceTypeRef>(null);
  const [userName, setUserName] = useState("");
  const [uploadedImages, setUploadedImages] = useState(["", "", "", ""]);
  const navigate = useNavigate();
  const handleCountyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const county = event.target.value;
    setSelectedCounty(county);
    setSelectedRegion("");
  };
  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(event.target.value);
  };
  const handleTaskRewardChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rewardValue = Number(event.target.value);
    if (!isNaN(rewardValue) && rewardValue >= 0) {
      if (rewardValue <= superCoins) {
        setTaskReward(event.target.value); // 更新任務報酬為 string 類型
        setSuperCoins((prevCoins) => prevCoins - rewardValue); // 正確更新剩餘金幣數量
      } else {
        showAlert("🚨系統提醒", "已超過可用 Super Coin 數量...");
      }
    } else {
      showAlert("🚨系統提醒", "請輸入有效的數字...");
    }
  };
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 更新對應 index 的圖片 URL
        setUploadedImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = reader.result as string;
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const backToHome = () => {
    navigate("/");
  };
  useEffect(() => {
    const rewardValue = Number(taskReward);
    if (!isNaN(rewardValue) && rewardValue <= originalSuperCoins) {
      setSuperCoins(originalSuperCoins - rewardValue);
    }
  }, [taskReward, originalSuperCoins]);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          // 從 Firestore 讀取用戶資訊
          const userData = userDoc.data();
          setUserName(userData.name || "未知用戶");
          // 讀取 userName字段
        } else {
          // 若用戶資料不存在於 Firestore，則建立初始資料
          await setDoc(userDocRef, {
            userId: user.uid,
            userName: user.displayName || "未設置名稱",
            email: user.email || "未知郵箱",
            joinedAt: new Date().toISOString(),
            superCoins: 5000,
          });
          setUserName(user.displayName || "未設置名稱");
          setSuperCoins(5000);
        }
      }
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const fetchUserCoins = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().superCoins !== undefined) {
          setSuperCoins(userDoc.data().superCoins);
        }
      }
    };
    fetchUserCoins();
  }, []);
  const uploadFile = async (file: File) => {
    const fileRef = storageRef(storage, "some/path/" + file.name);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };
  const fileInputs = document.querySelectorAll('input[type="file"]');
  const deleteTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fileInputs.forEach((input) => {
      (input as HTMLInputElement).value = ""; // 直接操作 DOM 清除選擇的檔案
    });
    if (serviceTypeRef.current) {
      serviceTypeRef.current.resetServiceType();
    }
    Swal.fire({
      title: "確定要刪除任務嗎？",
      html: "<strong style='color: red;'>此操作將清空所有已填寫的資訊</strong>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "已刪除",
          text: "任務資訊已清空",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
        });
        resetFormFields();
        navigate("/");
      }
    });
  };
  const confirmSubmitTask = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    // 取得所有選擇的文件
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const files = Array.from(fileInputs).flatMap((input) => {
      const inputElement = input as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        return [inputElement.files[0]]; // 確保文件存在，並回傳一個含有該文件的陣列
      }
      return []; // 如果沒有文件，回傳一個空陣列
    });
    if (!currentUserId) {
      showAlert("錯誤", "無法識別用戶身份");
      return;
    }
    const taskRewardValue = Number(taskReward);
    if (isNaN(taskRewardValue) || taskRewardValue < 0) {
      showAlert("錯誤", "無效的任務報酬");
      return;
    }
    const result = await Swal.fire({
      title: "🚨系統提醒",
      html: `<strong style='color: #8D91AA;'>Hi ${userName}${" "}，是否提交任務?</strong>`,
      text: "請再次確認所有資訊皆已填寫",
      icon: "question",
      confirmButtonText: "確定",
      showCancelButton: true,
      cancelButtonText: "取消",
      reverseButtons: true,
      allowOutsideClick: false,
    });
    if (result.isConfirmed) {
      try {
        // 上傳文件並取得 URL
        const uploadPromises = files.map((file) => uploadFile(file));
        const photoUrls = await Promise.all(uploadPromises);
        // 建立新的任務資料
        const taskData = {
          title: taskTitle,
          city: selectedCounty,
          district: selectedRegion,
          address: detailedAddress,
          description: taskDescription,
          notes: additionalNotes,
          categorys: serviceTypeRef.current?.getSelectedServiceTypes(),
          isUrgent: serviceTypeRef.current?.getUrgentStatus(),
          dueDate: serviceTypeRef.current?.getDate(),
          status: "任務媒合中",
          photos: photoUrls,
          createdBy: currentUserId,
          taskId: uuidv4(),
          createdAt: new Date().toLocaleDateString(),
          cost: taskRewardValue,
          acceptedBy: "",
        };
        // 將任務存到資料庫
        await addDoc(collection(db, "tasks"), taskData);
        // 更新用戶的 Super Coins
        await updateDoc(doc(db, "users", currentUserId), {
          superCoins: superCoins - taskRewardValue,
        });
        setSuperCoins(superCoins - taskRewardValue);
        Swal.fire("提交成功", "任務訊息已更新，謝謝您", "success");
        resetFormFields();
        if (serviceTypeRef.current) {
          serviceTypeRef.current.resetServiceType();
        }
        navigate("/");
      } catch (error) {
        console.error("錯誤：", error);
        await Swal.fire("錯誤", "任務提交失敗或無可用 Super Coin");
      }
    }
  };
  const resetFormFields = () => {
    setSelectedCounty("");
    setSelectedRegion("");
    setTaskTitle("");
    setTaskDescription("");
    setDetailedAddress("");
    setAdditionalNotes("");
    setTaskReward("");
  };
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:max-w-7xl lg:px-20">
        <div className="mb- mt-10  flex items-center border-b-8 border-l-[10px] border-black border-l-indigo-500">
          <h3 className="mb-4 text-4xl font-bold">發任務</h3>
          {/* <div className="flex flex-col border-l-[10px] border-l-indigo-500"></div> */}
        </div>
        <div className="">
          <form>
            <div className="flex flex-col">
              <div className="mb-4 flex items-center">
                <span className="mr-2 h-8 w-2 bg-blue-500"></span>
                <label htmlFor="taskTitle" className="text-3xl font-black">
                  標題
                </label>
              </div>
              <input
                type="text"
                id="taskTitle"
                value={taskTitle} // 綁定 taskTitle 狀態
                onChange={(e) => setTaskTitle(e.target.value)} // 更新狀態
                placeholder="例如 : 請人幫我...，請盡量輸入明白的任務需求"
                className="mb-4 w-full rounded-md border bg-gray-200 p-3 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="mb-4 flex flex-wrap items-center">
              <div className="mb-4 flex items-center">
                <span className="mr-2 h-8 w-2 bg-blue-500"></span>
              </div>
              <p className="mb-4 mr-3 whitespace-nowrap text-3xl font-black">
                需求類別 / 地址
              </p>
              <select
                className="mb-4 mr-3 flex items-center rounded-md border bg-gray-300 p-2 focus:outline-none"
                name="county"
                id="county"
                value={selectedCounty}
                onChange={handleCountyChange}
              >
                <option value="">請選擇任務縣市</option>
                <option value="台北市">台北市</option>
                <option value="新北市">新北市</option>
                <option value="桃園市">桃園市</option>
                <option value="台中市">台中市</option>
                <option value="台南市">台南市</option>
                <option value="高雄市">高雄市</option>
                <option value="基隆市">基隆市</option>
                <option value="新竹市">新竹市</option>
                <option value="新竹縣">新竹縣</option>
                <option value="苗栗縣">苗栗縣</option>
                <option value="彰化縣">彰化縣</option>
                <option value="南投縣">南投縣</option>
                <option value="雲林縣">雲林縣</option>
                <option value="嘉義市">嘉義市</option>
                <option value="嘉義縣">嘉義縣</option>
                <option value="屏東縣">屏東縣</option>
                <option value="宜蘭縣">宜蘭縣</option>
                <option value="花蓮縣">花蓮縣</option>
                <option value="台東縣">台東縣</option>
              </select>
              {selectedCounty && (
                <div className="mr-3 flex items-center">
                  <select
                    className="mb-4 flex flex-wrap items-center  rounded-md border bg-gray-300 p-2 focus:outline-none"
                    name="region"
                    id="region"
                    onChange={handleRegionChange}
                  >
                    <option value="">請選擇任務地區</option>
                    {countyToRegion[selectedCounty]?.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <input
                type="text"
                placeholder="請輸入詳細地址，例如 : xx 路 x 巷 x 弄 x 號 x 樓"
                className="w-full rounded-md border bg-gray-200 p-3 focus:bg-white focus:outline-none"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
              />
            </div>
            <ServiceType ref={serviceTypeRef} />
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              <div className="flex w-full flex-col lg:w-1/2">
                <div className="mb-4 flex items-center">
                  <div className="flex items-center">
                    <span className="mr-2 h-8 w-2 bg-blue-500"></span>

                    <p className="mr-3 text-3xl font-black">任務說明</p>
                    <p className="flex flex-col justify-end font-black text-red-600">
                      請輸入20字以上，好讓人明白要做什麼事情
                    </p>
                  </div>
                </div>
                <textarea
                  className="h-30 mb-4 w-full resize-none rounded-md border bg-gray-200 p-4 focus:bg-white focus:outline-none"
                  name="startTaskContent"
                  id="startTaskContent"
                  placeholder="例：我需要為我的網站設計 LOGO，未來我想用在作品集"
                  value={taskDescription} // 綁定 taskDescription 狀態
                  onChange={(e) => setTaskDescription(e.target.value)} // 更新狀態
                ></textarea>
              </div>
              <div className="flex w-full flex-col items-start lg:w-1/2">
                <div className="flex items-center text-right">
                  <span className="mb-4 mr-2 h-8 w-2 bg-blue-500"></span>
                  <p className="mb-4 mr-3 text-3xl font-black">其它備註</p>
                </div>
                <textarea
                  className="h-30 mb-4 w-full resize-none rounded-md border bg-gray-200 p-4 focus:bg-white focus:outline-none"
                  name="additionalNotes"
                  id="additionalNotes"
                  placeholder="例：誠信交易，請有經驗的帥哥美女幫幫忙"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="mb-20 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center text-right">
                  <span className="mr-2 h-8 w-2 bg-blue-500"></span>
                  <p className="mr-3 text-3xl font-black">任務報酬</p>
                </div>
                <input
                  type="text"
                  id="taskReward"
                  placeholder="願支付多少 Coin 請人完成任務"
                  className="mr-4 w-72 rounded-md border bg-gray-200 p-3 focus:bg-white focus:outline-none"
                  value={taskReward}
                  onChange={handleTaskRewardChange}
                />
                <span className="text-xl font-black">Super Coins</span>
              </div>
              <div className="flex items-center text-xl font-medium">
                <p>剩餘 :</p>
                <span className="ml-1 underline">&emsp;{superCoins}&emsp;</span>
                <span className="ml-1">Super Coins</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex">
                <span className="mr-2 h-8 w-2 bg-blue-500"></span>
                <p className="mr-3 text-3xl font-black">上傳照片</p>
                <p className="flex flex-col justify-end text-lg font-black text-red-600">
                  建議上傳
                </p>
              </div>
              <ul className="flex items-center justify-between">
                {uploadedImages.map((image, index) => (
                  <li
                    key={index}
                    className="relative m-2 h-64 w-64 border-2 border-dashed border-black"
                  >
                    <input
                      type="file"
                      onChange={(e) => handleImageChange(e, index)}
                      className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                    />
                    {image && (
                      <img
                        src={image}
                        alt={`Uploaded ${index}`}
                        className="max-h-full max-w-full object-cover"
                      />
                    )}
                    {!image && (
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-gray-600">
                        選擇上傳檔案
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex text-2xl">
                <div className="group pointer-events-auto relative w-full overflow-hidden rounded-md bg-pink-600 px-6 py-3 text-center [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-pink-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[25] hover:before:opacity-100">
                  刪除任務
                  <button
                    type="button"
                    onClick={deleteTask}
                    className="absolute inset-0 h-full w-full text-white opacity-0 transition duration-500 ease-in-out hover:opacity-100"
                  >
                    {"刪除任務"}
                  </button>
                </div>
                <div className="group pointer-events-auto relative w-full overflow-hidden rounded-md bg-teal-600 px-6 py-3 text-center [transform:translateZ(0)] before:absolute before:left-1/2 before:top-1/2 before:h-8 before:w-8 before:-translate-x-1/2 before:-translate-y-1/2 before:scale-[0] before:rounded-full before:bg-teal-600 before:opacity-0 before:transition before:duration-500 before:ease-in-out hover:before:scale-[25] hover:before:opacity-100">
                  刊登任務
                  <button
                    type="button"
                    onClick={confirmSubmitTask}
                    className="absolute inset-0 h-full w-full text-white opacity-0 transition duration-500 ease-in-out hover:opacity-100"
                  >
                    {"刊登任務"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Task;
