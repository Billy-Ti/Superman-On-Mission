import { Icon } from "@iconify/react";
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
    navigate("/TaskManagement");
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="mt-10 flex items-center justify-between">
          <p className="text-center text-xl">Home</p>
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
                      type="button"
                      className="w-36 rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                      我的評價
                    </button>
                  </div>
                </div>
                <div title="登出">
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
