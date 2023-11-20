import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      Swal.fire({
        title: "請先登入",
        text: "您需要登入才能訪問此頁面",
        icon: "info",
        confirmButtonText: "確定",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/SignIn");
        }
      });
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    // 在等待 SweetAlert 的回應時顯示空白或加載指示器
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
