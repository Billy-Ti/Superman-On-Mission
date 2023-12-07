import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const HomeEndingButton = () => {
  return (
    <div className="container mx-auto max-w-[1280px] px-4 pt-4 md:px-20">
      <div className="py-10 text-center md:py-20">
        <div>
          <p className="mb-10 min-w-max bg-gradient-to-r from-blue-700 to-purple-400 bg-clip-text text-4xl italic text-transparent sm:text-6xl">
            SuperTask co.
          </p>
        </div>

        <p className="mx-auto mb-5 w-full text-center text-2xl leading-normal sm:text-3xl lg:w-1/2">
          <span className="bg-gradient-to-r from-blue-700 to-purple-400 bg-clip-text text-transparent">
            加入我們的行列
          </span>
          ，攜手共創無限可能！
        </p>
        <p className="mx-auto mb-20 w-full text-center text-2xl leading-normal sm:text-3xl lg:w-1/2">
          將熱情轉為行動，
          <span className="bg-gradient-to-r from-blue-700 to-purple-400 bg-clip-text text-transparent">
            一起寫下新篇章！
          </span>
        </p>
        <div className="group relative mx-auto w-1/5 transition duration-1000 hover:duration-200">
          <Link
            to="/signIn"
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-pink-300 to-purple-300 px-10 py-4  text-xl text-black hover:from-purple-300 hover:to-pink-300"
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
