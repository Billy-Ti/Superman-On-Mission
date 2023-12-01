import ActionButton from "./ActionButton";

const HomeSlogan = () => {
  return (
    <>
      <div className="mb-20">
        <p className="mb-4 text-6xl">想挑戰不可能的任務 ?</p>
        <div className="flex items-center justify-center">
          <p className="mr-3 pt-2 text-3xl">想找的</p>
          <h1 className="mr-2 inline bg-gradient-to-r from-blue-700 via-blue-500 to-purple-400 bg-clip-text text-5xl font-black text-transparent">
            Super Task co.{" "}
          </h1>
          <p className="pt-2 text-3xl">( 應該 ) 都找的到</p>
        </div>
        <ActionButton />
      </div>
    </>
  );
};

export default HomeSlogan;
