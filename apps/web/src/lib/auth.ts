import { apiClient } from "./apiClient";
import { setToken } from "./authUtil";

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

export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  const data = await apiClient.post("/auth/signup", payload);
  setToken(data.token);
  return data;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const data = await apiClient.post("/auth/login", payload);
  setToken(data.token);
  return data;
}