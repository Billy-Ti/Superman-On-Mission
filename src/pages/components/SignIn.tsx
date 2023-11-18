import { useState } from "react";

const SignIn = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };
  return (
    <>
      <div className="mx-0 -mt-5 mb-12 flex h-screen flex-col items-center justify-center bg-[#f6f5f7]">
        <div
          className={`container relative min-h-[480px] w-[768px] max-w-full overflow-hidden rounded-[10px] bg-[#fff] ${
            isRightPanelActive ? "right-panel-active" : ""
          }`}
          id="container"
        >
          <div className="form-container sign-up-container absolute left-[0] top-[0] h-full w-1/2 opacity-0 [transition:all_0.6s_ease-in-out]">
            <form
              action="#"
              className="flex h-full flex-col items-center justify-center bg-[#FFFFFF] px-[50px] py-[0] text-center"
            >
              <p className="m-0 mb-4 font-bold">Create Account</p>
              <span className="text-[12px]">
                or use your email for registration
              </span>
              <input
                className="mx-0 my-2 w-full border-[none] bg-[#eee] px-[15px] py-[12px] focus:outline-none"
                type="text"
                placeholder="Name"
              />
              <input
                className="mx-0 my-2 w-full border-[none] bg-[#eee] px-[15px] py-[12px] focus:outline-none"
                type="email"
                placeholder="Email"
              />
              <input
                className="mx-0 my-2 w-full border-[none] bg-[#eee] px-[15px] py-[12px] focus:outline-none"
                type="password"
                placeholder="Password"
              />
              <button className="rounded-[20px] border-[1px] border-[#FF4B2B] border-[solid] bg-[#FF4B2B] px-[45px] py-[12px] text-[12px] font-bold uppercase tracking-[1px] text-[#FFFFFF] [transition:transform_80ms_ease-in] focus:outline-[none] active:scale-[0.95]">
                Sign Up
              </button>
            </form>
          </div>
          <div className="form-container sign-in-container absolute left-[0] top-[0] h-full w-1/2 [transition:all_0.6s_ease-in-out]">
            <form
              action="#"
              className="flex h-full flex-col items-center justify-center bg-[#FFFFFF] px-[50px] py-[0] text-center"
            >
              <p>Sign in</p>
              <input
                className="mx-0 my-2 w-full border-[none] bg-[#eee] px-[15px] py-[12px] focus:outline-none"
                type="email"
                placeholder="Email"
              />
              <input
                className="mx-0 my-2 w-full border-[none] bg-[#eee] px-[15px] py-[12px] focus:outline-none"
                type="password"
                placeholder="Password"
              />
              <a
                className="mx-0 my-[15px] text-[14px] text-[#333] no-underline"
                href="#"
              >
                Forgot your password?
              </a>
              <button className="rounded-[20px] border-[1px] border-[#FF4B2B] border-[solid] bg-[#FF4B2B] px-[45px] py-[12px] text-[12px] font-bold uppercase tracking-[1px] text-[#FFFFFF] [transition:transform_80ms_ease-in] focus:outline-[none] active:scale-[0.95]">
                Sign In
              </button>
            </form>
          </div>
          <div className="overlay-container absolute left-2/4 top-[0] h-full w-1/2 overflow-hidden [transition:transform_0.6s_ease-in-out]">
            <div className="overlay relative -left-full h-full w-[200%] translate-x-[0] bg-[#FF416C] bg-[-webkit-linear-gradient(to_right,_#FF4B2B,_#FF416C)] bg-[linear-gradient(to_right,_#FF4B2B,_#FF416C)] bg-cover bg-[0_0] bg-no-repeat text-[#FFFFFF] [transition:transform_0.6s_ease-in-out]">
              <div className="overlay-panel overlay-left absolute top-[0] flex h-full w-1/2 -translate-x-[20%] translate-x-[0] flex-col items-center justify-center px-[40px] py-[0] text-center [transition:transform_0.6s_ease-in-out]">
                <p>Welcome Back!</p>
                <p className="mx-0 mb-[30px] mt-[20px] text-[14px] font-thin leading-[20px] tracking-[0.5px]">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="ghost rounded-[20px] border-[1px] border-[#FF4B2B] border-[solid] bg-[#FF4B2B] px-[45px] py-[12px] text-[12px] font-bold uppercase tracking-[1px] text-[#FFFFFF] [transition:transform_80ms_ease-in] focus:outline-[none] active:scale-[0.95] "
                  id="signIn"
                  onClick={handleSignInClick}
                >
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right absolute right-[0] top-[0] flex h-full w-1/2 translate-x-[0] flex-col items-center justify-center px-[40px] py-[0] text-center [transition:transform_0.6s_ease-in-out]">
                <p>Hello, Friend!</p>
                <p className="mx-0 mb-[30px] mt-[20px] text-[14px] font-thin leading-[20px] tracking-[0.5px]">
                  Enter your personal details and start journey with us
                </p>
                <button
                  className="ghost rounded-[20px] border-[1px] border-[#FF4B2B] border-[solid] bg-[#FF4B2B] px-[45px] py-[12px] text-[12px] font-bold uppercase tracking-[1px] text-[#FFFFFF] [transition:transform_80ms_ease-in] focus:outline-[none] active:scale-[0.95] "
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
