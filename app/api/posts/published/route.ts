import { NextRequest, NextResponse } from 'next/server';
import { getAllPublishedPosts } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const posts = await getAllPublishedPosts(limit, offset);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get published posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
