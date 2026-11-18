const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function readResponse(response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = Array.isArray(body?.detail)
      ? body.detail.map((item) => item.msg).join(", ")
      : body?.detail;
    throw new Error(detail || "Something went wrong. Please try again.");
  }
  return body;
}

export async function registerUser(user) {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return readResponse(response);
}

export async function loginUser({ email, password }) {
  const body = new URLSearchParams({ username: email, password });
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    credentials: "include",
  });
  return readResponse(response);
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/users/me`, { credentials: "include" });
  return readResponse(response);
}
