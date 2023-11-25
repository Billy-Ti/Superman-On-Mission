import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./hooks/AuthProvider.tsx";
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
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignIn" element={<SignIn />} />
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
