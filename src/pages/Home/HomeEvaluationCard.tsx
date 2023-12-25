import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import { Evaluation } from "./types";

type HomeEvaluationCardProps = {
  evaluation: Evaluation;
  leftSide?: boolean;
};

const HomeEvaluationCard: React.FC<HomeEvaluationCardProps> = ({
  evaluation,
  leftSide = false,
}) => {
  const defaultProfilePic =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const props = useSpring({
    to: {
      opacity: inView ? 1 : 0,
      transform: inView
        ? "translateX(0)"
        : `translateX(${leftSide ? "-100%" : "100%"})`,
    },
    from: {
      opacity: 0,
      transform: `translateX(${leftSide ? "-100%" : "100%"})`,
    },
    config: { mass: 5, tension: 350, friction: 40 },
  });

  useEffect(() => {
    const checkIfInView = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setInView(true);
        }
      }
    };
    window.addEventListener("scroll", checkIfInView);
    checkIfInView();
    return () => window.removeEventListener("scroll", checkIfInView);
  }, []);

  return (
    <animated.div
      style={props}
      ref={ref}
      className="flex h-full flex-col justify-center overflow-hidden rounded bg-white shadow-lg md:w-full"
    >
      <div className="flex flex-col gap-4 ">
        {evaluation.reviewerPic &&
        evaluation.reviewerPic !== defaultProfilePic ? (
          <div className="h-[300px] overflow-hidden">
            <img
              src={evaluation.reviewerPic}
              alt={`評論者：${evaluation.reviewerName}`}
              className="mb-2 h-[300px] w-full transform rounded-md object-cover transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </div>
        ) : (
          <Icon
            className="mb-2 h-[300px] w-full transform rounded-md object-cover transition-transform duration-300 ease-in-out hover:scale-110"
            icon="mingcute:user-4-fill"
            color="#3178C6"
            width="40"
            height="40"
          />
        )}
        <div className="mb-2 text-center text-xl font-bold">
          {evaluation.reviewerName}
        </div>
        <p className="grow px-2 text-center text-base text-gray-700">
          {evaluation.content}
        </p>
      </div>
      <div className="mt-auto px-6 text-center">
        {Array.from({ length: evaluation.rating }).map((_, index) => (
          <span
            key={index}
            className="mb-2 inline-block rounded-full py-1 text-sm font-semibold text-gray-700"
          >
            ⭐
          </span>
        ))}
      </div>
    </animated.div>
  );
};

export default HomeEvaluationCard;
