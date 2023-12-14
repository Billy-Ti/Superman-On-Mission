import { Icon } from "@iconify/react/dist/iconify.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
import Pagination from "../../components/Pagination";
import { db } from "../../config/firebase";
import DisplaySwitchButton from "../components/DisplaySwitchButton";
interface Review {
  title: string;
  photo: string;
  rating: number;
  userName: string;
  status: string;
  reviewTaskId: string;
}

const ReviewContent = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [reviewsPerPage] = useState(6); // 每頁顯示6條評價
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        loadReviews(user.uid);
      } else {
        // Handle user not logged in
      }
    });
  }, [showReviews, currentPage]);

  const loadReviews = async (userId: string) => {
    const reviewsCol = collection(db, "reviews");
    const condition = showReviews ? "ratedBy" : "ratedUser";
    const q = query(reviewsCol, where(condition, "==", userId));

    const querySnapshot = await getDocs(q);
    const loadedReviews: Review[] = [];

    for (const docSnapshot of querySnapshot.docs) {
      const reviewData = docSnapshot.data();
      const taskDocRef = doc(db, "tasks", reviewData.reviewTaskId);
      const taskDoc = await getDoc(taskDocRef);
      const taskData = taskDoc.data();

      const userDocRef = doc(db, "users", reviewData.ratedBy);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      loadedReviews.push({
        title: taskData?.title || "Unknown Task",
        photo: taskData?.photos?.[0] || "",
        rating: reviewData.rating,
        userName: userData?.name || "Unknown User",
        status: taskData?.status || "Unknown Status",
        reviewTaskId: reviewData.reviewTaskId,
      });
    }

    setReviews(loadedReviews);
  };

  // 獲取當前頁的評價
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // 更改頁碼
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleToggleDisplay = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowReviews(event.target.checked);
  };

  const renderRatingStars = (rating: number) => {
    return [...Array(rating)].map((_, index) => (
      <Icon
        key={index}
        icon="mingcute:star-fill"
        color="#ffc107"
        width="20"
        height="20"
        className="mr-2 flex cursor-pointer"
      />
    ));
  };

  return (
    <div className="container mx-auto">
      <DisplaySwitchButton
        onToggleUrgent={handleToggleDisplay}
        buttonText="顯示已給予的評價"
        className="mb-4"
      />
      <Pagination
        tasksPerPage={reviewsPerPage}
        totalTasks={reviews.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentReviews.length > 0 ? (
          currentReviews.map((review, index) => (
            <div key={index} className="rounded-md p-4 shadow-lg">
              <Link
                to={`/acceptTaskDetail/${review.reviewTaskId}`}
                className="hover:bg-white-700/80 group relative flex h-full w-full cursor-pointer flex-col items-center mt-2 rounded-md bg-[#92afd6] px-4 py-10 sm:py-20"
              >
                <img
                  src={review.photo}
                  alt={review.title}
                  className="mobject-covetext-lgr h-40 w-40 rounded-full object-cover"
                />
                <div className="flex w-full items-center justify-center font-extrabold">
                  <span className="block truncate text-center text-xl font-semibold">
                    {review.title}
                  </span>
                </div>
                <div className="flex items-center justify-center font-extrabold">
                  <div className="flex">{renderRatingStars(review.rating)}</div>
                </div>
                <p className="text-black-700 absolute top-0 inline-flex items-center text-lg font-bold">
                  <span className="mr-2 block h-6 w-6 rounded-full bg-green-500 text-2xl group-hover:animate-pulse"></span>
                  {review.status}
                </p>
                {/* 遮罩層 */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-xl font-bold text-white">
                    查看評價資訊
                  </span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-lg font-semibold text-gray-600">
            <p>目前尚未得到評價</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewContent;
