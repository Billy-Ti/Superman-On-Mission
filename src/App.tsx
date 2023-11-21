import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./hooks/AuthProvider.tsx";
import Home from "./pages/Home/index.tsx";
import AcceptTaskDetail from "./pages/Task/AcceptTaskDetail.tsx";
import AcceptTask from "./pages/Task/AcceptTask.tsx";
import StartTaskDetail from "./pages/Task/StartTaskDetail.tsx";
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
            path="/TaskManagement"
            element={
              <ProtectedRoute>
                <TaskManagement />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/detail/:taskId" element={<StartTaskDetail />} />
          <Route path="/acceptDetail/:taskId" element={<AcceptTaskDetail />} />
          <Route path="/detail" element={<Navigate to="/" />} />
          <Route path="/acceptTask" element={<AcceptTask />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
