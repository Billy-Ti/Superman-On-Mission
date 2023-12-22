import { Icon } from "@iconify/react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../../config/firebase";
import { showAlert } from "../../utils/showAlert";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import SideBar from "./SideBar";
const Profile = () => {
  const [profilePic, setProfilePic] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  );
  const [userName, setUserName] = useState("");
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [superCoins, setSuperCoins] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const storage = getStorage();
  const accordionItems = [
    {
      title: "個人資訊",
      content: [
        {
          "使用者名稱 ": userName,
          "E-mail ": userEmail,
          "加入平台時間 ": joinedAt,
        },
      ],
    },
    {
      title: "帳戶資訊",
      content: [
        {
          "擁有的 Super Coins ": superCoins,
          "信用卡綁定 ": "未綁定",
        },
      ],
    },
    {
      title: "案件資訊",
      content: [
        {
          "平均星等 ": averageRating,
        },
      ],
    },
  ];
  const toggleAccordion = (index: number) => {
    setOpenAccordions((currentOpenAccordions) => {
      if (currentOpenAccordions.includes(index)) {
        return currentOpenAccordions.filter((itemIndex) => itemIndex !== index);
      } else {
        return [...currentOpenAccordions, index];
      }
    });
  };
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setProfilePic(
            userData.profilePicUrl ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          );
          setUserName(userData.name);
          setUserEmail(userData.email);
          setJoinedAt(userData.joinedAt);
          setSuperCoins(userData.superCoins);
          setAverageRating(userData.averageRating);
        }
      }
    };
    fetchUserData();
  }, [auth]);
  useEffect(() => {
    if (!auth.currentUser) {
      Swal.fire({
        title: "🚨系統提醒",
        text: "您需要登入才能使用",
        icon: "warning",
        confirmButtonText: "確定",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signIn");
        }
      });
    }
  }, [auth, navigate]);
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    const validFormats = ["image/png", "image/jpg", "image/jpeg"];
    const maxAllowedSize = 5 * 1024 * 1024;
    if (!file || !auth.currentUser) return;
    if (!validFormats.includes(file.type)) {
      showAlert("錯誤", "只能上傳圖片格式（.png / .jpg / .jpeg）", "error");
      return;
    }
    if (file.size > maxAllowedSize) {
      showAlert("錯誤", "圖片大小不能超過 5 MB", "error");
      return;
    }
    const localImageUrl = URL.createObjectURL(file);
    setProfilePic(localImageUrl);
    setIsLoading(true);
    const fileRef = storageRef(
      storage,
      `profilePics/${auth.currentUser.uid}/${file.name}`,
    );
    await uploadBytes(fileRef, file);
    const newProfilePicUrl = await getDownloadURL(fileRef);
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      profilePicUrl: newProfilePicUrl,
    });
    setProfilePic(newProfilePicUrl);
    setIsLoading(false);
  };

  return (
    <>
      <div className="md:hidden">
        <Header />
      </div>
      <div className="flex flex-col md:min-h-screen">
        <SideBar />
        <div className="container mx-auto max-w-[1280px] px-4 pt-40 md:py-0 lg:px-20">
          <div className="relative rounded-lg bg-white shadow sm:mx-auto md:ml-56 md:mt-40 md:max-w-full lg:mx-auto lg:w-1/2">
            <div className="flex justify-center">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
                  <Icon
                    icon="eos-icons:loading"
                    className="animate-spin text-4xl text-blue-200"
                  />
                </div>
              )}
              <img
                src={profilePic}
                alt="Profile"
                className="absolute -top-20 mx-auto h-32 w-32 transform rounded-full border-4 border-white object-cover shadow-md transition duration-200 hover:scale-125"
              />
            </div>
            <div className="mt-16">
              <h2 className="text-center text-3xl font-bold text-gray-900">
                {userName}
              </h2>
              <div className="my-5 px-6">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="block w-full cursor-pointer rounded-md bg-gray-600 p-3 text-center text-lg font-medium tracking-wider text-white transition duration-500 ease-in-out hover:bg-gray-800"
                >
                  修改會員照
                </label>
              </div>
              <div className="w-full shadow-xl">
                <div className="mt-5 flex w-full flex-col items-center overflow-hidden text-sm">
                  <ul className="accordion w-full rounded-lg bg-gray-50 px-6 shadow-lg shadow-gray-100">
                    {accordionItems.map((item, index) => (
                      <li key={index} className="my-10 cursor-pointer">
                        <span
                          onClick={() => toggleAccordion(index)}
                          className="flex flex-row items-center justify-between bg-[#368DCF] text-xl font-medium tracking-tight text-gray-500 transition duration-500 ease-in-out hover:bg-[#2b79b4]"
                        >
                          <p className="p-2 text-white">{item.title}</p>
                          <Icon
                            color="#fff"
                            icon={
                              openAccordions.includes(index)
                                ? "eva:arrow-up-fill"
                                : "eva:arrow-down-fill"
                            }
                            className={`transform transition duration-500 ${
                              openAccordions.includes(index)
                                ? "rotate-180"
                                : "rotate-0"
                            }`}
                          />
                        </span>
                        {openAccordions.includes(index) && (
                          <div className="max-h-96 overflow-hidden transition-[max-height] duration-500 ease-in-out">
                            <ul className="text-md p-2 text-gray-500">
                              {item.content.map((contentItem, contentIndex) => (
                                <li
                                  className="text-lg font-medium "
                                  key={contentIndex}
                                >
                                  {Object.entries(contentItem).map(
                                    ([key, value]) => (
                                      <p className="" key={key}>
                                        {key}: {value}
                                      </p>
                                    ),
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <Footer />
      </div>
    </>
  );
};
export default Profile;
