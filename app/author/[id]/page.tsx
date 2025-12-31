'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import toast  from 'react-hot-toast';

export default function AuthorPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const userId = params.id as string;

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        // Fetch user and their published posts
        const res = await fetch(`/api/authors/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setPosts(data.posts);
        } else {
          toast.error('Failed to load user profile');
        }
      } catch (error) {
        toast.error('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [userId]);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="outline" className="mb-6">
            ← Back
          </Button>
        </Link>
        <Card className="p-12 text-center">
          <p className="text-gray-600">User not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/">
        <Button variant="outline" className="mb-6">
          ← Back
        </Button>
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
        {user.bio && <p className="text-gray-600 text-lg">{user.bio}</p>}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">
          Articles by {user.name}
        </h2>

        {posts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No posts from this user yet.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="p-8">
                <Link
                  href={`/posts/${post.id}`}
                  className="hover:text-blue-600 transition"
                >
                  <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                </Link>
                <p className="text-gray-600 mb-4">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                {post.excerpt && (
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                )}
                <Link href={`/posts/${post.id}`}>
                  <Button variant="outline">Read More</Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}