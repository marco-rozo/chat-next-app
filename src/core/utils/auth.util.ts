import { TOKEN_KEY, USER_KEY, LOGOUT_IN_PROGRESS_KEY } from "../consts/auth.consts";
import { UserEntity } from "../entities/user.entity";
import { socketService } from "./socket.service";

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(LOGOUT_IN_PROGRESS_KEY);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const setUser = (user: UserEntity): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUser = (): UserEntity | null => {
  if (typeof window !== "undefined") {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson) as UserEntity;
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const removeUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
};

export const logout = (): void => {
  if (typeof window === "undefined") return;

  socketService.disconnect();
  removeToken();
  removeUser();
  sessionStorage.removeItem(LOGOUT_IN_PROGRESS_KEY);
  window.location.href = "/login";
};
