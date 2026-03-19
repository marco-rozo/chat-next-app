export interface IFailure {
  errorCode: string;
  message: string;
}

export function isFailure(data: any): data is IFailure {
  return data && typeof data === 'object' && 'errorCode' in data && 'message' in data;
}

export interface DefaultResponse<T = any> {
  data: T;
}
