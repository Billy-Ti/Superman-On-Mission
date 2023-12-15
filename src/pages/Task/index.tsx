import { Icon } from "@iconify/react";
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
  const [taskTitle, setTaskTitle] =
    useState("急徵，請人幫我打掃家裡，有事即將出國");
  const [taskDescription, setTaskDescription] = useState(
    "我需要緊急請人來我家幫我打掃，因為重要長輩來訪，正好我有急事要出國，所以急徵",
  );
  // 保留 selectedRegion 儲存地區的 state
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [detailedAddress, setDetailedAddress] = useState("仁愛路二段99號9樓");
  const [additionalNotes, setAdditionalNotes] = useState(
    "不用準備任何打掃用具，我家什麼都有，帶人就好",
  );
  const [taskReward, setTaskReward] = useState("");
  const [superCoins, setSuperCoins] = useState(5000); // 初始 Super Coin 數量
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const serviceTypeRef = useRef<ServiceTypeRef>(null);
  const [userName, setUserName] = useState("");
  const [uploadedImages, setUploadedImages] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const countyRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const [isCountyDropdownOpen, setIsCountyDropdownOpen] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

  const navigate = useNavigate();
  // const handleCountyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const county = event.target.value;
  //   setSelectedCounty(county);
  //   setSelectedRegion("");
  // };
  // const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedRegion(event.target.value);
  // };
  const handleTaskRewardChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rewardValue = Number(event.target.value);
    if (!isNaN(rewardValue) && rewardValue >= 0) {
      setTaskReward(event.target.value); // 只更新任務報酬
    } else {
      showAlert("🚨系統提醒", "請輸入有效的數字...");
    }
  };
  const onCountyChange = (county: string) => {
    setSelectedCounty(county);
    setSelectedRegion("");
  };

  const onRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

  // 函數來切換縣市下拉的顯示狀態
  const toggleCountyDropdown = () =>
    setIsCountyDropdownOpen(!isCountyDropdownOpen);

  // 函數來切換地區下拉的顯示狀態
  const toggleRegionDropdown = () =>
    setIsRegionDropdownOpen(!isRegionDropdownOpen);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      // 判斷是否為圖片
      if (file.type.startsWith("image/")) {
        // 檢查文件大小是否小于等于5MB
        if (file.size <= 5 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setUploadedImages((prevImages) => {
              const newImages = [...prevImages];
              newImages[index] = reader.result as string;
              return newImages;
            });
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

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (countyRef.current && !countyRef.current.contains(target)) {
        setIsCountyDropdownOpen(false);
      }
      if (regionRef.current && !regionRef.current.contains(target)) {
        setIsRegionDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
    if (
      isNaN(taskRewardValue) ||
      taskRewardValue < 0 ||
      taskRewardValue > superCoins
    ) {
      showAlert(
        "超過可用 Super Coin 數量",
        `您目前剩餘 ${superCoins} Super Coins`,
        "error",
      );
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
        setIsLoading(true); // 開始載入時設置為 true
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
    setIsLoading(false);
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
      <div className="bg-[url('/home_pain_point.png')] bg-cover bg-fixed bg-center object-cover">
        <Header />
        <div className="container mx-auto px-4 md:max-w-7xl lg:px-20">
          <div className="mb-10 mt-10 flex items-center justify-between">
            <div className="flex">
              <span className="mr-2 h-10 w-2 bg-[#368dcf]"></span>
              <h3 className="text-4xl font-bold">發任務</h3>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 220 156"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M132.153 78.5104C132.102 74.8516 131.623 71.1613 130.664 67.4457C127.302 54.4064 112.301 46.0353 96.3344 44.0671C80.3744 42.0989 63.7773 46.5778 57.3807 57.9201C53.7219 64.405 53.2172 69.9942 54.7123 74.7065C56.2011 79.3936 59.7334 83.2794 64.5277 86.3074C77.895 94.7416 101.305 96.4638 111.985 92.9374C116.925 91.3036 121.75 89.3355 126.45 87.0835C123.763 101.826 113.751 115.792 100.39 128.378C71.3534 155.73 26.2933 176.491 1.75409 184.124C0.435662 184.534 -0.296161 185.934 0.113878 187.253C0.523916 188.571 1.92433 189.309 3.24276 188.899C28.2677 181.115 74.2048 159.913 103.816 132.017C119.114 117.609 130.014 101.391 131.875 84.3393C166.457 65.8623 194.857 32.3401 219.138 4.12945C220.04 3.08858 219.92 1.50514 218.873 0.603058C217.826 -0.292719 216.248 -0.179219 215.346 0.867957C192.056 27.9242 165.025 60.1092 132.153 78.5104ZM127.125 81.1915C127.314 77.0785 126.911 72.9023 125.819 68.6884C122.911 57.4029 109.544 50.7287 95.7224 49.0255C87.2503 47.9846 78.5387 48.8426 71.7068 51.8958C67.4109 53.8135 63.8717 56.5954 61.7395 60.3804C58.9386 65.345 58.333 69.5906 59.4811 73.1926C60.6292 76.8199 63.4809 79.7342 67.1964 82.0746C79.3777 89.7644 100.693 91.3983 110.414 88.1874C116.149 86.2949 121.713 83.9356 127.125 81.1915Z"
                fill="black"
              />
            </svg>
          </div>
          <form>
            <div className="mb-8 flex flex-col font-semibold">
              <div className="mb-4 flex items-center">
                <span className="mr-2 h-8 w-2 bg-[#368dcf]"></span>
                <label htmlFor="taskTitle" className="text-2xl">
                  標題
                </label>
              </div>
              <input
                type="text"
                id="taskTitle"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="例如 : 請人幫我...，請盡量輸入明白的任務需求"
                className="w-full rounded-md border bg-[#EFF7FF] p-3 font-semibold focus:bg-white focus:outline-none"
              />
            </div>
            <div className="mb-8 flex flex-wrap items-center">
              <div
                className="relative mb-4 mr-4 flex items-center"
                ref={countyRef}
              >
                <span className="mr-2 h-8 w-2 bg-[#368dcf]"></span>
                <p className="mr-3 whitespace-nowrap text-2xl font-semibold">
                  選擇類別 / 輸入地址
                </p>
                <div className=" relative">
                  <button
                    type="button"
                    onClick={toggleCountyDropdown}
                    className="relative z-10 block overflow-hidden rounded border bg-blue-200 px-3 py-2 shadow focus:outline-none"
                  >
                    {selectedCounty || "選擇縣市"}{" "}
                    <span className="ml-2">▼</span>
                  </button>

                  {isCountyDropdownOpen && (
                    <div className="absolute mt-1 w-full rounded-md bg-blue-200 shadow-lg">
                      <div className="absolute z-10 mt-1 max-h-80 w-40 overflow-auto rounded border bg-blue-200 font-bold shadow-lg">
                        {[
                          "台北市",
                          "新北市",
                          "桃園市",
                          "台中市",
                          "台南市",
                          "高雄市",
                          "基隆市",
                          "新竹市",
                          "新竹縣",
                          "苗栗縣",
                          "彰化縣",
                          "南投縣",
                          "雲林縣",
                          "嘉義市",
                          "嘉義縣",
                          "屏東縣",
                          "宜蘭縣",
                          "花蓮縣",
                          "台東縣",
                        ].map((county) => (
                          <div
                            key={county}
                            className="cursor-pointer px-4 py-1 hover:bg-blue-300 hover:text-white"
                            onClick={() => {
                              onCountyChange(county);
                              setIsCountyDropdownOpen(false);
                              setIsRegionDropdownOpen(true);
                            }}
                          >
                            {county}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative mb-4 flex items-center" ref={regionRef}>
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleRegionDropdown}
                    className="relative z-10 block overflow-hidden rounded border bg-blue-200 px-3 py-2 shadow focus:outline-none"
                  >
                    {selectedRegion || "選擇地區"}{" "}
                    <span className="ml-2">▼</span>
                  </button>
                  {isRegionDropdownOpen && (
                    <div className="absolute mt-1 max-h-80 w-40 overflow-auto rounded-md bg-blue-200 shadow-lg">
                      {countyToRegion[selectedCounty]?.map((region) => (
                        <div
                          key={region}
                          className="cursor-pointer px-4 py-1 hover:bg-blue-300 hover:text-white"
                          onClick={() => onRegionChange(region)}
                        >
                          {region}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <input
                type="text"
                placeholder="請輸入詳細地址，例如 : xx 路 x 巷 x 弄 x 號 x 樓"
                className="w-full rounded-md border bg-[#EFF7FF] p-3 font-semibold focus:bg-white focus:outline-none"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
              />
            </div>

            <ServiceType ref={serviceTypeRef} />
            <div className="mb-4 flex flex-col items-center justify-between gap-4 lg:flex-row">
              <div className="flex w-full flex-col lg:w-1/2">
                <div className="mb-4 flex items-center">
                  <div className="flex">
                    <span className="mr-2 h-8 w-2 bg-[#368dcf]"></span>
                    <p className="mr-3 text-2xl font-semibold">任務說明</p>
                    <p className="text-medium flex flex-col justify-end font-semibold text-red-600">
                      請輸入20字以上，以明白要做什麼事情
                    </p>
                  </div>
                </div>
                <textarea
                  className="h-30 mb-4 w-full resize-none rounded-md border bg-[#EFF7FF] p-4 font-semibold focus:bg-white focus:outline-none"
                  name="startTaskContent"
                  id="startTaskContent"
                  value={taskDescription}
                  placeholder="例：我需要為我的網站設計 LOGO，未來我想用在作品集"
                  onChange={(e) => setTaskDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="flex w-full flex-col items-start lg:w-1/2">
                <div className="mb-4 flex items-center text-right">
                  <span className="mr-2 h-8 w-2 bg-[#368dcf]"></span>
                  <p className="mr-3 text-2xl font-semibold">其它備註</p>
                </div>
                <textarea
                  className="h-30 mb-4 w-full resize-none rounded-md border bg-[#EFF7FF] p-4 font-semibold focus:bg-white focus:outline-none"
                  name="additionalNotes"
                  id="additionalNotes"
                  placeholder="例：誠信交易，請有經驗的帥哥美女幫幫忙"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="mb-20 flex items-center justify-between">
              <div className="flex w-full flex-col items-start lg:w-1/2">
                <div className="mb-4 flex items-end text-right">
                  <span className="mr-2 h-8 w-2 bg-[#368dcf]"></span>
                  <p className="mr-3 text-2xl font-semibold">任務報酬</p>
                  <div className="text-medium flex items-center font-medium">
                    <p>{"("}剩餘</p>
                    <span className="ml-1 underline">
                      &emsp;{superCoins}&emsp;
                    </span>
                    <span className="ml-1">Super Coins{")"}</span>
                  </div>
                </div>
                <input
                  type="text"
                  id="taskReward"
                  placeholder="願支付多少 Coin 請人完成任務"
                  className="w-full rounded-md border bg-[#EFF7FF] p-3 font-semibold focus:bg-white focus:outline-none"
                  value={taskReward}
                  onChange={handleTaskRewardChange}
                />
              </div>
            </div>
            <div className="mb-">
              <div className="mb-4 flex">
                <span className="mr-2 h-8 w-2 bg-[#368dcf]"></span>
                <p className="mr-3 text-2xl font-semibold">上傳照片</p>
                <p className="text-medium flex flex-col justify-end font-semibold text-red-600">
                  圖片大小不超過 5MB
                </p>
              </div>
              <ul className="mb-8 flex items-center justify-between">
                {uploadedImages.map((image, index) => (
                  <li
                    key={index}
                    className="relative m-2 flex h-64 w-64 border-2 border-dashed border-[#368dcf]"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
                    />
                    {!image && (
                      <span className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transform text-center font-medium text-[#368dcf]">
                        選擇圖片檔案
                      </span>
                    )}
                    {image && (
                      <img
                        src={image}
                        alt={`Uploaded ${index}`}
                        className="h-full w-full object-cover object-center"
                      />
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={confirmSubmitTask}
                  className="rounded-md bg-[#368DCF] p-4 text-2xl font-medium tracking-wider text-white transition duration-500 ease-in-out hover:bg-[#3178C6]"
                >
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
                      {/* 載入指示器，例如旋轉的圖標 */}
                      <Icon
                        icon="eos-icons:loading"
                        className="animate-spin text-4xl text-blue-500"
                      />
                    </div>
                  ) : (
                    "刊登任務"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default Task;
