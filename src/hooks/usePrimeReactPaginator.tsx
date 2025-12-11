import { useState, useEffect, useMemo } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import type { UsePaginationReturn } from "./usePagination";

/**
 * Creates a PrimeReact paginator template from pagination hook
 * 
 * @example
 * const pagination = usePagination({ ... });
 * const paginatorTemplate = usePrimeReactPaginator(pagination);
 * 
 * <DataTable paginatorTemplate={paginatorTemplate} ... />
 */
export function usePrimeReactPaginator(pagination: UsePaginationReturn) {
  const [jumpPage, setJumpPage] = useState( pagination.currentPage);

  useEffect(() => {
    setJumpPage(pagination.currentPage);
  }, [pagination.currentPage]);

  return useMemo(() => ({
    layout: "FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink JumpToPageInput",
    
    FirstPageLink: () => (
      <button
        type="button"
        onClick={pagination.firstPage}
        disabled={pagination.isFirstPage}
        className="p-3 text-sm"
      >
        First
      </button>
    ),
    
    PrevPageLink: () => (
      <button
        type="button"
        onClick={pagination.prevPage}
        disabled={!pagination.hasPrevPage}
        className="p-3 text-sm"
      >
        Previous
      </button>
    ),
    
    CurrentPageReport: () => (
      <span 
        className="mx-3" 
        style={{ color: "var(--text-color)", userSelect: "none" }}
      >
        ({pagination.currentPage} / {pagination.totalPages})
      </span>
    ),
    
    JumpToPageInput: () => (
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: "black", userSelect: "none" }}>
          Go to page
        </span>
        <InputNumber
          className="ml-1 text-sm"
          min={1}
          max={pagination.totalPages}
          value={jumpPage}
          onValueChange={(e) => setJumpPage(e.value || 1)}
          disabled={pagination.totalPages <= 1}
        />
        <Button
          severity="danger"
          className="p-button-secondary text-sm"
          onClick={() => pagination.goToPage(jumpPage)}
          label="Go"
          disabled={pagination.totalPages <= 1 || jumpPage === pagination.currentPage}
        />
      </div>
    ),
    
    NextPageLink: () => (
      <button
        type="button"
        onClick={pagination.nextPage}
        disabled={!pagination.hasNextPage}
        className="p-3 text-sm"
      >
        Next
      </button>
    ),
    
    LastPageLink: () => (
      <button
        type="button"
        onClick={pagination.lastPage}
        disabled={pagination.isLastPage}
        className="p-3 text-sm"
      >
        Last
      </button>
    ),
  }), [pagination, jumpPage]);
}
