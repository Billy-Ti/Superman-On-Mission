import ActionButton from "./HomeActionButton";

const HomeSlogan = () => {
  return (
    <div className="relative bg-[url('/home_banner.png')] bg-cover bg-fixed bg-center object-cover md:min-h-[800px]">
      <img
        className="absolute bottom-0 left-0 hidden w-[250px] sm:block md:w-[500px]"
        src="/home_slogan.png"
        alt="home-slogan"
      />
      <div className="container mx-auto flex max-w-[1280px] items-center justify-end px-4 pt-4 lg:px-20">
        <div className="mt-0 py-24 md:mt-20">
          <div>
            <p className="mb-4 text-right text-4xl text-[#3178C6] sm:text-right md:text-6xl lg:pt-10">
              想挑戰不可能的任務 ?
            </p>
          </div>
          <div className="mb-10 flex flex-col items-end justify-end sm:flex-row">
            <h1 className="mr-3 inline text-2xl font-bold italic text-[#3178C6] sm:text-4xl">
              Super Task co.
            </h1>
            <div className="flex items-center pt-2 text-2xl sm:text-2xl">
              <p className="font-bold text-[#3178C6]">( 應該 )</p>
              <p className="font-bold text-[#3178C6]"> 都找的到</p>
            </div>
          </div>
          <ActionButton />
        </div>
      </div>
    </div>
  );
};

export default HomeSlogan;
