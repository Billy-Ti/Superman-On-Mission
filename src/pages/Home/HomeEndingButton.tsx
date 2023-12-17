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
    <div className="mb-4 text-center lg:mb-0">
      <p className=" w-full text-center text-lg font-medium leading-normal ">
        <span className="text-[#368DCF]">加入我們的行列</span>
        ，攜手共創無限可能！
      </p>
      <p className="mb-5 w-full text-center text-lg font-medium leading-normal ">
        將熱情轉為行動，
        <span className="text-[#368DCF]">一起寫下新篇章！</span>
      </p>
      <div className="group flex justify-center transition duration-1000 hover:duration-200">
        <button
          onClick={handleClick}
          className="flex items-center justify-center rounded-md bg-[#368DCF] px-4 py-2 text-lg font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
        >
          <span className="flex items-center">
            加入我們
            <span
              aria-hidden="true"
              className="ml-2 inline-block translate-x-0 transition-transform duration-300 ease-in-out group-hover:translate-x-2"
            >
              <Icon icon="ep:right" width="20" height="20" />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default HomeEndingButton;
