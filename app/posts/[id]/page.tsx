import { notFound } from 'next/navigation';
import Link from 'next/link';
import { marked } from 'marked';
import { CommentsList } from '@/components/comments-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import type { Post } from '@/lib/db/queries';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { getPostById, updatePost, deletePost } from '@/lib/db/queries';
import { getAllPublishedPosts } from '@/lib/db/queries';
import { getPostComments } from '@/lib/db/queries';


// Configure marked using the new API
marked.use({
  renderer: {
    code(code, language) {
      if (language && hljs.getLanguage(language)) {
        try {
          return `<pre><code class="hljs language-${language}">${
            hljs.highlight(code, { language }).value
          }</code></pre>`;
        } catch (err) {
          console.error(err);
        }
      }
      return `<pre><code class="hljs">${
        hljs.highlightAuto(code).value
      }</code></pre>`;
    }
  }
});

interface PostWithAuthor extends Post {
  author: {
    id: number;
    email: string;
    name: string;
    bio: string | null;
  };
}


export async function generateStaticParams() {
  const posts = await getAllPublishedPosts();
  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(parseInt(id));
  const currentUser = await getCurrentUser();

  if (!post) {
    notFound();
  }

  const comments = await getPostComments(post.id);
  const htmlContent = await marked(post.content);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article>
        <header className="mb-8">
          <Link href="/posts">
            <Button variant="outline" className="mb-4">
              ← Back
            </Button>
          </Link>
          <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-gray-600">
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <Link href={`/author/${post.author.id}`}>
              <Button variant="link" className="h-auto p-0">
                By {post.author.name}
              </Button>
            </Link>
          </div>
        </header>

        <Card className="p-8 mb-12">
          <div
            dangerouslySetInnerHTML={{ __html: htmlContent as string }}
            className="markdown-body prose prose-sm max-w-none"
          />
        </Card>
      </article>

      <hr className="my-12" />

      <CommentsList
        postId={post.id}
        comments={comments}
        currentUserId={currentUser?.userId}
      />
    </div>
  );
}
