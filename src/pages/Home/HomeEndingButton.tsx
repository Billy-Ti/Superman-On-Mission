import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const HomeEndingButton = () => {
  return (
    <div className="container mx-auto max-w-[1280px] px-4 py-10 md:px-20 md:py-20">
      <div className="text-center">
        <p className="mx-auto mb-5 w-full text-center text-2xl font-medium leading-normal sm:text-3xl lg:w-1/2">
          <span className="text-[#368DCF]">加入我們的行列</span>
          ，攜手共創無限可能！
        </p>
        <p className="mx-auto mb-10 w-full text-center text-2xl font-medium leading-normal sm:text-3xl lg:w-1/2">
          將熱情轉為行動，
          <span className="text-[#368DCF]">一起寫下新篇章！</span>
        </p>
        <div className="group relative mx-auto w-1/2 transition duration-1000 hover:duration-200 md:w-1/5">
          <Link
            to="/signIn"
            className="flex w-full items-center justify-center rounded-full bg-[#368DCF] px-10 py-4 text-xl font-medium text-white transition duration-500 ease-in-out hover:bg-[#3178C6]"
          >
            加入我們
            <Icon icon="ep:right" width="20" height="20" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeEndingButton;
