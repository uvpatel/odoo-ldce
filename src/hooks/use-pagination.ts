import { useState, useMemo } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export interface UsePaginationOptions {
  totalItems: number;
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination({
  totalItems,
  initialPage = 1,
  initialPageSize = DEFAULT_PAGE_SIZE,
}: UsePaginationOptions) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / pageSize)), [totalItems, pageSize]);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const offset = (page - 1) * pageSize;

  const goToPage = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
  };

  const nextPage = () => {
    if (hasNextPage) setPage((prev) => prev + 1);
  };

  const previousPage = () => {
    if (hasPreviousPage) setPage((prev) => prev - 1);
  };

  return {
    page,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    offset,
    setPage: goToPage,
    setPageSize,
    nextPage,
    previousPage,
  };
}
