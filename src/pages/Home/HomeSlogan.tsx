import ActionButton from "./HomeActionButton";

const HomeSlogan = () => {
  return (
    <>
      <div className="py-24">
        <p className="mb-4 text-6xl text-right">想挑戰不可能的任務 ?</p>
        <div className="mb-10 flex items-center justify-end">
          <h1 className="mr-3 inline bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text text-5xl font-black italic text-transparent">
            Super Task co.
          </h1>
          <div className="flex items-center pt-2 text-3xl">
            <p className="text-3xl">( 應該 )</p>
            <p className="text-3xl">都找的到</p>
          </div>
        </div>
        <ActionButton />
      </div>
    </>
  );
};

export default HomeSlogan;
