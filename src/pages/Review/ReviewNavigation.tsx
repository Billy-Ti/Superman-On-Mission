import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';

const ReviewNavigation = () => {
  return (
    <div className="flex justify-between bg-[#b1cce7] px-2 py-2 sm:rounded-xl lg:flex-col lg:px-4">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-extrabold text-[#3178C6]">會員中心</h3>
      </div>
      <nav className="flex flex-row items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
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
        <a
          className="inline-flex justify-center rounded-md bg-gray-800 p-4 text-white"
          href="#"
        >
          <Icon icon="solar:star-bold" width="24" height="24" />
        </a>
        <a
          className="smooth-hover inline-flex justify-center rounded-md p-4 text-white/50 hover:bg-gray-800 hover:text-white"
          href="#"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </nav>
      <div className="flex flex-row items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
        <a
          className="smooth-hover inline-flex justify-center rounded-md p-4 text-white/50 hover:bg-gray-800 hover:text-white"
          href="#"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <a
          className="smooth-hover inline-flex justify-center rounded-md p-4 text-white/50 hover:bg-gray-800 hover:text-white"
          href="#"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ReviewNavigation;
