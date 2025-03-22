import { IMessage } from './message';

export interface IChat {
    _id: string;
    participants: string[];
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
  }