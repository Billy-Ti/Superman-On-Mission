import { Icon } from "@iconify/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../../config/firebase";
import { useAuth } from "../../hooks/AuthProvider";
import Marquee from "../animate/Marquee";

interface Notification {
  acceptorName: string;
  taskName: string;
  id: string; // 通知的 ID
}

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [content, setContent] = useState(
    <h2 className="text-medium bg-inherit p-2 font-semibold text-[#368dcf] md:text-xl">
      老闆抱負叫人讚，卻讓您心頭發冷颤，上 Super Task co.
      <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text font-black text-transparent">
        ，註冊享 5000 coins 折抵
      </span>
      ，讓您有如神助，外包不必自己擔，Task co. 團隊，助您無所難，人生道路不孤單
    </h2>,
  );

  const navigate = useNavigate();
  const handleSignIn = () => {
    navigate("/signIn");
  };
  const handleToAdmin = () => {
    navigate("/profile");
  };
  const handleToReviews = () => {
    navigate("/reviewLists");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = async () => {
    Swal.fire({
      title: "確定要登出嗎？",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await logout();
          Swal.fire({
            title: "已登出",
            icon: "success",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
          });
          navigate("/");
        } catch (error) {
          console.error("登出錯誤", error);
        }
      }
    });
  };
  const handleTaskManagement = () => {
    navigate("/taskManagement");
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await deleteDoc(notificationRef);
      console.log("通知已刪除");
    } catch (error) {
      console.error("刪除通知時出錯", error);
    }
  };

  const handleShowNotifications = async () => {
    // 檢查是否有未讀通知
    if (notifications.length === 0) {
      // 沒有未讀通知，顯示無新通知的提示
      Swal.fire("無新通知", "", "info");
      return;
    }

    const notificationMessages = notifications
      .map(
        (notification, index) =>
          `<div key=${index}><h3> ${notification.acceptorName} 接了您的 </h3> "${notification.taskName} 任務"</div>`,
      )
      .join("");

    await Swal.fire({
      title: "您有新的通知",
      html: notificationMessages,
      icon: "info",
      confirmButtonText: "確定",
    });

    // 標記通知為已讀
    await markNotificationsRead();
    notifications.forEach(async (notification) => {
      await deleteNotification(notification.id);
    });

    // 清空通知陣列
    setNotifications([]);
  };

  const markNotificationsRead = async () => {
    if (!currentUser) {
      console.log("沒有用戶登錄");
      return;
    }
    // 更新數據庫中的通知狀態
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("createdBy", "==", currentUser.uid),
      where("read", "==", false),
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnapshot) => {
      const notificationRef = doc(db, "notifications", docSnapshot.id);
      await updateDoc(notificationRef, { read: true });
    });

    // 重設未讀通知計數
    setNotificationCount(0);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 992) {
      setContent(
        <h2 className="text-medium bg-inherit p-2 font-semibold text-[#368dcf] md:text-xl">
          老闆抱負叫人讚，卻讓您心頭發冷颤，上 Super Task co.
          <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text font-black text-transparent">
            ，<Link to="/signIn">，註冊享 5000 coins 折抵</Link>
          </span>
          ，助您無所難、不孤單
        </h2>,
      );
    } else {
      setContent(
        <h2 className="text-medium bg-inherit p-2 font-semibold text-[#368dcf] md:text-xl">
          老闆抱負叫人讚，卻讓您心頭發冷颤，上 Super Task co.
          <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text font-black text-transparent">
            ，<Link to="/signIn">，註冊享 5000 coins 折抵</Link>
          </span>
          ，讓您有如神助，外包不必自己擔，Task co.
          團隊，助您無所難，人生道路不孤單
        </h2>,
      );
    }
  }, [windowWidth]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;

      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("createdBy", "==", currentUser.uid),
      );
      const querySnapshot = await getDocs(q);
      const fetchedNotifications = [];

      for (const notificationDoc of querySnapshot.docs) {
        const notificationData = notificationDoc.data();
        const taskSnap = await getDoc(
          doc(db, "tasks", notificationData.taskId),
        );

        if (taskSnap.exists()) {
          const acceptorId = taskSnap.data().acceptedBy;
          const acceptorSnap = await getDoc(doc(db, "users", acceptorId));

          if (acceptorSnap.exists()) {
            fetchedNotifications.push({
              id: notificationDoc.id, // 保存通知的 ID
              acceptorName: acceptorSnap.data().name, // 假設接案者的名稱存儲在 'name' 字段
              taskName: taskSnap.data().title, // 假設任務的名稱存儲在 'title' 字段
            });
          }
        }
      }
      setNotifications(fetchedNotifications);
    };

    fetchNotifications();
  }, [currentUser]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("createdBy", "==", currentUser.uid),
        where("read", "==", false),
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        // 設置未讀通知數量
        setNotificationCount(snapshot.docs.length);
      });

      return () => unsubscribe(); // 清理監聽器
    }
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 用戶已登錄，輸出用戶郵件和 ID
        console.log("當前用戶 email:", user.email);
        console.log("當前用戶 ID:", user.uid);
      } else {
        // 用戶未登錄
        console.log("沒有用戶登錄");
      }
    });
    // 清理監聽器
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 檢查 event.target 是否為 Node 類型
      if (event.target instanceof Node) {
        if (
          isDropdownOpen &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsDropdownOpen(false);
        }
      }
    };

    // 添加全局點擊事件監聽器
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // 清理監聽器
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const db = getFirestore();
      const q = query(
        collection(db, "users"),
        where("userId", "==", currentUser.uid),
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          if (querySnapshot.empty) {
            // console.log("未找到匹配的用戶數據");
            return;
          }

          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            // console.log("用戶數據:", userData);
            if (userData.profilePicUrl) {
              // console.log("設置 profilePicUrl:", userData.profilePicUrl);
              setProfilePicUrl(userData.profilePicUrl);
            }
          });
        },
        (error) => {
          console.error("查詢錯誤:", error);
        },
      );

      return () => unsubscribe();
    }
  }, [currentUser]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <header
        className={`sticky top-0 z-10 w-full ${
          isScrolled
            ? "border-b border-blue-100 shadow-xl shadow-neutral-100 backdrop-blur-xl"
            : ""
        } transition-all duration-300`}
      >
        <Marquee content={content} />
        <div className="container relative mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:py-0 lg:px-20">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-xl font-black text-[#2b79b4] sm:text-3xl"
            >
              <img
                className="hidden sm:block"
                width="70"
                src="/superman_logo.png"
                alt="superman-logo"
              />
              <p className="mr-1 italic">SuperTask co.</p>
              <span className="hidden lg:block">|</span>
            </Link>
            <p className="text-gray hidden pl-2 pt-2 text-lg font-medium xl:block">
              只有不想發的案，沒有做不到的事
            </p>
          </div>
          <div className="flex items-center">
            <div
              className={`${isMenuOpen ? "hidden" : "block"} hidden md:block`}
            >
              <ul className="ml-auto flex items-center text-xl md:mr-4 md:gap-4">
                <li className="relative font-semibold tracking-widest after:absolute after:bottom-0 after:left-0 after:h-[8px] after:w-full after:translate-y-1 after:bg-[#368dcf] after:opacity-0 after:transition after:duration-200 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-50">
                  <Link to="/acceptTask">接任務</Link>
                </li>
                <li className="font-semibold">|</li>
                <li className="relative font-semibold tracking-widest after:absolute after:bottom-0 after:left-0 after:h-[8px] after:w-full after:translate-y-1 after:bg-[#368dcf] after:opacity-0 after:transition after:duration-200 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-50">
                  <Link to="/taskPage">發任務</Link>
                </li>
              </ul>
            </div>
            {currentUser ? (
              <div className="group relative flex items-center">
                {profilePicUrl ? (
                  <>
                    <img
                      src={profilePicUrl}
                      alt="User Profile"
                      className="mr-2 h-[40px] w-[40px] cursor-pointer rounded-full border-2 border-blue-200 object-cover"
                      onClick={toggleDropdown}
                    />
                    <button
                      onClick={handleShowNotifications}
                      className="relative"
                    >
                      <Icon
                        icon="iconamoon:notification-fill"
                        color="#368dcf"
                        width="30"
                        height="30"
                      />
                      {notifications.length > 0 && (
                        <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          {notificationCount}
                        </span>
                      )}
                    </button>
                  </>
                ) : (
                  <Icon
                    className="cursor-pointer"
                    icon="mingcute:user-4-fill"
                    color="#3178C6"
                    width="40"
                    height="40"
                    onClick={toggleDropdown}
                  />
                )}
                {/* Header 點擊頭像之後的選單 */}
                <div
                  ref={dropdownRef}
                  className={`absolute -right-[-16px] top-[50px] z-10 flex-col space-y-2 rounded-md border border-[#B3D7FF] bg-blue-100 transition-opacity duration-300 ease-in-out ${
                    isDropdownOpen ? "flex opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <button
                    onClick={handleToAdmin}
                    type="button"
                    className="w-36 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#368DCF] hover:text-white"
                  >
                    {currentUser ? "會員中心" : "Login"}
                  </button>
                  <button
                    type="button"
                    onClick={handleTaskManagement}
                    className="w-36 rounded-md  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#368DCF] hover:text-white"
                  >
                    任務管理
                  </button>
                  <button
                    onClick={handleToReviews}
                    type="button"
                    className="w-36 rounded-md  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#368DCF] hover:text-white"
                  >
                    我的評價
                  </button>
                </div>
                <div className="ml-3 mr-3 hidden items-center lg:mr-0 lg:flex">
                  <img
                    color="#3178C6"
                    onClick={handleLogout}
                    className="h-auto w-[16px] min-w-[16px] cursor-pointer sm:h-auto sm:w-[20px]"
                    src="/logout.svg"
                    alt="logout"
                  />
                </div>

                <div className="ml-2 lg:hidden">
                  <button onClick={toggleMenu}>
                    <Icon
                      icon="heroicons:bars-3-bottom-right-solid"
                      color="#2B79B4"
                      width="30"
                      height="30"
                    />
                  </button>
                </div>
              </div>
            ) : (
              <div title="註冊 | 登入">
                <Link to="/signIn" className="flex items-center">
                  <Icon
                    className="mr-1 cursor-pointer"
                    icon="mingcute:user-4-fill"
                    color="#3178C6"
                    width="40"
                    height="40"
                    onClick={handleSignIn}
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
        <div
          className={`absolute left-0 top-0 z-[100] w-full bg-[#B3D7FF] transition-transform duration-300 ease-in-out lg:hidden ${
            isMenuOpen ? "translate-y-[106px]" : "-translate-y-full"
          }`}
        >
          {/* 漢堡選單內容 */}
          <ul className="flex flex-col items-center divide-y-2 shadow-lg">
            <li>
              <img
                className="w-24"
                src="/superman_logo.png"
                alt="superman-logo"
              />
            </li>
            <li className="w-full ">
              <button
                onClick={handleSignIn}
                type="button"
                className="w-full rounded-md p-5 text-lg font-bold text-[#3178C6] hover:bg-[#368DCF] hover:text-white"
              >
                {currentUser ? "會員中心" : "Login"}
              </button>
            </li>
            <li className="w-full">
              <button
                type="button"
                onClick={handleTaskManagement}
                className="w-full rounded-md p-5 text-lg font-bold text-[#3178C6] hover:bg-[#368DCF] hover:text-white"
              >
                任務管理
              </button>
            </li>
            <li className="w-full">
              <button
                onClick={handleToReviews}
                type="button"
                className="w-full rounded-md p-5 text-lg font-bold text-[#3178C6] hover:bg-[#368DCF] hover:text-white"
              >
                我的評價
              </button>
            </li>
            <li className="w-full text-center">
              <Link
                to="/acceptTask"
                className="block w-full p-5 text-lg font-bold text-[#3178C6] hover:bg-[#368DCF] hover:text-white"
                onClick={toggleMenu}
              >
                接任務
              </Link>
            </li>
            <li className="w-full text-center">
              <Link
                to="/taskPage"
                className="block w-full p-5 text-lg font-bold text-[#3178C6] hover:bg-[#368DCF] hover:text-white"
                onClick={toggleMenu}
              >
                發任務
              </Link>
            </li>
            <li className="w-full text-center">
              <button
                type="button"
                className="block w-full p-5 text-lg font-bold text-[#3178C6] hover:bg-[#368DCF] hover:text-white"
                onClick={handleLogout}
              >
                登出
              </button>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};
export default Header;
