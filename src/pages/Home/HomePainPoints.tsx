import { useEffect } from "react";
import Typed from "typed.js";
interface PainPointSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  reverse?: boolean;
}
const PainPointSection: React.FC<PainPointSectionProps> = ({
  title,
  description,
  imageSrc,
  reverse = false,
}) => (
  <div
    className={`mb-5 flex flex-wrap items-center justify-center md:mb-6 ${
      reverse ? "md:flex-row-reverse" : ""
    }`}
  >
    <div className="text-center font-medium md:w-1/2">
      <h4 className="mb-2 text-2xl font-bold">{title}</h4>
      <p className="mb-2 text-lg">{description}</p>
    </div>
    <div className="mb-10 flex justify-center md:w-1/2">
      <img src={imageSrc} alt={title} />
    </div>
  </div>
);

const HomePainPoints = () => {
  useEffect(() => {
    const options = {
      strings: [
        "想找人幫你<span class='highlight'>抓蟲蟲</span> ?",
        "想找人幫你<span class='highlight'>做報告</span> ?",
        "又或者想兼職<span class='highlight'>賺奶粉錢</span> ?",
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
    <div className="bg-[url('/home_pain_point.png')] bg-cover bg-fixed bg-center">
      <div className="container mx-auto max-w-[1280px] px-4 py-10 md:px-20 md:py-20">
        <div className="flex flex-col items-center">
          <p className="text-center text-3xl font-bold md:text-4xl">
            在你的生活當中，是否有過以下困擾?
          </p>
          <div className="mb-20 flex h-24 items-center justify-center md:w-1/2">
            <div className="typed-container w-full text-center">
              <span className="typed text-xl font-medium md:text-3xl"></span>
            </div>
          </div>

          <PainPointSection
            title="在遇到困難時，想找別人幫助"
            description="找到合適的人幫忙是非常重要的，可以借鑑他們的經驗和專業知識，快速獲得解決問題的方法。這不僅節省了我們的時間和精力，還能省下東奔西找的時間。"
            imageSrc="/home_pain_point_1.png"
            reverse={true}
          />

          <PainPointSection
            title="找到適合自己的出路"
            description="或許你只是想找份收入，但苦無不曉得自己可以做什麼，但是又想賺取額外收入"
            imageSrc="/home_pain_point_2.png"
          />

          <PainPointSection
            title="挑選最適合您的好幫手"
            description="讓您一步步找到 Mr.Right，提供最有效且最即時的幫助"
            imageSrc="/home_pain_point_3.png"
            reverse={true}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePainPoints;
