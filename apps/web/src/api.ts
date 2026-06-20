import type { AppUser } from './types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export function fetchDashboard() {
  return request<unknown>('/dashboard');
}

export function fetchAssistantReply(message: string) {
  return request<{ reply: string }>('/assistant', {
    method: 'POST',
    body: JSON.stringify({ message })
  });
}

export function registerUser(user: AppUser & { password: string; confirmPassword: string }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      password: user.password,
      confirmPassword: user.confirmPassword
    })
  });
}

export function fetchMe() {
  return request('/auth/me');
}
