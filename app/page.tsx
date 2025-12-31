'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import toast  from 'react-hot-toast';
import { BlogCard } from '@/components/blog-card';
import {marked} from "marked";
import Loading from '@/components/loading';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Try to fetch current user
        const userRes = await fetch('/api/auth/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }

        // Fetch published posts
        const postsRes = await fetch('/api/posts/published?page=1&limit=10');
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        }
      } catch (error) {
        toast.error('An error occurred while loading data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [toast]);

  return (
    <div className="min-h-screen">

      <main className="container m-auto px-4 py-12">
        <div className="mb-20 bg-[#ddddddd]">
          <h2 className="text-5xl font-bold mb-4">Welcome to Blog Hub</h2>
          <p className="text-xl text-gray-600">
            Discover articles and stories from our community
          </p>
        </div>

        {isLoading ? (
          <Loading />
        ) : posts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No posts yet. Check back soon!</p>
            {user && (
              <Link href="/dashboard/new">
                <Button>Write the first post</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} author={post.author} />
            ))}
        </div>
        )}
      </main>
    </div>
  );
}
