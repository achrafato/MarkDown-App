'use server'

import {searchPosts} from "@/lib/db/queries"

// This function runs on the server and sends clean JSON to the client
export async function searchPostsAction(query: string) {
  if (!query) return [];

  // 1. Get posts
  const posts = await searchPosts(query);

  return posts;
}