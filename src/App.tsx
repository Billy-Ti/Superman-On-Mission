import { BrowserRouter, Route, Routes } from "react-router-dom";
import Task from "./pages/Home/Task.tsx";
import Home from "./pages/Home/index.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/taskPage" element={<Task />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
