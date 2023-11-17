import { BrowserRouter, Route, Routes } from "react-router-dom";
import Task from "./pages/Home/Task.tsx";
import Home from "./pages/Home/index.tsx";
import SignIn from "./pages/components/SignIn.tsx";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/taskPage" element={<Task />} />
        <Route path="/SignIn" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
