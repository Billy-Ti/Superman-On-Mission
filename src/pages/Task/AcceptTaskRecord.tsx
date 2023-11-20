import { Icon } from "@iconify/react";
import { useState } from "react";

const AcceptTaskRecord = () => {
  const [hoverText, setHoverText] = useState("查看任務詳情 >>");

  return (
    <>
      <div className="border-2 border-gray-200 p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-start">
            <div className="h-full border-2 border-gray-300 p-2">
              <img
                src="/path-to-your-image.jpg"
                alt="任務"
                className="h-16 w-16"
              />
            </div>
            <div className="ml-4">
              <h5 className="text-lg font-bold"># 生活服務</h5>
              <p className="text-sm">幫我通馬桶</p>
              <div className="mt-1 flex items-center">
                <Icon icon="mdi:location" />
                <span className="ml-2 text-sm">台北市仁愛路</span>
              </div>
              <div className="flex">
                <p className="mr-1">完成日期 :</p>
                <span>2023/11/11</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center">
              <Icon icon="bi:fire" color="#dc2626" />
              <span className="text-center text-lg font-bold">十萬火急</span>
            </div>
            <div
              className="group relative cursor-pointer overflow-hidden rounded-lg bg-gray-200 px-6 py-3 [transform:translateZ(0)] before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-[100%_100%] before:scale-x-0 before:bg-sky-600 before:transition before:duration-500 before:ease-in-out hover:before:origin-[0_0] hover:before:scale-x-100"
              onMouseMove={() => setHoverText("接案紀錄查詢 >>")}
              onMouseOut={() => setHoverText("查看任務詳情 >>")}
            >
              <span className="relative z-0 text-black transition duration-500 ease-in-out group-hover:text-gray-200">
                {hoverText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-10 h-5 bg-slate-300"></div>
    </>
  );
};

export default AcceptTaskRecord;
