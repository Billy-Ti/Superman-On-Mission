import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./hooks/AuthProvider.tsx";
import Home from "./pages/Home/index.tsx";
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
