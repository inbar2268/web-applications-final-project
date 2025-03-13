export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}