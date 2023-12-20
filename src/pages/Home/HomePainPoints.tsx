import "animate.css";
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
    <div className="bg-[url('/home_pain_point.png')] bg-cover bg-fixed  bg-center object-cover">
      <div className="container mx-auto max-w-[1280px] px-4 py-10 md:px-20 md:py-20">
        <div className="flex flex-col items-center">
          <p className="animate__animated animate__bounce text-center text-3xl font-bold md:text-4xl">
            在你的生活當中，是否有過以下困擾?
          </p>
          <div className="mb-20 flex h-24 items-center justify-center md:w-1/2">
            <div className="typed-container w-full text-center">
              <span className="typed text-xl font-medium md:text-3xl"></span>
            </div>
          </div>
          {/* 交錯式 */}
          <div className="flex justify-center">
            <div className="w-full md:w-10/12">
              <div className="mb-5 flex flex-wrap items-center justify-center md:mb-6 md:flex-row-reverse">
                <div className="text-center font-medium md:w-1/2">
                  <h4 className="mb-2 text-2xl font-bold">
                    在遇到困難時，想找別人幫助
                  </h4>
                  <p className="mb-2 text-lg">
                    找到合適的人幫忙是非常重要的，可以借鑑他們的經驗和專業知識，快速獲得解決問題的方法。這不僅節省了我們的時間和精力，還能省下東奔西找的時間。
                  </p>
                </div>
                <div className="mb-10 flex justify-center md:w-1/2">
                  <img src="/pain_point_1.png" alt="pain-point-1" />
                </div>
              </div>
              <div className="mb-5 flex flex-wrap items-center justify-center md:mb-6">
                <div className="text-center font-medium md:w-1/2">
                  <h4 className="mb-2 text-2xl font-bold">
                    找到適合自己的出路
                  </h4>
                  <p className="mb-2 text-lg">
                    或許你只是想找份收入，但苦無不曉得自己可以做什麼，但是又想賺取額外收入
                  </p>
                </div>
                <div className="mb-10 flex justify-center md:w-1/2">
                  <img src="/pain_point_2.png" alt="pain_point_2.png" />
                </div>
              </div>

              <div className="mb-5 flex flex-wrap items-center justify-center md:mb-6 md:flex-row-reverse">
                <div className="text-center font-medium md:w-1/2">
                  <h4 className="mb-2 text-2xl font-bold">
                    挑選最適合您的好幫手
                  </h4>
                  <p className="mb-2 text-lg">
                    讓您一步步找到 Mr.Right，提供最有效且最即時的幫助
                  </p>
                </div>
                <div className="mb-10 flex justify-center md:w-1/2">
                  <img src="/pain_point_3.png" alt="pain-point-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePainPoints;
