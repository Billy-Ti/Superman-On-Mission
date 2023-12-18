import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import HomeEvaluationCard from "./HomeEvaluationCard";
import { Evaluation, ReviewData, UserInfo } from "./types";
const fetchUsersInfoByIds = async (userIds: string[]): Promise<UserInfo[]> => {
  const usersCollectionRef = collection(db, "users");
  const users: UserInfo[] = [];

  for (const userId of userIds) {
    const userDoc = await getDocs(
      query(usersCollectionRef, where("userId", "==", userId)),
    );
    if (!userDoc.empty) {
      const userData = userDoc.docs[0].data();
      users.push({
        id: userDoc.docs[0].id,
        name: userData.name,
        profilePicUrl: userData.profilePicUrl || "",
      });
    } else {
      users.push({
        id: "未知",
        name: "未知用戶",
        profilePicUrl: "",
      });
    }
  }

  return users;
};

const fetchTopReviews = async (): Promise<ReviewData[]> => {
  const reviewsCollectionRef = collection(db, "reviews");
  let allReviews: ReviewData[] = [];

  for (let rating = 5; rating >= 1 && allReviews.length < 20; rating--) {
    const querySnapshot = await getDocs(
      query(reviewsCollectionRef, where("rating", "==", rating)),
    );
    const reviewsFromRating = querySnapshot.docs.map((doc) => ({
      userId: doc.data().ratedUser,
      content: doc.data().ratedComment,
      rating: doc.data().rating,
    }));
    allReviews = [...allReviews, ...reviewsFromRating];
  }

  return allReviews.slice(0, 20);
};

const EvaluationsGrid: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("开始获取评论数据");
      const reviews = await fetchTopReviews();
      console.log("评论数据获取完成：", reviews);
      // 可以根据需要获取用户信息
      const userIds = reviews.map((review) => review.userId); // 假设每个评论都有 userId
      console.log("userIds:", userIds); // 添加这行日志来检查 userIds
      const userInfo = await fetchUsersInfoByIds(userIds);
      console.log("用户信息：", userInfo);

      const combinedEvaluations = reviews.map((review, index) => {
        const user = userInfo.find((u) => u.id === review.userId); // 假设 UserInfo 有 id 字段
        return {
          id: `eval-${index}`,
          reviewerName: user ? user.name : "未知用戶",
          reviewerPic: user ? user.profilePicUrl : "",
          content: review.content || "暫無評價。",
          rating: review.rating,
        };
      });
      console.log("组合后的评估数据：", combinedEvaluations);

      setEvaluations(combinedEvaluations);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {evaluations.map((evaluation) => (
          <div
            key={evaluation.id}
            className="mb-4 h-full min-h-[200px] w-full break-inside-avoid" // 確保卡片填滿高度
          >
            <HomeEvaluationCard evaluation={evaluation} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationsGrid;
