import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../config/firebase";
interface StarRatingProps {
  taskId: string;
  currentUserId: string;
  ratedUser: string;
  ratedStatus: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  taskId,
  currentUserId,
  ratedUser,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);

    if (taskSnap.exists()) {
      const taskData = taskSnap.data();
      const taskCost = taskData.cost;
      const review = {
        reviewTaskId: taskId,
        ratedBy: currentUserId,
        rating: rating,
        ratedAt: serverTimestamp(),
        ratedUser: ratedUser, // 被評價的用戶 ID
        ratedStatus: true, // 標記評價已完成
        ratedComment: comment, // 發案者評論
      };

      Swal.fire({
        title: "提交評價",
        html: `<strong style='color: #8D91AA;'>您將支付 ${taskCost} Super Coins</strong>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        reverseButtons: true,
        allowOutsideClick: false,
        background: "#DBE2EC",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const docRef = await addDoc(collection(db, "reviews"), review);
            console.log("Review submitted successfully, ID: ", docRef.id);
            Swal.fire({
              title: "已送出評價",
              text: "感謝您的反饋",
              icon: "success",
              timer: 1500,
              timerProgressBar: true,
              showConfirmButton: false,
              allowOutsideClick: false,
            });
            setComment("");
            navigate("/");
          } catch (error) {
            console.error("Error submitting review: ", error);
            Swal.fire({
              title: "發生錯誤",
              text: "無法提交評價",
              icon: "error",
              confirmButtonText: "好的",
            });
          }
        }
      });
    }
  };

  return (
    <>
      <div className="rating fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-400 bg-opacity-50">
        <div className="rounded-md-2xl mx-4 h-[600px] w-[500px] bg-slate-50 p-10 text-center shadow-lg md:mx-0 md:w-[600px]">
          <h3 className="mx-auto mb-3 text-3xl font-bold">請評價此次感受</h3>
          <div className="rating__stars mb-3 flex justify-center">
            <input
              id="rating-1"
              className="rating__input rating__input-1"
              type="radio"
              name="rating"
              defaultValue={1}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
            <input
              id="rating-2"
              className="rating__input rating__input-2"
              type="radio"
              name="rating"
              defaultValue={2}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
            <input
              id="rating-3"
              className="rating__input rating__input-3"
              type="radio"
              name="rating"
              defaultValue={3}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
            <input
              id="rating-4"
              className="rating__input rating__input-4"
              type="radio"
              name="rating"
              defaultValue={4}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
            <input
              id="rating-5"
              className="rating__input rating__input-5"
              type="radio"
              name="rating"
              defaultValue={5}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
            <label className="rating__label" htmlFor="rating-1">
              <svg
                className="rating__star"
                width={32}
                height={32}
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <ellipse
                  className="rating__star-shadow"
                  cx={16}
                  cy={31}
                  rx={16}
                  ry={1}
                />
                <g className="rating__star-body-g">
                  <path
                    className="rating__star-body"
                    d="M15.5,26.8l-8.2,4.3c-0.8,0.4-1.7-0.3-1.6-1.1l1.6-9.2c0.1-0.3-0.1-0.7-0.3-1l-6.7-6.5c-0.6-0.6-0.3-1.7,0.6-1.8l9.2-1.3c0.4-0.1,0.7-0.3,0.8-0.6L15,1.3c0.4-0.8,1.5-0.8,1.9,0l4.1,8.3c0.2,0.3,0.5,0.5,0.8,0.6l9.2,1.3c0.9,0.1,1.2,1.2,0.6,1.8L25,19.9c-0.3,0.2-0.4,0.6-0.3,1l1.6,9.2c0.2,0.9-0.8,1.5-1.6,1.1l-8.2-4.3C16.2,26.7,15.8,26.7,15.5,26.8z"
                  />
                </g>
              </svg>
              <span className="rating__sr">1 star</span>
            </label>
            <label className="rating__label" htmlFor="rating-2">
              <svg
                className="rating__star"
                width={32}
                height={32}
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <ellipse
                  className="rating__star-shadow"
                  cx={16}
                  cy={31}
                  rx={16}
                  ry={1}
                />
                <g className="rating__star-body-g">
                  <path
                    className="rating__star-body"
                    d="M15.5,26.8l-8.2,4.3c-0.8,0.4-1.7-0.3-1.6-1.1l1.6-9.2c0.1-0.3-0.1-0.7-0.3-1l-6.7-6.5c-0.6-0.6-0.3-1.7,0.6-1.8l9.2-1.3c0.4-0.1,0.7-0.3,0.8-0.6L15,1.3c0.4-0.8,1.5-0.8,1.9,0l4.1,8.3c0.2,0.3,0.5,0.5,0.8,0.6l9.2,1.3c0.9,0.1,1.2,1.2,0.6,1.8L25,19.9c-0.3,0.2-0.4,0.6-0.3,1l1.6,9.2c0.2,0.9-0.8,1.5-1.6,1.1l-8.2-4.3C16.2,26.7,15.8,26.7,15.5,26.8z"
                  />
                </g>
              </svg>
              <span className="rating__sr">2 stars</span>
            </label>
            <label className="rating__label" htmlFor="rating-3">
              <svg
                className="rating__star"
                width={32}
                height={32}
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <ellipse
                  className="rating__star-shadow"
                  cx={16}
                  cy={31}
                  rx={16}
                  ry={1}
                />
                <g className="rating__star-body-g">
                  <path
                    className="rating__star-body"
                    d="M15.5,26.8l-8.2,4.3c-0.8,0.4-1.7-0.3-1.6-1.1l1.6-9.2c0.1-0.3-0.1-0.7-0.3-1l-6.7-6.5c-0.6-0.6-0.3-1.7,0.6-1.8l9.2-1.3c0.4-0.1,0.7-0.3,0.8-0.6L15,1.3c0.4-0.8,1.5-0.8,1.9,0l4.1,8.3c0.2,0.3,0.5,0.5,0.8,0.6l9.2,1.3c0.9,0.1,1.2,1.2,0.6,1.8L25,19.9c-0.3,0.2-0.4,0.6-0.3,1l1.6,9.2c0.2,0.9-0.8,1.5-1.6,1.1l-8.2-4.3C16.2,26.7,15.8,26.7,15.5,26.8z"
                  />
                </g>
              </svg>
              <span className="rating__sr">3 stars</span>
            </label>
            <label className="rating__label" htmlFor="rating-4">
              <svg
                className="rating__star"
                width={32}
                height={32}
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <ellipse
                  className="rating__star-shadow"
                  cx={16}
                  cy={31}
                  rx={16}
                  ry={1}
                />
                <g className="rating__star-body-g">
                  <path
                    className="rating__star-body"
                    d="M15.5,26.8l-8.2,4.3c-0.8,0.4-1.7-0.3-1.6-1.1l1.6-9.2c0.1-0.3-0.1-0.7-0.3-1l-6.7-6.5c-0.6-0.6-0.3-1.7,0.6-1.8l9.2-1.3c0.4-0.1,0.7-0.3,0.8-0.6L15,1.3c0.4-0.8,1.5-0.8,1.9,0l4.1,8.3c0.2,0.3,0.5,0.5,0.8,0.6l9.2,1.3c0.9,0.1,1.2,1.2,0.6,1.8L25,19.9c-0.3,0.2-0.4,0.6-0.3,1l1.6,9.2c0.2,0.9-0.8,1.5-1.6,1.1l-8.2-4.3C16.2,26.7,15.8,26.7,15.5,26.8z"
                  />
                </g>
              </svg>
              <span className="rating__sr">4 stars</span>
            </label>
            <label className="rating__label" htmlFor="rating-5">
              <svg
                className="rating__star"
                width={32}
                height={32}
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <ellipse
                  className="rating__star-shadow"
                  cx={16}
                  cy={31}
                  rx={16}
                  ry={1}
                />
                <g className="rating__star-body-g">
                  <path
                    className="rating__star-body"
                    d="M15.5,26.8l-8.2,4.3c-0.8,0.4-1.7-0.3-1.6-1.1l1.6-9.2c0.1-0.3-0.1-0.7-0.3-1l-6.7-6.5c-0.6-0.6-0.3-1.7,0.6-1.8l9.2-1.3c0.4-0.1,0.7-0.3,0.8-0.6L15,1.3c0.4-0.8,1.5-0.8,1.9,0l4.1,8.3c0.2,0.3,0.5,0.5,0.8,0.6l9.2,1.3c0.9,0.1,1.2,1.2,0.6,1.8L25,19.9c-0.3,0.2-0.4,0.6-0.3,1l1.6,9.2c0.2,0.9-0.8,1.5-1.6,1.1l-8.2-4.3C16.2,26.7,15.8,26.7,15.5,26.8z"
                  />
                </g>
              </svg>
              <span className="rating__sr">5 stars</span>
            </label>
          </div>
          <div className="flex flex-col items-center">
            <textarea
              className="rounded-md-2xl mb-10 resize-none p-4 text-xl focus:outline-none"
              name="ratedComment"
              cols={30}
              rows={10}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="請給接案者一點回饋，好讓下次做得更好唷~"
            ></textarea>
            <button
              onClick={handleSubmit}
              type="button"
              className="w-1/3 rounded-md bg-blue-500 p-6 text-2xl font-extrabold text-white transition-colors hover:bg-[#355c7d]"
            >
              送出評價
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StarRating;
