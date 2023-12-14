import ActionButton from "./HomeActionButton";

const HomeSlogan = () => {
  return (
    <div className="relative bg-[url('/home_banner.png')] bg-cover bg-fixed bg-center object-cover md:min-h-[600px]">
      <img
        className="absolute bottom-0 left-0 hidden w-[250px] sm:block md:w-[500px]"
        src="/home_slogan.png"
        alt="home-slogan"
      />
      <div className="container mx-auto  max-w-[1280px] px-4 pt-4 lg:px-20">
        <div className="py-24">
          <div>
            <p className="mb-4 text-right text-4xl text-[#3178C6] sm:text-right md:text-6xl lg:pt-10">
              想挑戰不可能的任務 ?
            </p>
          </div>
          <div className="mb-10 flex flex-col items-end justify-end sm:flex-row">
            <h1 className="mr-3 inline bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text text-2xl font-black italic text-transparent sm:text-4xl">
              Super Task co.
            </h1>
            <div className="flex items-center pt-2 text-2xl sm:text-2xl">
              <p>( 應該 )</p>
              <p> 都找的到</p>
            </div>
          </div>
          <ActionButton />
        </div>
      </div>
    </div>
  );
};

export default HomeSlogan;
