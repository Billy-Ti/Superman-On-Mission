import ActionButton from "./HomeActionButton";

const HomeSlogan = () => {
  return (
    <div className="min-h-[600px] bg-[url('/bg2.png')] bg-cover bg-fixed relative  bg-center object-cover">
      <img className="absolute bottom-0 left-0 w-[500px]" src="/testpic2.png" alt="testpic2" />
      <div className="container mx-auto  max-w-[1280px] px-4 pt-4 lg:px-20">
        <div className="py-24">
          <div>
            {/* <p className="mb-4 bg-gradient-to-r from-blue-600 via-[#f6037d] to-[#f99659] bg-clip-text text-right text-4xl text-transparent  sm:text-right md:text-6xl lg:pt-10">
              想挑戰不可能的任務 ?
            </p> */}
            <p className="mb-4 text-[#3178C6] text-right text-4xl sm:text-right md:text-6xl lg:pt-10">
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
