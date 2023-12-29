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
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { db } from "../../utils/firebase";
import DisplaySwitchButton from "../components/DisplaySwitchButton";
interface Review {
  title: string;
  photo: string;
  rating: number;
  userName: string;
  status: string;
  reviewTaskId: string;
  reviewedUserName: string;
}

const renderRatingStars = (rating: number) => {
  return [...Array(rating)].map((_, index) => (
    <Icon
      key={index}
      icon="mingcute:star-fill"
      color="#ffc107"
      width="20"
      height="20"
      className="mr-2 flex"
    />
  ));
};
const ReviewContent = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [reviewsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        loadReviews(user.uid);
      }
    });
  }, [showReviews]);
  const loadReviews = useCallback(
    async (userId: string) => {
      setIsLoading(true);

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

        const reviewedUserDocRef = doc(db, "users", reviewData.ratedUser);
        const reviewedUserDoc = await getDoc(reviewedUserDocRef);
        const reviewedUserData = reviewedUserDoc.data();

        loadedReviews.push({
          title: taskData?.title || "Unknown Task",
          photo: taskData?.photos?.[0] || "",
          rating: reviewData.rating,
          userName: userData?.name || "Unknown User",
          status: taskData?.status || "Unknown Status",
          reviewTaskId: reviewData.reviewTaskId,
          reviewedUserName: reviewedUserData?.name || "Unknown User",
        });
      }
      setReviews(loadedReviews);
      setIsLoading(false);
    },
    [showReviews],
  );

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleToggleDisplay = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowReviews(event.target.checked);
      setCurrentPage(1);
    },
    [],
  );

  return (
    <div className="container mx-auto">
      <div className="mb-10 flex items-center">
        <svg
          className="h-5 w-5 sm:h-10 sm:w-10"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M9.153 5.408C10.42 3.136 11.053 2 12 2c.947 0 1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182c.28.213.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776c.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18c-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506c-.766.582-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452c-.347 0-.674.15-1.328.452l-.596.274c-2.303 1.06-3.455 1.59-4.22 1.01c-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46c-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882c.293-.941 1.523-1.22 3.983-1.776l.636-.144c.699-.158 1.048-.237 1.329-.45c.28-.213.46-.536.82-1.182z"
          />
        </svg>
        <span className="p-2 text-3xl font-bold">我的評價</span>
      </div>
      <div className="flex">
        <span className="mr-2 h-8 w-2 bg-[#368DCF]"></span>
        <DisplaySwitchButton
          onToggleUrgent={handleToggleDisplay}
          buttonText="顯示已給他人的評價"
          className="mb-4"
        />
      </div>
      <Pagination
        tasksPerPage={reviewsPerPage}
        totalTasks={reviews.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 lg:grid-cols-3">
          {currentReviews.length > 0 ? (
            currentReviews.map((review) => (
              <div
                key={review.reviewTaskId}
                className="border-gradient relative flex flex-col rounded-md border-2 border-gray-200 bg-white p-4 shadow-xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
              >
                <p className="text-black-700 flex items-center justify-center text-lg font-bold">
                  <span className="mr-2 block h-6 w-6 rounded-full bg-green-500 text-2xl"></span>
                  {review.status}
                </p>
                <div className="mt-4 h-64 overflow-hidden">
                  <img
                    src={review.photo}
                    alt={review.title}
                    className="h-full w-full rounded-md object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                  />
                </div>
                <div className="mb-4 mt-4 line-clamp-1 grow text-center text-xl font-semibold">
                  {review.title}
                </div>
                <div className="mb-4 text-center text-lg font-medium">
                  <p>給 {review.reviewedUserName} 的評價</p>
                </div>
                <div className="mb-4 mt-2 flex justify-center">
                  {renderRatingStars(review.rating)}
                </div>
                <Link
                  to={`/detail/${review.reviewTaskId}`}
                  type="button"
                  className="mt-auto flex items-center justify-center rounded-md bg-[#368DCF] p-3 text-xl font-medium text-white transition duration-500 ease-in-out hover:bg-[#2b79b4]"
                >
                  <Icon
                    icon="icon-park:click-tap"
                    className="mr-2 inline-block h-6 w-6 text-black hover:text-white"
                  />
                  查看評價資訊
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-1 mt-10 h-64 border border-[#368DCF] md:col-span-2 lg:col-span-3">
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-center text-lg font-semibold">
                  尚未得到別人的評價
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewContent;
