import { Icon } from "@iconify/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/AuthProvider";
import TaskButton from "../Task/TaskButton";

const Home = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/SignIn");
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

  return (
    <>
      <div className="container mx-auto px-4 md:max-w-7xl">
        <div className="mt-10 flex items-center justify-between">
          <div className="bg-gradient-to-l from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Home
          </div>
          <div className="flex items-center">
            {currentUser ? (
              <>
                <div className="group relative">
                  <Icon
                    className="cursor-pointer"
                    icon="mingcute:user-4-fill"
                    color="rgba(0, 0, 255, 0.3333333333333333)"
                    width="40"
                    height="40"
                    onClick={handleSignIn}
                  />
                  <div className="absolute z-10 hidden flex-col space-y-2 rounded bg-white p-4 opacity-0 group-hover:flex group-hover:opacity-100">
                    <button
                      type="button"
                      className="w-36 rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                      會員中心
                    </button>
                    <button
                      type="button"
                      onClick={handleTaskManagement}
                      className="w-36 rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                      任務管理
                    </button>
                    <button
                      onClick={handleToReviews}
                      type="button"
                      className="w-36 rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                      我的評價
                    </button>
                  </div>
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
              </>
            ) : (
              // 如果用戶未登入，顯示登入按鈕
              <div title="註冊 | 登入">
                <Icon
                  className="cursor-pointer"
                  icon="mingcute:user-4-fill"
                  color="rgba(0, 0, 255, 0.3333333333333333)"
                  width="40"
                  height="40"
                  onClick={handleSignIn}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <TaskButton />
    </>
  );
};

export default Home;
