import { Evaluation } from "./types";

type HomeEvaluationCardProps = {
  evaluation: Evaluation;
};

const HomeEvaluationCard: React.FC<HomeEvaluationCardProps> = ({
  evaluation,
}) => {
  return (
    <div className="max-w-sm overflow-hidden rounded bg-white shadow-lg">
      <div className="px-6 py-4">
        <img
          src={evaluation.reviewerPic}
          alt={`評論者：${evaluation.reviewerName}`}
          className="mb-2 w-full object-cover"
        />{" "}
        <div className="mb-4 border-t text-center text-xl font-bold">
          {evaluation.reviewerName}
        </div>
        <p className="text-center text-base text-gray-700">
          {evaluation.content}
        </p>
      </div>
      <div className="px-6 pb-2 pt-4">
        {Array.from({ length: evaluation.rating }).map((_, index) => (
          <span
            key={index}
            className="mb-2  inline-block  rounded-full py-1 text-sm font-semibold text-gray-700"
          >
            ⭐
          </span>
        ))}
      </div>
    </div>
  );
};

export default HomeEvaluationCard;
