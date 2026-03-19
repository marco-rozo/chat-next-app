import { AUTH_HEADER, BEARER } from "../consts/auth.consts";
import { isFailure } from "../entities/base.entity";
import { getToken } from "../utils/auth.util";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class BackendClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const token = getToken();
    const baseHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      baseHeaders[AUTH_HEADER] = `${BEARER} ${token}`;
    }

    return {
      ...baseHeaders,
      ...customHeaders,
    };
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: "GET",
      headers: this.getHeaders(options?.headers),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: "POST",
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: "PUT",
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: "DELETE",
      headers: this.getHeaders(options?.headers),
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (err) {
        throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
      }

      console.log(JSON.stringify(errorData));

      let errorMessage = `Erro HTTP: ${response.status}`;

      if (errorData.data) {
        if (isFailure(errorData.data)) {
          return errorData as T;
        } else if (typeof errorData.data === "string") {
          errorMessage = errorData.data;
        }
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }

      throw new Error(errorMessage);
    }

    // Retorna string vazia ou objeto dependendo do tipo da resposta (ex: 204 No Content)
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return {} as T;
    }

    return response.json();
  }
}

export const backendClient = new BackendClient();
