import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserById } from '@/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userDetails = await getUserById(user.userId);

    return NextResponse.json({
      user: {
        id: userDetails?.id,
        email: userDetails?.email,
        name: userDetails?.name,
        bio: userDetails?.bio,
        avatar: userDetails?.avatar,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
