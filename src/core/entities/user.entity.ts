import { DefaultResponse, IFailure } from "./base.entity";

export interface UserEntity {
  id?: string;
  name: string;
  email: string;
}

export type UsersListResponse = DefaultResponse<UserEntity[] | IFailure>;

export type FindUserResponse = DefaultResponse<UserEntity | IFailure>;
