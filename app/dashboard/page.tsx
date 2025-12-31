'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import toast  from 'react-hot-toast';
import type { Post } from '@/lib/db/queries';
import { Card, CardHeader } from "@/components/ui/card"
import AuthGuard from '@/components/auth-gard';
import { useUserStore } from '@/lib/store';

export default function DashboardPage() {

  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent () {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  const { user, updateUser, logout, isAuthenticated } = useUserStore()
  
  useEffect(() => {
    
    if (!user && isAuthenticated) {
      logout()
      router.push('/login');
      return;
    }
    async function fetchData() {
      try {
        const postsRes = await fetch('/api/posts');
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        }
      } catch (error) {
        toast.error('Failed to fetch data')
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  
  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Manage your blog posts</p>
      </div>

      <div className="mb-8">
        <Link href="/dashboard/new">
          <Button className="mb-6">Create New Post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't created any posts yet.</p>
          <Link href="/dashboard/new">
            <Button>Create Your First Post</Button>
          </Link>
        </Card>
      ) : (
        <>
        <Card>
            <CardHeader className="border-b">
                <div>
                  <div className="text-xl font-bold">Recent Posts</div>
                  <p className="text-sm text-muted-foreground mt-1">Your latest published articles</p>
                </div>
            </CardHeader>
            
            
            <div className="px-6 pt-6">
              <div className="space-y-4">
                {
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground transition-colors mb-1">
                          {post.title}
                        </h3>
                      <p className="text-sm text-muted-foreground">Status: {post.published ? '✓ Published' : '○ Draft'}</p>
                    </div>
                    <div className="space-x-2">
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Button variant="outline" size="sm" className='cursor-pointer'>
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>



        </>



      )}
    </div>
  );
}
