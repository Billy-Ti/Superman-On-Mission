import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";
import { animated, useSpring } from "react-spring";

const HomeTaskCount = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [propsTaskCount, setTaskCount] = useSpring(() => ({
    number: 0,
    from: { number: 0 },
    config: { duration: 1500 },
  }));
  const [propsCompletedCount, setCompletedCount] = useSpring(() => ({
    number: 0,
    from: { number: 0 },
    config: { duration: 1000 },
  }));

  const countUp = () => {
    setTaskCount({ number: 600 });
    setCompletedCount({ number: 300 });
  };

  useEffect(() => {
    const checkPosition = () => {
      if (ref.current) {
        const pos = ref.current.getBoundingClientRect();
        if (pos.top < window.innerHeight && pos.bottom >= 0) {
          countUp();
        }
      }
    };

    window.addEventListener("scroll", checkPosition);
    checkPosition();

    return () => {
      window.removeEventListener("scroll", checkPosition);
    };
  }, [setTaskCount, setCompletedCount]);

  return (
    <div
      ref={ref}
      className="container mx-auto max-w-[1280px] px-4 py-10 md:px-20 md:py-20"
    >
      <div className="flex items-center justify-center gap-10 lg:gap-36">
        <div className="flex flex-col items-center gap-3">
          <Icon
            icon="clarity:note-solid"
            color="#368DCF"
            width="70"
            height="70"
          />
          <animated.p className="rounded-full p-5 py-3 text-3xl font-black text-[#224968] sm:text-5xl">
            {propsTaskCount.number.to((n) => Math.floor(n))}
          </animated.p>
          <p className="text-2xl font-semibold text-[#368DCF]">
            本月任務刊登總數
          </p>
        </div>
        <p className="text-4xl text-[#368DCF]">VS</p>
        <div className="flex flex-col items-center gap-3">
          <Icon icon="mdi:crown" color="#368DCF" width="70" height="70" />
          <animated.p className="rounded-full p-5 py-3 text-3xl font-black text-[#224968] sm:text-5xl">
            {propsCompletedCount.number.to((n) => Math.floor(n))}
          </animated.p>
          <p className="text-2xl font-semibold text-[#368DCF]">
            本月已完成總數
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeTaskCount;
