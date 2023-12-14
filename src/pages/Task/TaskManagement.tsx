import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import AcceptTaskRecord from "./AcceptTaskRecord";
import FinishTaskRecord from "./FinishTaskRecord";
import StartTaskRecord from "./StartTaskRecord";

const TaskManagement = () => {
  const [activeButton, setActiveButton] = useState("post");
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto w-full max-w-[1280px] px-4 pb-4 pt-10 md:px-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 sm:h-10 sm:w-10"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="-2 -2 24 24"
            >
              <path
                fill="currentColor"
                d="M6 0h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zm6 9a1 1 0 0 0 0 2h3a1 1 0 1 0 0-2h-3zm-2 4a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2h-5zm0-8a1 1 0 1 0 0 2h5a1 1 0 0 0 0-2h-5zm-4.172 5.243l-.707-.707a1 1 0 1 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.415 0l2.828-2.828A1 1 0 0 0 7.95 8.12l-2.122 2.122z"
              />
            </svg>
            <span className="px-4 py-3 text-2xl font-bold">任務管理</span>
          </div>
          <p className="relative font-semibold tracking-widest after:absolute after:bottom-0 after:left-0 after:h-[5px] after:w-full after:translate-y-1 after:bg-[#368dcf] after:opacity-0 after:transition after:duration-200 after:ease-in-out hover:after:translate-y-0 hover:after:opacity-100">
            <Link to="/profile">回會員中心</Link>
          </p>
        </div>
        <div className="mt-10 flex items-center justify-between">
          <div className="flex">
            <button
              className={`w-36 rounded-md text-center text-2xl font-medium text-[#3178C6] transition-all hover:bg-[#3178C6] hover:text-white ${
                activeButton === "post" ? "bg-[#3178C6] text-white" : ""
              }`}
              type="button"
              onClick={() => handleButtonClick("post")}
            >
              發案紀錄
            </button>
            <button
              className={`w-36 rounded-md text-center text-2xl font-medium text-[#3178C6] transition-all hover:bg-[#3178C6] hover:text-white ${
                activeButton === "accept" ? "bg-[#3178C6] text-white" : ""
              }`}
              type="button"
              onClick={() => handleButtonClick("accept")}
            >
              接案紀錄
            </button>
            <button
              className={`w-36 rounded-md text-center text-2xl font-medium text-[#3178C6] transition-all hover:bg-[#3178C6] hover:text-white ${
                activeButton === "completed" ? "bg-[#3178C6] text-white" : ""
              }`}
              type="button"
              onClick={() => handleButtonClick("completed")}
            >
              已完成
            </button>
          </div>
        </div>
        {activeButton === "post" && <StartTaskRecord />}
        {activeButton === "accept" && <AcceptTaskRecord />}
        {activeButton === "completed" && <FinishTaskRecord />}
      </div>
      <Footer />
    </>
  );
};

export default TaskManagement;
