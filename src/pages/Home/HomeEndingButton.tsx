import { Icon } from "@iconify/react";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../../utils/showAlert";

const HomeEndingButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleClick = () => {
    if (isLoggedIn) {
      showAlert("您已經是我們的一份子囉😊", undefined, "success");
    } else {
      navigate("/signIn");
    }
  };

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
          <button
            onClick={handleClick}
            className="group  flex  w-full items-center justify-center rounded-full bg-[#368DCF] px-10 py-4 text-xl font-medium text-white transition duration-500 ease-in-out hover:bg-[#3178C6]"
          >
            加入我們{" "}
            <span
              aria-hidden="true"
              className="inline-block translate-x-0 transition-transform duration-300 ease-in-out group-hover:translate-x-2"
            >
              <Icon icon="ep:right" width="20" height="20" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeEndingButton;
