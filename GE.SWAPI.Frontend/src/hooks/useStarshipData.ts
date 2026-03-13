import { useState, useEffect, useCallback } from "react";
import { Starship, PagedResult } from "../types/Starship";

interface SortStatus {
  columnAccessor: string;
  direction: "asc" | "desc";
}

export const useStarshipData = (
  page: number,
  recordsPerPage: number,
  sortStatus: SortStatus | undefined
) => {
  const [starshipData, setStarshipData] = useState<Starship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchStarshipData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      let url = `${apiUrl}/starship/paged?page=${page}&pageSize=${recordsPerPage}`;
      
      if (sortStatus) {
        url += `&sortColumn=${sortStatus.columnAccessor}&sortDirection=${sortStatus.direction}`;
      }
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: PagedResult<Starship> = await response.json();
      setStarshipData(result.data);
      setTotalRecords(result.totalRecords);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch starship data",
      );
      console.error("Error fetching starship data:", err);
    } finally {
      setLoading(false);
    }
  }, [page, recordsPerPage, sortStatus]);

  useEffect(() => {
    fetchStarshipData();
  }, [fetchStarshipData]);

  return {
    starshipData,
    loading,
    error,
    totalRecords,
    refetch: fetchStarshipData,
  };
};
