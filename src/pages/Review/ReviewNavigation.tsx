import { Link } from "react-router-dom";

const ReviewNavigation = () => {
  return (
    <div className="flex justify-center bg-[#92afd6] px-2 py-2 sm:rounded-xl lg:flex-col lg:justify-start lg:px-4">
      <nav className="flex flex-row  items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
        <Link
          to="/"
          className="smooth-hover inline-flex justify-center rounded-md p-4 text-white/50 hover:bg-gray-800 hover:text-white"
          title="首頁"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </Link>
        <Link
          title="會員中心 | 我的帳戶"
          to="/profile"
          className="inline-flex justify-center rounded-md p-4 text-white hover:bg-gray-800"
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
        </Link>
        <Link
          title="任務管理"
          to="/taskManagement"
          className="smooth-hover inline-flex justify-center rounded-md p-4 text-white/50 hover:bg-gray-800 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m10.95 18l5.65-5.65l-1.45-1.45l-4.225 4.225l-2.1-2.1L7.4 14.45zM4 22V2h10l6 6v14zm9-13h5l-5-5z"
            />
          </svg>
        </Link>
      </nav>
    </div>
  );
};

export default ReviewNavigation;
