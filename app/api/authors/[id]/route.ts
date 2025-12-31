import { NextRequest, NextResponse } from 'next/server';
import { getUserById, getUserPosts } from '@/lib/db/queries';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get only published posts by this user
    const allPosts = await getUserPosts(userId);
    const posts = allPosts.filter(post => post.published);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
      },
      posts,
    });
  } catch (error) {
    console.error('Get author error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    );
  }
}
