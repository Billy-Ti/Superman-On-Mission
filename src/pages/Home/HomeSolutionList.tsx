import { useNavigate } from "react-router";

const HomeSolutionList: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="mb-10 rounded-md">
      <div className="bg-[#B3D7FF]">
        <div className="container mx-auto max-w-[1280px] px-4 md:px-20 py-10 md:py-20">
          <div className="flex w-full flex-col items-center justify-center">
            <span className="mb-3 text-3xl font-medium">
              我們找到了一片藍海，獻給正在苦惱的你...
            </span>
            <div className="mb-10 h-[10px] w-1/3 bg-[#2B79B4]"></div>
            <div className="hidden items-center justify-end lg:flex ">
              <button
                onClick={() => navigate("/acceptTask")}
                className="rounded-md bg-[#368DCF] p-3 text-xl font-medium tracking-wider text-white transition duration-500 ease-in-out hover:bg-[#3178C6]"
              >
                立即開始
              </button>
            </div>
          </div>
          <div className="group grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="group relative flex flex-col items-center py-10 text-center hover:bg-blue-200">
              <img
                src="/solution-picture_two.png"
                className="mx-auto h-auto max-w-[250px] rounded-full"
                alt="title image"
              />
              <span className="absolute right-0 top-0 text-7xl font-normal text-[#3179d6]">
                01
              </span>

              <p className="mt-3 text-xl font-extrabold tracking-wider">
                直覺化操作
              </p>
              <p className="text-medium mt-2 font-semibold tracking-wider text-slate-500">
                簡單接 case，操作簡便，節省您寶貴的時間，完成十萬火急的任務
              </p>
            </div>
            <div className="group relative flex flex-col items-center py-10 text-center hover:bg-blue-200">
              <img
                src="/testpic1.png"
                className="mx-auto h-[250px]] max-w-[250px] rounded-full"
                alt="title image"
              />
              <span className="absolute right-0 top-0 text-7xl font-normal text-[#3179d6]">
                02
              </span>
              <p className="mt-3 text-xl font-extrabold tracking-wider">
                效率好，沒煩惱
              </p>
              <p className="text-medium mt-2 font-semibold tracking-wider text-slate-500">
                多人為您服務，簡化流程，一鍵搞定
              </p>
            </div>
            <div className="group relative flex flex-col items-center p-10 text-center hover:bg-blue-200">
              <img
                src="/solution-picture_three.png"
                className="mx-auto h-auto max-w-[250px] rounded-full"
                alt="title image"
              />
              <span className="absolute right-0 top-0 text-7xl font-normal text-[#3179d6]">
                03
              </span>
              <p className="mt-3 text-xl font-extrabold tracking-wider">
                賺取額外收入
              </p>
              <p className="text-medium mt-2 font-semibold tracking-wider text-slate-500">
                苦無不知道怎麼賺取額外收入嗎 ? 發揮專長，獲取報酬不嫌晚
              </p>
            </div>
            <div className="flex justify-center lg:hidden">
              <button
                onClick={() => navigate("/acceptTask")}
                className="mt-5 rounded-md bg-[#368DCF] p-3 text-xl font-medium tracking-wider text-white transition duration-500 ease-in-out hover:bg-[#3178C6]"
              >
                立即開始
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSolutionList;
