export function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearToken() {
  localStorage.removeItem("auth_token");
}

export function getUserFromToken(): any | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

export function getUserRole(): string | null {
  const user = getUserFromToken();
  return user?.role ?? null;
}

export function isTokenExpired(): boolean {
  const user = getUserFromToken();
  if (!user || !user.exp) return true;

  return user.exp * 1000 < Date.now();
}