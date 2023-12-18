import { Icon } from "@iconify/react";
import { Evaluation } from "./types";

type HomeEvaluationCardProps = {
  evaluation: Evaluation;
};

const HomeEvaluationCard: React.FC<HomeEvaluationCardProps> = ({
  evaluation,
}) => {
  const defaultProfilePic =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  console.log("评估卡片数据：", evaluation);
  return (
    <div className="flex h-full flex-col justify-center overflow-hidden rounded bg-white shadow-lg md:w-full">
      <div className="flex flex-col gap-4 overflow-hidden">
        {evaluation.reviewerPic &&
        evaluation.reviewerPic !== defaultProfilePic ? (
          <img
            src={evaluation.reviewerPic}
            alt={`評論者：${evaluation.reviewerName}`}
            className="mb-2 h-[300px] w-full transform rounded-md object-cover transition-transform duration-300 ease-in-out hover:scale-110"
          />
        ) : (
          <Icon
            className="mb-2 h-[300px] w-full transform rounded-md object-cover transition-transform duration-300 ease-in-out hover:scale-110"
            icon="mingcute:user-4-fill"
            color="#3178C6"
            width="40"
            height="40"
          />
        )}
        <div className="mb-2 border-t border-[#368dcf] text-center text-xl font-bold">
          {evaluation.reviewerName}
        </div>
        <p className="grow text-center text-base text-gray-700">
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
    </div>
  );
};

export default HomeEvaluationCard;
