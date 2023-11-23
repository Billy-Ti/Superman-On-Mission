import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | undefined>(undefined);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleMouseOver = (rate: number) => {
    setHoverRating(rate);
  };

  const handleMouseLeave = () => {
    setHoverRating(undefined);
  };

  const handleSubmit = () => {
    onSubmit(rating);
    onClose(); // 關閉模態視窗
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded bg-white p-6 mx-4 md:mx-0 shadow-lg w-[500px] md:w-[800px]">
        <div className="mx-auto flex  items-center justify-between ">
          <h3 className="mx-auto text-3xl font-bold">請評價此次感受</h3>
          <button onClick={onClose}>X</button>
        </div>
        <div className="my-4 flex justify-center">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => handleRating(ratingValue)}
                  className="hidden"
                />
                <Icon
                  icon="mingcute:star-fill"
                  onMouseOver={() => handleMouseOver(ratingValue)}
                  onMouseLeave={handleMouseLeave}
                  color={
                    ratingValue <= (hoverRating || rating)
                      ? "#ffc107"
                      : "#e4e5e9"
                  }
                  width="45"
                  height="45"
                  className="mr-2 flex cursor-pointer"
                />
              </label>
            );
          })}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        >
          送出
        </button>
      </div>
    </div>
  ) : null;
};

export default RatingModal;
