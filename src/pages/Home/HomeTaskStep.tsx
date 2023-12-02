import { Icon } from "@iconify/react";

const HomeTaskStep = () => {
  return (
    // shadow-xl shadow-neutral-100
    <div className="mb-20 py-20">
      <p className="mb-10 text-center text-4xl">發案 3 步驟，跟著一起 go</p>
      <div className="flex justify-between px-5">
        <p className="mb-1 text-2xl font-bold">Step 1</p>
        <p className="text-2xl font-bold">Step 2</p>
        <p className="text-2xl font-bold">Step 3</p>
      </div>
      <div className="mb-2 flex items-center justify-center space-x-4">
        <div className="rounded-full bg-red-500 p-4 shadow-lg">
          <Icon
            icon="cil:list"
            width="80"
            height="80"
            rotate={2}
            hFlip={true}
            vFlip={true}
          />
        </div>

        <div className="flex-auto border-t-2 border-gray-300"></div>
        <div className="rounded-full bg-yellow-400 p-4 shadow-lg">
          <Icon
            icon="ant-design:thunderbolt-filled"
            width="80"
            height="80"
            rotate={2}
            hFlip={true}
            vFlip={true}
          />
        </div>

        <div className="flex-auto border-t-2 border-gray-300"></div>

        <div className="rounded-full bg-indigo-500 p-4 shadow-lg">
          <Icon
            icon="icon-park-outline:good-two"
            width="80"
            height="80"
            rotate={2}
            hFlip={true}
            vFlip={true}
            className="text-white"
          />
        </div>
      </div>
      <div className="mb-10 flex justify-between px-2">
        <p className="mb-1 text-2xl font-bold">刊登任務</p>
        <p className="text-2xl font-bold">出任務囉</p>
        <p className="text-2xl font-bold">完成評價</p>
      </div>
      <div className="flex flex-col">
        {/* main card */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="flex h-full w-full flex-col items-center justify-between rounded-xl bg-white p-4 shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl"
              key={index}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Telenor_Logo.svg/1600px-Telenor_Logo.svg.png"
                className="w-12"
                alt="Telenor Logo"
              />
              <div className="mt-2 text-lg font-semibold">幫我抓米奇...</div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Icon icon="uim:clock" className="text-gray-400" />
                <span>2023/09/01</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <Icon icon="mdi:location" className="text-gray-400" />
                <span>台北市仁愛路三段14巷五號五樓</span>
              </div>
              <div className="my-4 bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text font-black text-transparent">
                <span className="text-base font-bold">500</span>
                <span className="text-sm font-semibold">/ Super Coin</span>
              </div>
              <button className="mt-2 w-full rounded-full border border-[#F0F0F6] bg-[#F4F5FA] px-4 py-3 shadow-lg transition duration-300 ease-in-out hover:bg-slate-300">
                See more
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTaskStep;
