'use client';

import { useRouter } from 'next/navigation';
import { CreatePostForm } from '@/components/create-post-form';

export default function NewPostPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <CreatePostForm
        onSuccess={() => {
          router.push('/dashboard');
        }}
      />
    </div>
  );
}
