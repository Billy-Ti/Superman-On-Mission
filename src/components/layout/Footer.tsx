import React, { useState } from "react";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 處理訂閱邏輯
    console.log(email);
    // 清空輸入欄位
    setEmail("");
  };

  return (
    <footer className="container mx-auto w-full max-w-[1280px] px-4 pb-4 pt-10 md:px-20 md:pt-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between lg:flex-row">
        <div className="mb-10 flex flex-col lg:mb-0">
          <h5 className="mb-3 text-lg font-bold">
            Welcome to leave your valuable feedback
          </h5>
          <form onSubmit={handleSubmit} className="flex">
            <input
              className="mr-2 rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="flex flex-col gap-4 tracking-widest sm:flex-row">
          <div className="flex items-center">
            <div className="flex w-32 flex-col items-center">
              <h5 className="mb-3 font-bold">接案者專區</h5>
              <span className="mb-1 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
                如何接任務
              </span>
              <span className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
                立即接任務
              </span>
            </div>
            <div className="flex w-32 flex-col items-center">
              <h5 className="mb-3 font-bold">發案者專區</h5>
              <span className="mb-1 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
                如何發任務
              </span>
              <span className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
                立即發任務
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex w-32 flex-col items-center">
              <h5 className="mb-3 font-bold">會員專區</h5>
              <span className="mb-1 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
                登入 | 註冊
              </span>
              <span className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
                我的帳戶
              </span>
            </div>
            <div className="flex w-32 flex-col items-center">
              <h5 className="mb-3 font-bold">更多訊息</h5>
              <span className="mb-1 text-sm font-medium text-gray-600 placeholder:cursor-pointer hover:text-gray-900 cursor-pointer">
                關於我們
              </span>
              <span className="text-sm font-medium text-gray-600 placeholder:cursor-pointer hover:text-gray-900 cursor-pointer">
                常見問題
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-gray-300 pt-4 text-center">
        <span className="text-sm text-gray-600">
          &copy; 2023 All Rights Reserved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
