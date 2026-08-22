export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedApiResponse<T = unknown> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
  statusCode?: number;
}
