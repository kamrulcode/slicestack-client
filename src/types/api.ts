export type ApiErrorBody = {
  error?: string;
  message?: string;
};

/** An error raised by the Express API, with the HTTP status attached. */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Set to false for public endpoints so no token is requested. */
  auth?: boolean;
  signal?: AbortSignal;
};

export type ApiFetcher = <T>(
  path: string,
  options?: ApiRequestOptions,
) => Promise<T>;
