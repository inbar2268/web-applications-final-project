export interface IPost {
  title: string;
  content: string;
  userId: string;
  image: string;
  likedBy: string[];
  _id: string;
  commentsCount: number;
}
