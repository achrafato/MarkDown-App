import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Post } from '@/lib/db/queries';

interface PostWithAuthor extends Post {
  author: {
    id: number;
    email: string;
    name: string;
    bio: string | null;
  };
}

async function getPosts(): Promise<PostWithAuthor[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts/published?limit=100`, {
      next: { revalidate: 60 }, // ISR - revalidate every 60 seconds
    });
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">Blog Posts</h1>
        <p className="text-xl text-gray-600">
          Discover articles from our community
        </p>
      </div>

      {posts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">No posts published yet.</p>
        </Card>
      ) : (
        <div className="space-y-6 mb-8">
          {posts.map((post) => (
            <Card key={post.id} className="p-8">
              <Link
                href={`/posts/${post.id}`}
                className="hover:text-blue-600 transition"
              >
                <h2 className="text-3xl font-bold mb-2">{post.title}</h2>
              </Link>

              <div className="flex items-center justify-between text-gray-600 mb-4">
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <Link href={`/author/${post.author.id}`}>
                  <Button variant="link" className="h-auto p-0">
                    By {post.author.name}
                  </Button>
                </Link>
              </div>

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
  );
}
