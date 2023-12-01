import { TypeAnimation } from "react-type-animation";

const HomePainPoints = () => {
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex w-1/2 flex-col">
          <p className="mb-6 text-6xl">或許你曾經有過...</p>
        </div>
        <div>
          <TypeAnimation
            sequence={[
              1000,
              "想找人幫你抓害蟲 ?", // initially rendered starting point
              1000,
              "還是想找人教你做報告 ?",
              1000,
              "又或者想兼職賺奶粉錢 ?",
              1000,
              "都找不到管道...",
              1000,
            ]}
            speed={50}
            style={{ fontSize: "2em", color: "red", width: "50%" }}
            repeat={Infinity}
          />
        </div>
      </div>
      <button
        className="w-40 rounded-md bg-gradient-to-r from-blue-300 via-[#f796c7] to-[#f5c1a2] py-3 text-2xl font-black text-white"
        type="button"
      >
        來看成果
      </button>
    </div>
  );
};

export default HomePainPoints;
