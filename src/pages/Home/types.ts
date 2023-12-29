export interface Evaluation {
  id: string;
  reviewerName: string;
  reviewerPic: string;
  content: string;
  rating: number;
}

export interface ReviewData {
  content: string;
  rating: number;
  userId: string;
}

export interface UserInfo {
  name: string;
  profilePicUrl: string;
  id: string;
}
