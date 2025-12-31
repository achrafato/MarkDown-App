import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { getPostById, updatePost, deletePost } from '@/lib/db/queries';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await getPostById(parseInt(id));

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const post = await getPostById(parseInt(id));

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.user_id !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { title, content, excerpt, published, category } = await req.json();
    var categoryFormatted = null;
    if (category !== null || category.trim() !== '') {
      categoryFormatted = category.charAt(0).toUpperCase() + category.toLowerCase().trim().slice(1)
    }
    const updatedPost = await updatePost(post.id, { title, content, excerpt, published, category: categoryFormatted });

    // Revalidate posts pages
    revalidatePath('/posts');
    revalidatePath(`/posts/${post.id}`);
    revalidatePath('/');

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const post = await getPostById(parseInt(id));

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.user_id !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const deleted = await deletePost(post.id);

    if (deleted) {
      // Revalidate posts pages
      revalidatePath('/posts');
      revalidatePath(`/posts/${post.id}`);
      revalidatePath('/');
      
      return NextResponse.json({ message: 'Post deleted' });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
