import { Icon } from "@iconify/react";

const HomeTaskCount = () => {
  return (
    <div className="bg-[url('/test7.png')] bg-cover bg-fixed bg-center">
      <div className="container mx-auto h-[500px] max-w-[1280px] px-4 pt-4 md:px-20">
        {/* shadow-xl shadow-neutral-100 */}
        <div className="mb-10 flex items-center justify-center gap-10 lg:gap-36">
          <div className="flex flex-col items-center gap-3">
            <Icon icon="clarity:note-solid" width="70" height="70" />
            <p className="rounded-full bg-gradient-to-r from-blue-500 via-[#f493c4] to-[#f99659] p-5 py-3 text-3xl font-black text-white sm:text-5xl">
              600+
            </p>
            <p className="text-2xl">任務刊登總數</p>
          </div>
          <p className="text-4xl">VS</p>
          <div className="flex flex-col items-center gap-3">
            <Icon icon="mdi:crown" width="70" height="70" />
            <p className="rounded-full bg-gradient-to-r from-blue-500 via-[#f493c4] to-[#f99659] p-5 py-3 text-3xl font-black text-white sm:text-5xl">
              300+
            </p>
            <p className="text-2xl">完成總數</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTaskCount;
