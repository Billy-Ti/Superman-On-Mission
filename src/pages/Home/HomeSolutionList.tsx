import { useNavigate } from "react-router";

const HomeSolutionList: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#B3D7FF] ">
      <div className="container mx-auto max-w-[1280px] px-4 py-10 md:px-20 md:py-20">
        <div className="flex w-full flex-col items-center justify-center">
          <span className="mb-3 text-3xl font-bold">
            我們找到了一片藍海，獻給正在苦惱的你...
          </span>
          <div className="mb-10 h-[10px] w-1/3 bg-[#2B79B4]"></div>
          <div className="mb-20 hidden items-center justify-end md:flex">
            <button
              onClick={() => navigate("/acceptTask")}
              className="items-center justify-center rounded-md  bg-[#368DCF] p-3 text-xl font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
            >
              立即開始
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-10 md:flex-row">
          <div>
            <img
              className="h-full w-[250px] object-cover lg:w-[350px]"
              src="/home_solution.png"
              alt="home-solution.png"
            />
          </div>
          <ul className="flex flex-col justify-center gap-20">
            <li className="flex flex-col items-center md:items-start">
              <h3 className="text-2xl font-extrabold tracking-wider">
                直覺化操作
              </h3>

              <p className="text-medium mt-2 font-semibold tracking-wider text-slate-500">
                簡單接 case，操作簡便，節省您寶貴的時間，完成十萬火急的任務
              </p>
            </li>
            <li className="flex flex-col items-center md:items-start">
              <h3 className="text-2xl font-extrabold tracking-wider">
                效率好，沒煩惱
              </h3>
              <p className="text-medium mt-2 font-semibold tracking-wider text-slate-500">
                多人為您服務，簡化流程，一鍵搞定
              </p>
            </li>
            <li className="flex flex-col items-center md:items-start">
              <h3 className="text-2xl font-extrabold tracking-wider">
                賺取額外收入
              </h3>
              <p className="text-medium mt-2 font-semibold tracking-wider text-slate-500">
                苦無不知道怎麼賺取額外收入嗎 ? 發揮專長，獲取報酬不嫌晚
              </p>
            </li>
          </ul>
          <div className="block justify-center md:hidden">
            <button
              onClick={() => navigate("/acceptTask")}
              className="mt-5 items-center justify-center rounded-md bg-[#368DCF] p-3 text-xl font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
            >
              立即開始
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSolutionList;
