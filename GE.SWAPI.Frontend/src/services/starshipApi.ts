import type { Starship, PagedResult } from "../types/Starship";

const getApiUrl = () => import.meta.env.VITE_API_URL;

export async function fetchStarships(params: {
  page: number;
  pageSize: number;
  sortColumn?: string;
  sortDirection?: string;
  searchTerm?: string;
}): Promise<PagedResult<Starship>> {
  const apiUrl = getApiUrl();
  let url = `${apiUrl}/starship/paged?page=${params.page}&pageSize=${params.pageSize}`;

  if (params.sortColumn) {
    url += `&sortColumn=${params.sortColumn}&sortDirection=${params.sortDirection}`;
  }
  if (params.searchTerm) {
    url += `&searchTerm=${encodeURIComponent(params.searchTerm)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function createStarship(data: Starship): Promise<void> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/starship`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function updateStarship(data: Starship): Promise<void> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/starship/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function deleteStarship(id: number): Promise<void> {
  const apiUrl = getApiUrl();
  const response = await fetch(`${apiUrl}/starship/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}
