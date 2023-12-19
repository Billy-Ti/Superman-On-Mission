import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import TransitionPage from "./components/animate/TransitionPage.tsx";
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
// import FadePage from "./components/animate/FadePage.tsx";
// import ScaleTransition from "./components/animate/ScaleTransition.tsx";
// import RotateTransition from "./components/animate/RotateTransition.tsx";
// import SlideTransition from "./components/animate/SlideTransition.tsx";
// import BounceTransition from "./components/animate/BounceTransition.tsx";
// import MultiTransition from "./components/animate/MultiTransition.tsx";

const App = () => {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <TransitionPage>
            <ScrollToTop />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Home />
                  </>
                }
              />
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
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ChatRoomButton />
          </TransitionPage>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};

export default App;
