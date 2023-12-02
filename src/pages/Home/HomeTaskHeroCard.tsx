import { Icon } from "@iconify/react";
import { useState } from "react";

const HomeTaskHeroCard: React.FC = () => {
  const [currdeg, setCurrdeg] = useState(0);

  const rotate = (direction: "next" | "prev") => {
    setCurrdeg((prevDegree) => prevDegree + (direction === "next" ? -60 : 60));
  };

  return (
    <>
      <div className="relative mb-20">
        <div className="container relative mx-[auto] my-[0] h-[200px] w-[250px] [perspective:1000px]">
          <div
            className="carousel absolute h-full w-full [transform-style:preserve-3d] [transition:transform_1s]"
            style={{
              transform: `rotateY(${currdeg}deg)`,
            }}
          >
            <div className="absolute block h-52 w-64 rounded-[10px] bg-[#bfdbfe] text-center text-[5em] text-white opacity-95 [transform:rotateY(0deg)_translateZ(250px)]">
              A
            </div>
            <div className="absolute block h-52 w-64 rounded-[10px] bg-[#f7f4f0] text-center text-[5em] text-white opacity-95 [transform:rotateY(60deg)_translateZ(250px)]">
              B
            </div>
            <div className="absolute block h-52 w-64 rounded-[10px] bg-[#d5adfd] text-center text-[5em] text-white opacity-95 [transform:rotateY(120deg)_translateZ(250px)]">
              C
            </div>
            <div className="absolute block h-52 w-64 rounded-[10px] bg-[#bfdbfe] text-center text-[5em] text-white opacity-95 [transform:rotateY(180deg)_translateZ(250px)]">
              D
            </div>
            <div className="absolute block h-52 w-64 rounded-[10px] bg-[#f7f4f0] text-center text-[5em] text-white opacity-95 [transform:rotateY(240deg)_translateZ(250px)]">
              E
            </div>
            <div className="absolute block h-52 w-64 rounded-[10px] bg-[#d5adfd] text-center text-[5em] text-white opacity-95 [transform:rotateY(300deg)_translateZ(250px)]">
              F
            </div>
          </div>
        </div>

        <button
          type="button"
          className="next absolute bottom-0 right-[10%] top-0 mx-auto bg-transparent"
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
          className="next absolute bottom-0 left-[10%] top-0 mx-auto bg-transparent"
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
    </>
  );
};

export default HomeTaskHeroCard;
