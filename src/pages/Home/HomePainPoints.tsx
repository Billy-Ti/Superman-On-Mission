import { useEffect } from "react";
import Typed from "typed.js";

const HomePainPoints = () => {
  useEffect(() => {
    const options = {
      strings: [
        "想找人幫你<span class='highlight body'>抓蟲蟲</span> ?",
        "想找人幫你<span class='highlight body'>做報告</span> ?",
        "又或者想兼職<span class='highlight body'>賺奶粉錢</span> ?",
        "都找不到管道...",
      ],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
      startDelay: 1000,
    };
    const typed = new Typed(".typed", options);
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <>
      <div className="mb-10 py-10">
        <div className="flex flex-col items-center md:flex-row">
          <p className="text-4xl font-bold md:mr-4 md:w-1/2">
            或許你曾經有過...
          </p>
          <div className="flex h-24 items-center justify-center md:w-1/2">
            <div className="typed-container w-full text-center">
              <span className="typed text-2xl md:text-4xl md:font-bold"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePainPoints;
