'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EditPostForm } from '@/components/edit-post-form';
import { DeletePostButton } from '@/components/delete-post-button';
import { Card } from '@/components/ui/card';
import toast  from 'react-hot-toast';
import type { Post } from '@/lib/db/queries';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EditPostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) {
          toast.error('Post not found');
          router.push('/dashboard');
          return;
        }

        const data = await res.json();
        
        setPost(data);
      } catch (error) {
        toast.error('Failed to fetch post');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [postId, router]);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/dashboard">
        <Button variant="outline" className="mb-4 cursor-pointer">
            ← Back
        </Button>
      </Link>

      <EditPostForm
        post={post}
        onSuccess={() => {
          router.push('/dashboard');
        }}
      />
      <div className="mt-6">
        <DeletePostButton
          postId={post.id}
          onSuccess={() => {
            router.push('/dashboard');
          }}
        />
      </div>
    </div>
  );
}
