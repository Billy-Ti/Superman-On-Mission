import { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [activeLink, setActiveLink] = useState<string>("");

  const handleSetActiveLink = (link: string) => {
    setActiveLink(link);
  };
  return (
    <div className="fixed h-screen border-none bg-[#B3D7FF] md:block">
      {/* Items */}
      <div className="fixed bottom-0 left-0 flex h-16 w-full items-center justify-around border-none bg-[#B3D7FF] md:relative md:h-screen md:flex-col md:justify-start  md:gap-10 lg:space-y-0">
        <Link
          to="/"
          className="hidden items-center justify-center bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text text-2xl  font-black text-transparent md:flex"
        >
          <p className="pl-4 pr-1 pt-3 italic">SuperTask co.</p>
        </Link>
        {/* Inicio */}
        <Link
          to="/profile"
          className={`relative flex w-full items-center justify-center rounded-md px-4 py-3 text-lg transition duration-300 ease-in-out md:space-x-1 ${
            activeLink === "/profile"
              ? "bg-[#3178C6] text-white"
              : "text-[#3178C6] hover:bg-[#3178C6] hover:text-white"
          }`}
          onClick={() => handleSetActiveLink("/profile")}
        >
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"
            />
          </svg>
          <span className="hidden font-bold sm:block">我的帳戶</span>
          <span className="block font-bold sm:hidden">帳戶</span>
        </Link>
        <Link
          to="/taskManagement"
          className={`relative flex w-full items-center justify-center rounded-md px-4 py-3 text-lg text-[#3178C6] transition duration-300 ease-in-out hover:bg-[#3178C6] hover:text-white md:space-x-1 ${
            activeLink === "/taskManagement" ? "bg-[#3178C6] text-white" : ""
          }`}
          onClick={() => handleSetActiveLink("/taskManagement")}
        >
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6"
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
          <span className="hidden font-bold sm:block">任務管理</span>
          <span className="block font-bold sm:hidden">任務</span>
        </Link>
        <Link
          to="/reviewLists"
          className="relative flex w-full items-center justify-center rounded-md px-4 py-3 text-lg text-[#3178C6] transition duration-300 ease-in-out hover:bg-[#3178C6] hover:text-white md:space-x-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="h-5 w-5 sm:h-6 sm:w-6"
          >
            <path
              fill="currentColor"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m8.587 8.236l2.598-5.232a.911.911 0 0 1 1.63 0l2.598 5.232l5.808.844a.902.902 0 0 1 .503 1.542l-4.202 4.07l.992 5.75c.127.738-.653 1.3-1.32.952L12 18.678l-5.195 2.716c-.666.349-1.446-.214-1.319-.953l.992-5.75l-4.202-4.07a.902.902 0 0 1 .503-1.54l5.808-.845Z"
            />
          </svg>
          <span className="hidden font-bold sm:block">我的評價</span>
          <span className="block font-bold sm:hidden">評價</span>
        </Link>
        <Link
          to="/"
          className="relative flex w-full items-center justify-center rounded-md px-4 py-3 text-lg text-[#3178C6] transition duration-300 ease-in-out hover:bg-[#3178C6] hover:text-white md:space-x-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="hidden font-bold sm:block">回首頁</span>
          <span className="block font-bold sm:hidden">首頁</span>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
