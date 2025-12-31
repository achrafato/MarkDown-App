'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import toast  from 'react-hot-toast';
import { Card } from '@/components/ui/card';

interface CommentsListProps {
  postId: number;
  comments: Array<{
    id: number;
    content: string;
    created_at: string;
    author: {
      name: string;
      email: string;
    };
    user_id: number;
  }>;
  currentUserId?: number;
}

export function CommentsList({
  postId,
  comments,
  currentUserId,
}: CommentsListProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const router = useRouter();

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId) {
      toast.error('You must be logged in to comment');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error('Failed to add comment');
        return;
      }

      toast.success('Comment added successfully');

      setContent('');
      router.refresh();
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error('Failed to delete comment');
        return;
      }

      toast.success('Comment deleted successfully');

      setCommentToDelete(null);
      router.refresh();
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
        {currentUserId ? (
          <form onSubmit={handleAddComment} className="space-y-4">
            <Textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isLoading}
              rows={4}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        ) : (
          <p className="text-gray-600">Please log in to comment</p>
        )}
      </Card>

      {comments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Comments ({comments.length})
          </h3>
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{comment.author.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
                {currentUserId === comment.user_id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <p className="mt-3 text-gray-700">{comment.content}</p>
            </Card>
          ))}
        </div>
      )}

      {comments.length === 0 && (
        <p className="text-gray-500 text-center">No comments yet. Be the first!</p>
      )}
    </div>
  );
}
