import { Icon } from "@iconify/react";

const HomeTaskCount = () => {
  return (
    <div className="bg-[url('/bg1.png')] bg-cover bg-fixed  bg-center object-cover">
      <div className="container mx-auto max-w-[1280px] px-4 py-10 md:px-20 md:py-20">
        <div className="mb-10 flex items-center justify-center gap-10 lg:gap-36">
          <div className="flex flex-col items-center gap-3">
            <Icon
              icon="clarity:note-solid"
              color="#368DCF"
              width="70"
              height="70"
            />
            <p className="rounded-full p-5 py-3 text-3xl font-black text-[#368DCF] sm:text-5xl">
              600+
            </p>
            <p className="text-2xl font-semibold text-[#368DCF]">
              本月任務刊登總數
            </p>
          </div>
          <p className="text-4xl text-[#368DCF]">VS</p>
          <div className="flex flex-col items-center gap-3">
            <Icon icon="mdi:crown" color="#368DCF" width="70" height="70" />
            <p className="rounded-full p-5 py-3 text-3xl font-black text-[#368DCF] sm:text-5xl">
              300+
            </p>
            <p className="text-2xl font-semibold text-[#368DCF]">
              本月已完成總數
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTaskCount;
