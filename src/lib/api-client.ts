export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildQueryString(params?: QueryParams): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "") {
      searchParams.append(key, String(val));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(
  url: string,
  options?: RequestInit & { params?: QueryParams }
): Promise<T> {
  const { params, ...fetchOptions } = options || {};
  const finalUrl = `${url}${buildQueryString(params)}`;

  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(finalUrl, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    let errorData: unknown;
    let errorMessage = `HTTP error ${res.status}`;
    try {
      errorData = await res.json();
      if (
        errorData &&
        typeof errorData === "object" &&
        "error" in errorData &&
        typeof (errorData as { error: unknown }).error === "string"
      ) {
        errorMessage = (errorData as { error: string }).error;
      } else if (
        errorData &&
        typeof errorData === "object" &&
        "message" in errorData &&
        typeof (errorData as { message: unknown }).message === "string"
      ) {
        errorMessage = (errorData as { message: string }).message;
      }
    } catch {
      // Body not JSON
    }
    throw new ApiError(errorMessage, res.status, errorData);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(url: string, params?: QueryParams, init?: RequestInit) =>
    request<T>(url, { ...init, method: "GET", params }),

  post: <T>(url: string, data?: unknown, init?: RequestInit) =>
    request<T>(url, {
      ...init,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data?: unknown, init?: RequestInit) =>
    request<T>(url, {
      ...init,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(url: string, data?: unknown, init?: RequestInit) =>
    request<T>(url, {
      ...init,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string, init?: RequestInit) =>
    request<T>(url, { ...init, method: "DELETE" }),
};
