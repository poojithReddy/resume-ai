const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

import { getToken, clearToken } from "./authUtil";

async function handleResponse(response: Response) {
  if (response.status === 401) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (response.status >= 500) {
    window.location.href = "/error";
    throw new Error("Server error");
  }

  if (!response.ok) {
    let errorMessage = "Request failed";

    try {
      const data = await response.json();

      if (data?.error?.message) {
        errorMessage = data.error.message;
      }

      else if (typeof data?.detail === "string") {
        errorMessage = data.detail;
      }

      else if (Array.isArray(data?.detail) && data.detail.length > 0) {
        errorMessage =
          data.detail
            .map((err: any) => err.msg)
            .filter(Boolean)
            .join(", ") || errorMessage;
      }
    } catch {
      // fallback if response is not JSON
    }

    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const apiClient = {
  get: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "GET",
      headers: getHeaders(),
    });

    return handleResponse(response);
  },

  post: async (url: string, body?: any) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse(response);
  },

  put: async (url: string, body?: any) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "PUT",
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse(response);
  },

  delete: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    return handleResponse(response);
  },
};