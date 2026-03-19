import { UserStatusEnum } from "../enums/userStatus.enum";
import { DefaultResponse, IFailure } from "./base.entity";
import { UserEntity } from "./user.entity";

export interface IChat {
    id?: string;
    participants: string[];
}

export interface IMessage {
    id?: string;
    chat: string;
    sender: string;
    senderName?: string;
    receiver: string;
    content: string;
}

export interface IUserChat {
    _id: string;
    participants: UserEntity[];
    lastMessage: string | null;
    contactStatus?: UserStatusEnum | null;
    newsMessagesCount?: number | null;
    createdAt: string;
    updatedAt: string;
}

export type UserChatsResponse = DefaultResponse<IUserChat[] | IFailure>;

export interface CreateChatEntity {
    _id: string;
    participants: string[];
    createdAt: string;
    updatedAt: string;
}

export type CreateChatResponse = DefaultResponse<CreateChatEntity | IFailure>;

export interface INewMessageNotification {
    chatId: string;
    content: string;
    senderName: string;
    senderId: string;
}
