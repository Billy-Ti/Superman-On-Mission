import { getAuth, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebase";

interface Review {
  title: string; // 任務標題
  photo: string; // 任務照片
  rating: number; // 評分分數
  userName: string; // 使用者名稱
  status: string; // 任務狀態
  reviewTaskId: string; // 任務 ID
}

interface ReviewContentProps {
  showReviews: boolean;
}

const ReviewContent: React.FC<ReviewContentProps> = ({ showReviews }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const currentUser: User | null = getAuth().currentUser;

  const loadReviews = async () => {
    if (!currentUser) {
      console.log("No user is logged in");
      return;
    }

    const reviewsQuery = query(
      collection(db, "reviews"),
      showReviews
        ? where("ratedBy", "==", currentUser.uid)
        : where("ratedUser", "==", currentUser.uid),
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);

    const reviewsData: Review[] = await Promise.all(
      reviewsSnapshot.docs.map(async (reviewDoc) => {
        const reviewData = reviewDoc.data();
        console.log(reviewData.taskId);
        const taskRef = doc(db, "tasks", reviewData.reviewTaskId);
        const taskSnap = await getDoc(taskRef);
        const taskData = taskSnap.exists() ? taskSnap.data() : null;

        // 獲取評價發出者或接收者的名稱
        const userRef = doc(
          db,
          "users",
          showReviews ? reviewData.ratedUser : reviewData.ratedBy,
        );
        const userSnap = await getDoc(userRef);

        return {
          reviewTaskId: reviewData.reviewTaskId,
          taskId: reviewDoc.id,
          title: taskData?.title || "未知任務",
          photo: taskData?.photos?.[0] || "",
          rating: reviewData.rating,
          userName: userSnap.exists()
            ? userSnap.data()?.name || "未知用戶"
            : "未知用戶",
          status: taskData?.status || "未知狀態",
        };
      }),
    );

    setReviews(reviewsData);
  };

  useEffect(() => {
    loadReviews();
  }, [showReviews]);

  return (
    <div className="flex flex-1 px-2 sm:px-0">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="rounded-md p-4 shadow-lg">
            <Link
              to={`/acceptTaskDetail/${review.reviewTaskId}`}
              className="hover:smooth-hover hover:bg-white-700/80 group relative flex cursor-pointer flex-col items-center space-y-2 rounded-md bg-[#92afd6] px-4 py-10 sm:py-20"
            >
              <img
                src={review.photo}
                alt={review.title}
                className="mobject-covetext-lgr h-40 w-40 rounded-full object-cover"
              />
              <div className="flex items-center font-extrabold text-white">
                <h4 className="text-center text-xl font-bold capitalize">
                  任務 :
                </h4>
                <span className="ml-1 text-xl">{review.title}</span>
              </div>
              <div className="flex items-center font-extrabold text-white">
                <h4 className="text-center text-xl font-bold capitalize">
                  案主 :
                </h4>
                <span className="ml-1 text-xl">{review.userName}</span>
              </div>
              <div className="flex items-center font-extrabold text-white">
                <h4 className="text-center text-xl font-bold capitalize">
                  星星 :
                </h4>
                <span className="ml-1 text-xl">{review.rating}</span>
              </div>
              <p className="text-black-700 absolute top-2 inline-flex items-center text-lg font-bold">
                <span className="mr-2 block h-6 w-6 rounded-full bg-green-500 text-2xl group-hover:animate-pulse"></span>
                {review.status}
              </p>
            </Link>
          </div>
        ))
      ) : (
        <div className="text-xl font-semibold text-gray-600">目前沒有資料</div>
      )}
    </div>
  );
};

export default ReviewContent;
