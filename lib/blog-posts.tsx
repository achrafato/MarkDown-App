import {User, getUsersWithPostCount} from "./db/queries";

export interface Author {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
}

export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  author: string
  category: string,
  updated_at?: string,
  tags: string[]
}


export async function getUsersWithCount(): Promise<(User & { postCount: number })[]> {
  const users = await getUsersWithPostCount();

  return users
}

