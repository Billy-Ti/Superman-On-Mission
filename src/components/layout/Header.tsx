import { Icon } from "@iconify/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/AuthProvider";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/signIn");
  };

  const handleToReviews = () => {
    navigate("/reviewLists");
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
            title: "🚨系統提醒",
            text: "已登出成功",
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
        // 用戶已登錄，打印用戶郵件和 ID
        console.log("當前用戶郵件:", user.email);
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
  return (
    <>
      <header
        className={`sticky top-0 z-10 w-full ${
          isScrolled ? "border-b border-gray-100 backdrop-blur-sm" : ""
        } transition-all duration-300`}
      >
        <div className="container mx-auto flex max-w-[1280px] items-center md:px-20">
          <Link
            to="/"
            className="flex items-center bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text text-3xl font-black text-transparent"
          >
            <img width="70" src="/superman_2.png" alt="" />
            <p className="mr-1 italic">SuperTask co.</p>
            <span className="hidden lg:block">|</span>
          </Link>
          <p className="text-gray hidden pl-2 pt-2 text-lg font-black lg:block">
            只有不想發的案，沒有做不到的事
          </p>
          <ul className="ml-auto flex items-center text-lg md:mr-4 md:gap-4">
            <li className="relative after:absolute after:bottom-0 after:left-0 after:h-[5px] after:w-full after:translate-y-1 after:bg-[#6366f1] after:opacity-0 after:transition after:duration-200 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-100">
              <Link to="/acceptTask">接任務</Link>
            </li>
            <li>|</li>
            <li className="relative after:absolute after:bottom-0 after:left-0 after:h-[5px] after:w-full after:translate-y-1 after:bg-[#6366f1] after:opacity-0 after:transition after:duration-200 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-100">
              <Link to="/taskPage">發任務</Link>
            </li>
          </ul>

          {currentUser ? (
            <>
              <div className="group relative flex items-center">
                <Icon
                  className="cursor-pointer"
                  icon="mingcute:user-4-fill"
                  color="rgba(0, 0, 255, 0.3333333333333333)"
                  width="40"
                  height="40"
                />
                <div className="absolute top-[40px] z-10 hidden flex-col space-y-2 rounded-md bg-red-300 p-4 opacity-0 group-hover:flex group-hover:opacity-100">
                  <button
                    onClick={handleSignIn}
                    type="button"
                    className="w-36 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                  >
                    {currentUser ? "會員中心" : "Login"}
                  </button>
                  <button
                    type="button"
                    onClick={handleTaskManagement}
                    className="w-36 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                  >
                    任務管理
                  </button>
                  <button
                    onClick={handleToReviews}
                    type="button"
                    className="w-36 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                  >
                    我的評價
                  </button>
                </div>

                <div className="ml-3" title="登出">
                  <Icon
                    className="cursor-pointer"
                    icon="material-symbols:logout-sharp"
                    color="rgba(0, 0, 255, 0.3333333333333333)"
                    width="30"
                    height="30"
                    onClick={handleLogout}
                  />
                </div>
              </div>
            </>
          ) : (
            // 如果用戶未登入，顯示登入按鈕
            <div className="ml-auto" title="註冊 | 登入">
              <Link to="/signIn" className="flex items-center">
                <Icon
                  className="mr-1 cursor-pointer"
                  icon="mingcute:user-4-fill"
                  color="rgba(0, 0, 255, 0.3333333333333333)"
                  width="40"
                  height="40"
                  onClick={handleSignIn}
                />
                {currentUser ? "" : <p className="text-[#8591F0]">Login</p>}
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
