import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "./constants";
import type { PaginationMetadata, PaginationParams } from "@/types/pagination";

export function getPaginationParams(searchParams: URLSearchParams | Record<string, string | string[] | undefined>): {
  page: number;
  pageSize: number;
  offset: number;
} {
  const getParam = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || undefined;
    }
    const val = searchParams[key];
    return Array.isArray(val) ? val[0] : val;
  };

  const rawPage = parseInt(getParam("page") || "1", 10);
  const rawPageSize = parseInt(getParam("pageSize") || String(DEFAULT_PAGE_SIZE), 10);

  const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const pageSize = isNaN(rawPageSize) || rawPageSize < 1 ? DEFAULT_PAGE_SIZE : Math.min(rawPageSize, MAX_PAGE_SIZE);
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
}

export function createPaginationMetadata(total: number, page: number, pageSize: number): PaginationMetadata {
  const totalPages = Math.ceil(total / pageSize) || 1;
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
