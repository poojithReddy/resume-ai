const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user_id: string;
  email: string;
  token: string;
};

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (data?.error?.message) {
      return data.error.message;
    }

    if (Array.isArray(data?.detail) && data.detail.length > 0) {
      return data.detail[0]?.msg ?? "Request failed";
    }

    if (typeof data?.detail === "string") {
      return data.detail;
    }
  } catch {
    return "Request failed";
  }

  return "Request failed";
}

export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}