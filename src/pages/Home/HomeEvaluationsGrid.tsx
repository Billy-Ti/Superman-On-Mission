import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import HomeEvaluationCard from "./HomeEvaluationCard";
import { Evaluation, ReviewData, UserInfo } from "./types";

const fetchRatedUserIds = async (): Promise<string[]> => {
  const reviewsCollectionRef = collection(db, "reviews");
  const snapshot = await getDocs(reviewsCollectionRef);
  return snapshot.docs.map((doc) => doc.data().ratedUser);
};

const fetchUsersInfoByIds = async (userIds: string[]): Promise<UserInfo[]> => {
  const usersCollectionRef = collection(db, "users");
  const snapshot = await getDocs(usersCollectionRef);
  const usersMap = new Map<string, UserInfo>();
  snapshot.docs.forEach((doc) => {
    const userData = doc.data();
    usersMap.set(doc.id, {
      name: userData.name,
      profilePicUrl: userData.profilePicUrl || "",
    });
  });

  return userIds.map(
    (userId) => usersMap.get(userId) || { name: "未知用戶", profilePicUrl: "" },
  );
};

const fetchReviews = async (): Promise<ReviewData[]> => {
  const reviewsCollectionRef = collection(db, "reviews");
  const snapshot = await getDocs(reviewsCollectionRef);
  return snapshot.docs.map((doc) => ({
    content: doc.data().ratedComment,
    rating: doc.data().rating,
  }));
};

const EvaluationsGrid: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userIds = await fetchRatedUserIds();
      const userInfo = await fetchUsersInfoByIds(userIds);
      const reviews = await fetchReviews();

      const combinedEvaluations = reviews.map((review, index) => {
        const user = userInfo[index];
        return {
          id: `eval-${index}`, // 或者從 review/doc 中獲取實際的 ID
          reviewerName: user ? user.name : "未知用戶",
          reviewerPic: user ? user.profilePicUrl : "",
          content: review.content || "暫無評價。",
          rating: review.rating,
        };
      });

      setEvaluations(combinedEvaluations);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto max-w-[1280px] px-4 md:px-20">
      <div style={{ columnCount: 4, columnGap: "1rem" }}>
        {evaluations.map((evaluation, index) => (
          <div
            key={evaluation.id}
            style={{
              breakInside: "avoid",
              marginBottom: "1rem",
              minHeight: `${100 + (index % 5) * 20}px`,
            }}
          >
            <HomeEvaluationCard evaluation={evaluation} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationsGrid;
