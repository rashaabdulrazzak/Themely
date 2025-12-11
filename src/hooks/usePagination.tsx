import { useState, useCallback, useEffect } from "react";
import type { IPagination } from "../modules";


export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  onPageChange?: (page: number) => void | Promise<void>;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setLimit: (limit: number) => void;
  updatePagination: (pagination: IPagination) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const { initialPage = 1, initialLimit = 10, onPageChange } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [totalItems, setTotalItems] = useState(0);

  const updatePagination = useCallback((pagination: IPagination) => {
    setCurrentPage(pagination.page);
    setTotalPages(pagination.totalPages);
    setLimit(pagination.limit);
    setTotalItems(pagination.totalItems);
  }, []);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.min(Math.max(page, 1), totalPages || 1);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
    }
  }, [currentPage, totalPages]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);
  const firstPage = useCallback(() => goToPage(1), [goToPage]);
  const lastPage = useCallback(() => goToPage(totalPages), [totalPages, goToPage]);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  useEffect(() => {
    if (onPageChange) {
      onPageChange(currentPage);
    }
  }, [currentPage, onPageChange]);

  return {
    currentPage,
    totalPages,
    limit,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setLimit,
    updatePagination,
    hasNextPage,
    hasPrevPage,
    isFirstPage,
    isLastPage,
  };
}