'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast  from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import type { Post } from '@/lib/db/queries';

interface EditPostFormProps {
  post: Post;
  onSuccess?: () => void;
}

export function EditPostForm({ post, onSuccess }: EditPostFormProps) {
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt || '');
  const [category, setCategory] = useState(post.category || '');
  const [content, setContent] = useState(post.content);
  const [published, setPublished] = useState(post.published);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, excerpt, published, category }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || 'Failed to update post');
        return;
      }

      toast.success('Post updated successfully');

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input
            id="excerpt"
            placeholder="Brief summary of the post"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="e.g., Technology, Design, Business"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea
            id="content"
            placeholder="Write your post in Markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={isLoading}
            rows={10}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            disabled={isLoading}
          />
          <Label htmlFor="published">Publish this post</Label>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Card>
  );
}
