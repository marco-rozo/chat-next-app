import { DefaultResponse, IFailure } from "./base.entity";
import { UserEntity } from "./user.entity";

export interface AuthEntity {
  user: UserEntity;
  token: string;
}

export type AuthResponseEntity = DefaultResponse<AuthEntity | IFailure>;
