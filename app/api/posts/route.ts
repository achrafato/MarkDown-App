import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { createPost, getUserPosts } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { title, content, excerpt, category, published } = await req.json();

    if (!title || !content || !excerpt || !category) {
      return NextResponse.json(
        { error: 'All inputs are required' },
        { status: 400 }
      );
    }
    let catergoryLower = category.toLowerCase().trim();
    catergoryLower = catergoryLower.charAt(0).toUpperCase() + catergoryLower.slice(1);
    const post = await createPost(user.userId, title, content, excerpt, catergoryLower, published);

    // Revalidate the posts page so new post appears immediately
    revalidatePath('/posts');
    revalidatePath('/');

    return NextResponse.json({...post}, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const posts = await getUserPosts(user.userId);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
