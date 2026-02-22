export type Rank = "bronze" | "silver" | "gold";

export type ContentRank = "guest" | "bronze" | "silver" | "gold";

export type Permission = "admin" | "content_manage";

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rank: Rank;
  permissions: Permission[];
  createdAt: string;
}

export interface Content {
  id: string;
  title: string;
  body: string;
  thumbnail: string;
  authorId: string;
  requiredRank: ContentRank;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberInput {
  name: string;
  email: string;
  avatar?: string;
  rank: Rank;
  permissions: Permission[];
}

export interface UpdateMemberInput {
  name?: string;
  email?: string;
  avatar?: string;
  rank?: Rank;
  permissions?: Permission[];
}

export interface CreateContentInput {
  title: string;
  body: string;
  thumbnail?: string;
  authorId: string;
  requiredRank: ContentRank;
}

export interface UpdateContentInput {
  title?: string;
  body?: string;
  thumbnail?: string;
  requiredRank?: ContentRank;
}
