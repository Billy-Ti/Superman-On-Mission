import { Icon } from "@iconify/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/AuthProvider";
// import SearchBar from "./SearchBar";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");

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
          console.log("您已成功登出");
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
        <div className="container relative mx-auto flex max-w-[1280px] items-center justify-between px-4 lg:px-20">
          <Link
            to="/"
            className="flex items-center text-3xl font-black text-[#2b79b4]"
          >
            <img width="70" src="/superman_logo.png" alt="superman-logo" />
            <p className="mr-1 italic">SuperTask co.</p>
            <span className="hidden lg:block">|</span>
          </Link>
          <p className="text-gray hidden pl-2 pt-2 text-lg font-medium xl:block">
            只有不想發的案，沒有做不到的事
          </p>
          {/* <SearchBar onSearch={handleSearch} placeholder="快速搜尋任務" /> */}
          <div className={`${isMenuOpen ? "hidden" : "block"} hidden lg:block`}>
            <ul className="ml-auto flex items-center text-xl md:mr-4 md:gap-4">
              <li className="relative font-semibold tracking-widest after:absolute after:bottom-0 after:left-0 after:h-[5px] after:w-full after:translate-y-1 after:bg-[#368dcf] after:opacity-0 after:transition after:duration-200 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-100">
                <Link to="/acceptTask">接任務</Link>
              </li>
              <li className="font-semibold">|</li>
              <li className="relative font-semibold tracking-widest after:absolute after:bottom-0 after:left-0 after:h-[5px] after:w-full after:translate-y-1 after:bg-[#368dcf] after:opacity-0 after:transition after:duration-200 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-100">
                <Link to="/taskPage">發任務</Link>
              </li>
            </ul>
          </div>
          {currentUser ? (
            <div className="group relative flex items-center">
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt="User Profile"
                  className="h-[40px] w-[40px] cursor-pointer rounded-full border-2 border-blue-200 object-cover"
                  onClick={toggleDropdown}
                />
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
                className={`absolute -right-[0px] top-[50px] z-10 flex-col space-y-2 rounded-md border border-[#B3D7FF] bg-blue-100 transition-opacity duration-300 ease-in-out ${
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
              <div className="ml-3 mr-3 lg:mr-0" title="登出">
                <img
                  color="#3178C6"
                  onClick={handleLogout}
                  className="w-[16px] cursor-pointer"
                  src="/logout.svg"
                  alt="logout"
                />
              </div>
              <div className="lg:hidden">
                <button onClick={toggleMenu}>
                  <Icon icon="mdi:menu" width="40" height="40" />
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
        <div
          className={`absolute left-0 top-0 z-20 w-full bg-[#B3D7FF] transition-transform duration-300 ease-in-out lg:hidden ${
            isMenuOpen ? "translate-y-[70px]" : "-translate-y-full"
          }`}
        >
          {/* 漢堡選單內容 */}
          <ul className="flex flex-col items-center">
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
          </ul>
        </div>
      </header>
    </>
  );
};
export default Header;
