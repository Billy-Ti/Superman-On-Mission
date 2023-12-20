import { Link } from "react-router-dom";
import HomeEndingButton from "../../pages/Home/HomeEndingButton";

const Footer: React.FC = () => {
  return (
    <footer className="container mx-auto w-full max-w-[1280px] px-4 py-4 md:px-20 md:pb-10 md:pt-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between lg:flex-row">
        <div className="flex flex-col">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Misc_04">
              <g id="Group">
                <g id="Group_2">
                  <path
                    id="Vector"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M94.6786 31.4698C75.9099 66.3698 38.4176 80.5585 3.59534 60.9107C2.43609 60.2565 0.966049 60.6655 0.311804 61.8104C-0.342442 62.9758 0.0665055 64.4478 1.22575 65.1021C38.5505 86.181 78.8049 71.1539 98.923 33.7597C99.5527 32.5943 99.1132 31.1221 97.9417 30.4883C96.7701 29.8749 95.3083 30.3045 94.6786 31.4698Z"
                    fill="black"
                  />
                  <g id="Group_3">
                    <path
                      id="Vector_2"
                      d="M32.8992 45.9428C36.7762 45.9428 39.9192 42.7999 39.9192 38.9229C39.9192 35.0459 36.7762 31.9031 32.8992 31.9031C29.0222 31.9031 25.8793 35.0459 25.8793 38.9229C25.8793 42.7999 29.0222 45.9428 32.8992 45.9428Z"
                      fill="black"
                    />
                  </g>
                  <g id="Group_4">
                    <path
                      id="Vector_3"
                      d="M61.9605 38.4754C65.7617 38.4754 68.8433 35.394 68.8433 31.5927C68.8433 27.7915 65.7617 24.7101 61.9605 24.7101C58.1593 24.7101 55.0778 27.7915 55.0778 31.5927C55.0778 35.394 58.1593 38.4754 61.9605 38.4754Z"
                      fill="black"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
          <HomeEndingButton />
        </div>
        <div className="flex flex-col tracking-widest sm:flex-row">
          <div className="flex">
            <div className="flex w-32 flex-col items-center">
              <Link
                to="/acceptTask"
                className="text-medium relative cursor-pointer font-medium tracking-widest text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[8px] after:w-full after:translate-y-1 after:bg-[#368dcf] after:opacity-0 after:transition after:duration-200 after:ease-in-out hover:text-gray-900 hover:after:translate-y-0 hover:after:opacity-50"
              >
                立即接任務
              </Link>
            </div>
            <div className="flex w-32 flex-col items-center">
              <Link
                to="/taskPage"
                className="text-medium relative cursor-pointer font-medium tracking-widest text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[8px] after:w-full after:translate-y-1 after:bg-[#368dcf] after:opacity-0 after:transition after:duration-200 after:ease-in-out hover:text-gray-900 hover:after:translate-y-0 hover:after:opacity-50"
              >
                立即發任務
              </Link>
            </div>
          </div>
          <div className="flex">
            <div className="flex w-32 flex-col items-center">
              <Link
                to="/signIn"
                className="text-medium relative cursor-pointer font-medium tracking-widest text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[8px] after:w-full after:translate-y-1 after:bg-[#368dcf] after:opacity-0 after:transition after:duration-200 after:ease-in-out hover:text-gray-900 hover:after:translate-y-0 hover:after:opacity-50"
              >
                登入 | 註冊
              </Link>
            </div>
            <div className="flex w-32 flex-col items-center">
              <Link
                to="/profile"
                className="text-medium relative cursor-pointer font-medium tracking-widest text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[8px] after:w-full after:translate-y-1 after:bg-[#368dcf] after:opacity-0 after:transition after:duration-200 after:ease-in-out hover:text-gray-900 hover:after:translate-y-0 hover:after:opacity-50"
              >
                我的帳戶
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-gray-300 pt-4 text-center">
        <span className="text-sm font-medium text-gray-600">
          &copy; 2023 All Rights Reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
