import { useNavigate } from "react-router";

const HomeSolutionList: React.FC = () => {
  const navigate = useNavigate();
  return (
    // shadow-xl shadow-neutral-100
    <div className="mb-10 rounded-md">
      <div className="flex w-full items-center justify-between py-10">
        <p>
          {" "}
          <span className="text-3xl font-bold">
            獻給正在苦惱的你...
          </span> <br />{" "}
        </p>
        <div className="flex items-center justify-center">
          <button
            onClick={() => navigate("/acceptTask")}
            className="rounded-md bg-indigo-500 p-3 text-xl font-black tracking-wider text-white transition duration-500 ease-in-out hover:bg-indigo-700"
          >
            Get started
          </button>
        </div>
      </div>
      <div className="group grid grid-cols-1 gap-3 md:lg:xl:grid-cols-3 ">
        <div className="group flex flex-col items-center py-10 text-center hover:bg-[#f7f4f0]">
          {/* <span className="rounded-full bg-red-500 p-5 text-white shadow-lg shadow-red-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </span> */}
          <img
            src="https://tailone.tailwindtemplate.net/src/img/dummy/avatar1.png"
            className="mx-auto h-auto max-w-full rounded-full bg-gray-50 grayscale"
            alt="title image"
          />
          <p className="mt-3 text-xl font-bold tracking-wider">直覺化操作</p>
          <p className="text-medium mt-2 tracking-wider text-slate-500">
            簡單接 case，操作簡便，節省您寶貴的時間，完成十萬火急的任務
          </p>
        </div>
        <div className="group flex flex-col items-center py-10 text-center hover:bg-[#f7f4f0]">
          {/* <span className="rounded-full bg-orange-500 p-5 text-white shadow-lg shadow-orange-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1={16} y1={13} x2={8} y2={13} />
              <line x1={16} y1={17} x2={8} y2={17} />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </span> */}
          <img
            src="https://tailone.tailwindtemplate.net/src/img/dummy/avatar3.png"
            className="mx-auto h-auto max-w-full rounded-full bg-gray-50 grayscale"
            alt="title image"
          />
          <p className="mt-3 text-xl font-bold tracking-wider">
            效率好，沒煩惱
          </p>
          <p className="text-medium mt-2 tracking-wider text-slate-500">
            多人為您服務，簡化流程，一鍵搞定
          </p>
        </div>

        <div className="group flex flex-col items-center p-10     text-center hover:bg-[#f7f4f0]">
          <img
            src="https://tailone.tailwindtemplate.net/src/img/dummy/avatar2.png"
            className="mx-auto h-auto max-w-full rounded-full bg-gray-50 grayscale"
            alt="title image"
          />
          <p className="mt-3 text-xl font-bold tracking-wider">賺取額外收入</p>
          <p className="text-medium mt-2 tracking-wider text-slate-500">
            苦無不知道怎麼賺取額外收入嗎 ? 發揮專長，獲取報酬不嫌晚
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeSolutionList;
