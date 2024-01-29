import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import SignIn from "./components/SignIn.tsx";
import TransitionPage from "./components/TransitionPage.tsx";
import ChatRoomButton from "./components/chatRoom/ChatRoomButton.tsx";
import { AuthProvider } from "./hooks/AuthProvider.tsx";
import Profile from "./pages/Admin/Profile.tsx";
import Home from "./pages/Home/index.tsx";
import ReviewLists from "./pages/Review/index.tsx";
import AcceptTask from "./pages/Task/AcceptTask.tsx";
import AcceptTaskDetail from "./pages/Task/AcceptTaskDetail.tsx";
import StartTaskDetail from "./pages/Task/StartTaskDetail.tsx";
import TaskDetail from "./pages/Task/TaskDetail.tsx";
import TaskManagement from "./pages/Task/TaskManagement.tsx";
import Task from "./pages/Task/index.tsx";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TransitionPage>
          <ScrollToTop />
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
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </TransitionPage>
      </BrowserRouter>
      <ChatRoomButton />
    </AuthProvider>
  );
};

export default App;
