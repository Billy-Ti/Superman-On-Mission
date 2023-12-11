import { Icon } from "@iconify/react";
import { useState } from "react";
import InteractiveBlock from "../components/InteractiveBlock";

const HomeTaskHeroCard: React.FC = () => {
  const [currdeg, setCurrdeg] = useState(0);

  const rotate = (direction: "next" | "prev") => {
    setCurrdeg((prevDegree) => prevDegree + (direction === "next" ? -60 : 60));
  };

  return (
    <div className="container mx-auto max-w-[1280px] px-4 py-10 md:px-20 md:py-20">
      <div className="mb-24 px-4 text-center md:px-0">
        <div className="relative inline-block bg-[#2B79B4] px-10 py-4">
          <Icon
            className="absolute left-[20px] top-0 -translate-x-full -translate-y-1/2 transform"
            icon="mdi:crown"
            color="#2b79b4"
            width="50"
            height="50"
            rotate={1.5}
          />
          <p className="text-4xl font-bold text-white">優秀超人榜</p>
        </div>
      </div>

      <div className="relative mb-20 select-none">
        <div className="container relative mx-[auto] my-[0] h-[200px] w-[250px] [perspective:1000px]">
          <div
            className="carousel absolute h-full w-full [transform-style:preserve-3d] [transition:transform_1s]"
            style={{
              transform: `rotateY(${currdeg}deg)`,
            }}
          >
            <InteractiveBlock
              bgColor="bg-[#bfdbfe]"
              transform="[transform:rotateY(0deg)_translateZ(250px)]"
              content={
                <>
                  <img
                    src="/slogan.png"
                    alt="描述"
                    className="mb-4 h-32 w-32 rounded-full"
                  />
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Tasker Name :</p>
                    <p className="text-[1em]"></p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Professionalism :</p>
                    <p className="text-[1em]">/5</p>
                  </div>
                </>
              }
            />
            <InteractiveBlock
              bgColor="bg-[#f7f4f0]"
              transform="[transform:rotateY(60deg)_translateZ(250px)]"
              content={
                <>
                  <img
                    src="/slogan.png"
                    alt="描述"
                    className="mb-4 h-32 w-32 rounded-full"
                  />
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Tasker Name :</p>
                    <p className="text-[1em]"></p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Professionalism :</p>
                    <p className="text-[1em]">/5</p>
                  </div>
                </>
              }
            />
            <InteractiveBlock
              bgColor="bg-[#d5adfd]"
              transform="[transform:rotateY(120deg)_translateZ(250px)]"
              content={
                <>
                  <img
                    src="/slogan.png"
                    alt="描述"
                    className="mb-4 h-32 w-32 rounded-full"
                  />
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Tasker Name :</p>
                    <p className="text-[1em]"></p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Professionalism :</p>
                    <p className="text-[1em]">/5</p>
                  </div>
                </>
              }
            />
            <InteractiveBlock
              bgColor="bg-[#bfdbfe]"
              transform="[transform:rotateY(180deg)_translateZ(250px)]"
              content={
                <>
                  <img
                    src="/slogan.png"
                    alt="描述"
                    className="mb-4 h-32 w-32 rounded-full"
                  />
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Tasker Name :</p>
                    <p className="text-[1em]"></p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Professionalism :</p>
                    <p className="text-[1em]">/5</p>
                  </div>
                </>
              }
            />
            <InteractiveBlock
              bgColor="bg-[#f7f4f0]"
              transform="[transform:rotateY(240deg)_translateZ(250px)]"
              content={
                <>
                  <img
                    src="/slogan.png"
                    alt="描述"
                    className="mb-4 h-32 w-32 rounded-full"
                  />
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Tasker Name :</p>
                    <p className="text-[1em]"></p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Professionalism :</p>
                    <p className="text-[1em]">/5</p>
                  </div>
                </>
              }
            />
            <InteractiveBlock
              bgColor="bg-[#d5adfd]"
              transform="[transform:rotateY(300deg)_translateZ(250px)]"
              content={
                <>
                  <img
                    src="/slogan.png"
                    alt="描述"
                    className="mb-4 h-32 w-32 rounded-full"
                  />
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Tasker Name :</p>
                    <p className="text-[1em]"></p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <p className="text-[1em]">Professionalism :</p>
                    <p className="text-[1em]">/5</p>
                  </div>
                </>
              }
            />
          </div>
        </div>

        <button
          type="button"
          className="next absolute right-[20px] top-[-90px] mx-auto bg-transparent sm:bottom-0 sm:right-[10%] sm:top-0"
          onClick={() => rotate("next")}
        >
          <Icon
            icon="icon-park-outline:right-c"
            color="#9193f4"
            width="50"
            height="50"
          />
        </button>
        <button
          type="button"
          className="next absolute left-[20px] top-[-90px] mx-auto bg-transparent sm:bottom-0 sm:left-[10%] sm:top-0"
          onClick={() => rotate("prev")}
        >
          <Icon
            icon="icon-park-outline:left-c"
            color="#9193f4"
            width="50"
            height="50"
          />
        </button>
      </div>
    </div>
  );
};

export default HomeTaskHeroCard;
