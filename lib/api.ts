import {
  Member,
  Content,
  CreateMemberInput,
  UpdateMemberInput,
  CreateContentInput,
  UpdateContentInput,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_MOCKAPI_URL || "";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const membersApi = {
  getAll: () => fetchApi<Member[]>("/members"),

  getById: (id: string) => fetchApi<Member>(`/members/${id}`),

  getByName: async (name: string): Promise<Member | null> => {
    const members = await fetchApi<Member[]>(`/members?name=${encodeURIComponent(name)}`);
    return members.find((m) => m.name === name) || null;
  },

  create: (data: CreateMemberInput) =>
    fetchApi<Member>("/members", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateMemberInput) =>
    fetchApi<Member>(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<Member>(`/members/${id}`, {
      method: "DELETE",
    }),
};

export const contentsApi = {
  getAll: () => fetchApi<Content[]>("/contents"),

  getById: (id: string) => fetchApi<Content>(`/contents/${id}`),

  create: (data: CreateContentInput) =>
    fetchApi<Content>("/contents", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateContentInput) =>
    fetchApi<Content>(`/contents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<Content>(`/contents/${id}`, {
      method: "DELETE",
    }),
};
