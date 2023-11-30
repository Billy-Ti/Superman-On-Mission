import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AcceptTaskRecord from "./AcceptTaskRecord";
import StartTaskRecord from "./StartTaskRecord";

const TaskManagement = () => {
  const [activeButton, setActiveButton] = useState("");

  const navigate = useNavigate();

  const backToHome = () => {
    navigate("/");
  };

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <div className="container mx-auto px-4 md:max-w-7xl">
      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center pb-3">
          <h3 className="text-4xl font-bold">任務管理 {`>>`} 任務列表</h3>
          {activeButton === "post" && (
            <p className="pt-2 text-xl font-bold"> {` >> 發案紀錄 >>`}</p>
          )}
          {activeButton === "accept" && (
            <p className="pt-2 text-xl font-bold"> {` >> 接案紀錄 >>`}</p>
          )}

          <p
            onClick={backToHome}
            className={`cursor-pointer pt-2 text-lg font-bold ${
              activeButton !== "post" && activeButton !== "accept" && "ml-3"
            }`}
          >
            回首頁
          </p>
        </div>

        <div className="flex">
          <button
            className={`w-36 border text-center text-2xl font-medium transition-all ${
              activeButton === "post" ? "bg-gray-300" : "hover:bg-gray-300"
            }`}
            type="button"
            onClick={() => handleButtonClick("post")}
          >
            發案紀錄
          </button>
          <button
            className={`w-36 border text-center text-2xl font-medium transition-all ${
              activeButton === "accept" ? "bg-gray-300" : "hover:bg-gray-300"
            }`}
            type="button"
            onClick={() => handleButtonClick("accept")}
          >
            接案紀錄
          </button>
        </div>
      </div>

      {activeButton !== "post" && activeButton !== "accept" && (
        <div className="flex h-64 items-center justify-center">
          <div className="w-3/4 rounded-md border border-gray-300 bg-white p-6 text-center shadow-lg">
            <p className="mb-3 text-2xl font-semibold text-gray-700">
              列表說明 :
            </p>
            <ul className="px-6 text-xl font-semibold text-gray-700">
              <li>提供直觀易用的介面，讓您快速找到需要的資訊</li>
              <li>可以幫助您追蹤和管理您曾經發過的案子紀錄或接案子的紀錄</li>
              <li>可以讓您輕鬆地查詢和管理您的任務</li>
            </ul>
          </div>
        </div>
      )}

      {activeButton === "post" && <StartTaskRecord />}
      {activeButton === "accept" && <AcceptTaskRecord />}
    </div>
  );
};

export default TaskManagement;
