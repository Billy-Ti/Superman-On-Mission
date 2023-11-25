import { getAuth } from "firebase/auth";
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
  title: string;
  photo: string;
  rating: number;
  userName: string;
  status: string;
  taskId: string; // 點擊後要導航到當初接案的 taskId 頁
}

const ReviewContent = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const loadReviews = async () => {
    if (!currentUser) {
      console.log("No user is logged in");
      return;
    }
    const tasksQuery = query(
      collection(db, "tasks"),
      where("acceptedBy", "==", currentUser.uid),
      where("status", "==", "已完成"),
    );
    const tasksSnapshot = await getDocs(tasksQuery);
    const reviewsData = [];

    for (const taskDoc of tasksSnapshot.docs) {
      const taskData = taskDoc.data();
      // 獲取發案者姓名
      const userRef = doc(db, "users", taskData.createdBy);
      const userSnap = await getDoc(userRef);
      const userName = userSnap.exists() ? userSnap.data().name : "未知用戶";

      // 獲取評價信息
      const reviewQuery = query(
        collection(db, "reviews"),
        where("reviewTaskId", "==", taskDoc.id),
      );
      const reviewSnapshot = await getDocs(reviewQuery);
      const reviewData =
        reviewSnapshot.docs.length > 0 ? reviewSnapshot.docs[0].data() : null;

      reviewsData.push({
        taskId: taskDoc.id,
        title: taskData.title,
        photo: taskData.photos[0],
        rating: reviewData ? reviewData.rating : 0,
        userName,
        status: taskData.status,
      });
      console.log(taskData.status);
    }

    setReviews(reviewsData);
  };

  useEffect(() => {
    loadReviews();
  }, [currentUser]);
  return (
    <div className="flex-1 px-2 sm:px-0">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-extrabold text-white">我的評價</h3>
      </div>
      <div className="mb-10 mt-10 grid grid-cols-1 gap-4 sm:mb-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {reviews.map((review, index) => (
          <Link
            to={`/acceptTaskDetail/${review.taskId}`}
            key={index}
            className="hover:smooth-hover hover:bg-white-700/80 group relative flex cursor-pointer flex-col items-center space-y-2 rounded-md bg-[#92afd6] px-4 py-10 sm:py-20"
          >
            <img
              className="object-covetext-lgr h-40 w-40 rounded-full object-cover"
              src={review.photo}
              alt={review.title}
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
        ))}
      </div>
    </div>
  );
};

export default ReviewContent;
