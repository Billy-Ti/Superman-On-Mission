import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPageAnimation from "./components/LandingPageAnimation.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ChatRoomButton from "./components/chatRoom/ChatRoomButton.tsx";
import { AuthProvider } from "./hooks/AuthProvider.tsx";
import Profile from "./pages/Admin/Profile.tsx";
import Admin from "./pages/Admin/index.tsx";
import Home from "./pages/Home/index.tsx";
import ReviewLists from "./pages/Review/index.tsx";
import AcceptTask from "./pages/Task/AcceptTask.tsx";
import AcceptTaskDetail from "./pages/Task/AcceptTaskDetail.tsx";
import StartTaskDetail from "./pages/Task/StartTaskDetail.tsx";
import TaskDetail from "./pages/Task/TaskDetail.tsx";
import TaskManagement from "./pages/Task/TaskManagement.tsx";
import Task from "./pages/Task/index.tsx";
import SignIn from "./pages/components/SignIn.tsx";

const App = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          {showAnimation && (
            <LandingPageAnimation gif="/landing-unscreen.gif" duration={3000} />
          )}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route
              path="/taskPage"
              element={
                <ProtectedRoute>
                  <Task />
                </ProtectedRoute>
              }
            />
            <Route
              path="/taskManagement"
              element={
                <ProtectedRoute>
                  <TaskManagement />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/detail/:taskId" element={<StartTaskDetail />} />
            <Route path="/acceptDetail/:taskId" element={<TaskDetail />} />
            <Route path="/detail" element={<Navigate to="/" />} />
            <Route path="/acceptTask" element={<AcceptTask />} />
            <Route
              path="/acceptTaskDetail/:taskId"
              element={<AcceptTaskDetail />}
            />
            <Route path="/reviewLists" element={<ReviewLists />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <ChatRoomButton />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};

export default App;
