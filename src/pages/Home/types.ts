export interface Evaluation {
  id: string;
  reviewerName: string;
  reviewerPic: string;
  content: string;
  rating: number;
}

// 創建一個單獨的類型來表示從 reviews 集合中獲取 data
export interface ReviewData {
  content: string;
  rating: number;
}

export interface UserInfo {
  name: string;
  profilePicUrl: string;
}
