import { useState } from "react";
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
          <span className="p-2 text-3xl font-bold">任務管理</span>
        </div>
        <div className="mt-10 flex items-center justify-between">
          <button
            className={`w-36 rounded-md bg-[#368DCF] px-4 py-2 text-lg font-medium transition duration-500 ease-in-out hover:bg-[#2b79b4] hover:text-white ${
              activeButton === "post"
                ? "bg-[#3178C6] text-white"
                : " bg-white text-gray-700 "
            }`}
            type="button"
            onClick={() => handleButtonClick("post")}
          >
            發案紀錄
          </button>
          <button
            className={`w-36 rounded-md bg-[#368DCF] px-4 py-2 text-lg font-medium transition duration-500 ease-in-out hover:bg-[#2b79b4] hover:text-white ${
              activeButton === "accept"
                ? "bg-[#3178C6] text-white"
                : "bg-white text-gray-700 "
            }`}
            type="button"
            onClick={() => handleButtonClick("accept")}
          >
            接案紀錄
          </button>
          <button
            className={`w-36 rounded-md bg-[#368DCF] px-4 py-2 text-lg font-medium transition duration-500 ease-in-out hover:bg-[#2b79b4] hover:text-white ${
              activeButton === "completed"
                ? "bg-[#3178C6] text-white"
                : "bg-white text-gray-700 "
            }`}
            type="button"
            onClick={() => handleButtonClick("completed")}
          >
            已完成
          </button>
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
