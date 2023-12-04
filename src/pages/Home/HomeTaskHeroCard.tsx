import { Icon } from "@iconify/react";
import { useState } from "react";
import InteractiveBlock from "../components/InteractiveBlock";

const HomeTaskHeroCard: React.FC = () => {
  const [currdeg, setCurrdeg] = useState(0);

  const rotate = (direction: "next" | "prev") => {
    setCurrdeg((prevDegree) => prevDegree + (direction === "next" ? -60 : 60));
  };

  return (
    <div className="container mx-auto max-w-[1280px] px-4 pt-4 md:px-20">
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
              link1="your-link-1"
              link2="your-link-2"
              link3="your-link-3"
            />

            {/* 其他區塊的實例 */}
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
              link1="your-link-1"
              link2="your-link-2"
              link3="your-link-3"
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
              link1="your-link-1"
              link2="your-link-2"
              link3="your-link-3"
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
              link1="your-link-1"
              link2="your-link-2"
              link3="your-link-3"
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
              link1="your-link-1"
              link2="your-link-2"
              link3="your-link-3"
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
              link1="your-link-1"
              link2="your-link-2"
              link3="your-link-3"
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
