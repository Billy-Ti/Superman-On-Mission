import { Icon } from "@iconify/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { auth, db } from "../../config/firebase";
import { showAlert } from "../../utils/showAlert";

const SignIn = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const backToHome = () => {
    navigate("/");
  };

  // 註冊切換，不做功能
  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  // 登入切換，不做功能
  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  // 註冊功能
  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const joinedAt = new Date().toLocaleDateString();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      showAlert("🚨系統提醒", "註冊成功", "success");
      // 註冊成功後，將用戶名存入 Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        joinedAt,
        userId: userCredential.user.uid,
        totalPostedTasks: 0,
        totalCompletedTasks: 0,
        progressTasks: 0,
        superCoins: 5000,
      });

      // 清除輸入狀態
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      showAlert("🚨系統提醒", "註冊錯誤", "error");
      if (error instanceof Error) {
        console.error("登入錯誤：", error.message);
      } else {
        console.error("未知登入錯誤");
      }
    }
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      showAlert("登入成功", "下一個超人就是你~", "success");
      console.log("登入成功：", userCredential.user);

      navigate("/");
    } catch (error) {
      showAlert("🚨系統提醒", "登入錯誤", "error");
      console.error("登入錯誤：", error);
    }
  };

  return (
    <>
      <Header />
      <div className="mx-0 -mt-5 flex h-[calc(100vh-70px)] flex-col items-center justify-center bg-white bg-gradient-to-r from-blue-200 via-blue-100 to-[#f7f4f0]">
        <div
          className="mb-3 cursor-pointer bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text text-2xl text-transparent"
          onClick={backToHome}
        >
          <Icon icon="mdi:home" color="#609af9" width="50" height="50" />
        </div>
        <div
          className={`rounded-md-[10px] container relative min-h-[480px] w-[768px] max-w-full overflow-hidden bg-[#fff] ${
            isRightPanelActive ? "right-panel-active" : ""
          }`}
          id="container"
        >
          <div className="form-container sign-up-container absolute left-0 top-0 h-full w-1/2 opacity-0 [transition:all_0.6s_ease-in-out]">
            <form
              onSubmit={handleSignUp}
              className="flex h-full flex-col items-center justify-center bg-white px-[50px] py-0 text-center"
            >
              <p className="m-0 mb-4 text-2xl font-bold">Create Account</p>
              <span className="text-sm">use your email for registration</span>
              <input
                className="mx-0 my-2 w-full rounded-md border-[none] bg-[#eee] px-[15px] py-3 focus:outline-none"
                type="text"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="mx-0 my-2 w-full rounded-md border-[none] bg-[#eee] px-[15px] py-3 focus:outline-none"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="mx-0 my-2 w-full rounded-md border-[none] bg-[#eee] px-[15px] py-3 focus:outline-none"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="mt-[22px] rounded-md border-[1px] border-[#FF4B2B] border-[solid] bg-[#FF4B2B] px-[45px] py-3 text-[12px] font-bold uppercase tracking-[1px] text-[#FFFFFF] [transition:transform_80ms_ease-in] focus:outline-[none] active:scale-[0.95]">
                Sign Up
              </button>
            </form>
          </div>
          <div className="form-container sign-in-container absolute left-0 top-0 h-full w-1/2 [transition:all_0.6s_ease-in-out]">
            <form
              onSubmit={handleSignIn}
              className="flex h-full flex-col items-center justify-center bg-[#FFFFFF] px-[50px] py-0 text-center"
            >
              <p>Sign in</p>
              <input
                className="mx-0 my-2 w-full rounded-md border-[none] bg-[#eee] px-[15px] py-3 focus:outline-none"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="mx-0 my-2 w-full rounded-md border-[none] bg-[#eee] px-[15px] py-3 focus:outline-none"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* <a
                className="mx-0 my-[15px] text-[14px] text-[#333] no-underline"
                href="#"
              >
                Forgot your password?
              </a> */}
              <button className="mt-[15px] rounded-md border-[1px] border-[#FF4B2B] border-[solid] bg-[#FF4B2B] px-[45px] py-3 text-[12px] font-bold uppercase tracking-[1px] text-[#FFFFFF] [transition:transform_80ms_ease-in] focus:outline-[none] active:scale-[0.95]">
                Sign In
              </button>
            </form>
          </div>
          <div className="overlay-container absolute left-2/4 top-0 h-full w-1/2 overflow-hidden [transition:transform_0.6s_ease-in-out]">
            <div className="overlay relative -left-full h-full w-[200%] translate-x-[0] bg-gradient-to-r from-blue-200 via-blue-100 to-[#f7f4f0] bg-cover bg-[0_0] bg-no-repeat font-black text-black [transition:transform_0.6s_ease-in-out]">
              <div className="overlay-panel overlay-left absolute top-0 flex h-full w-1/2 translate-x-[0] flex-col items-center justify-center px-[40px] py-0 text-center [transition:transform_0.6s_ease-in-out]">
                <p className="text-xl">Welcome Back!</p>
                <p className="mx-0 mb-[30px] mt-5 text-[14px] font-bold leading-[20px] tracking-[0.5px]">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="ghost rounded-md border-[1px] border-[#FF4B2B] border-[solid] bg-[#FF4B2B] px-[45px] py-3 text-[12px] font-bold uppercase tracking-[1px] text-[#FFFFFF] [transition:transform_80ms_ease-in] focus:outline-[none] active:scale-[0.95] "
                  id="signIn"
                  onClick={handleSignInClick}
                >
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right absolute right-[0] top-0 flex h-full w-1/2 translate-x-[0] flex-col items-center justify-center px-[40px] py-0 text-center [transition:transform_0.6s_ease-in-out]">
                <p className="text-xl">Hello, Friend!</p>
                <p className="mx-0 mb-[30px] mt-5 text-[14px] font-bold leading-[20px] tracking-[0.5px]">
                  Enter your personal details and start journey with us
                </p>
                <button
                  className="ghost rounded-md border-[1px] border-[#FF4B2B] border-[solid] bg-[#FF4B2B] px-[45px] py-3 text-[12px] font-bold uppercase tracking-[1px] text-[#FFFFFF] [transition:transform_80ms_ease-in] focus:outline-[none] active:scale-[0.95] "
                  id="signUp"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
