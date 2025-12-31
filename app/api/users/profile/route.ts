import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { updateUser } from '@/lib/db/queries';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';
import { getUserById } from '@/lib/db/queries';

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userData = await getUserById(user.userId);
    const oldAvatarPath = userData?.avatar;

    const { name, bio , avatar} = await req.json();
    
    // Prepare the object we will send to the DB
    const updateData: any = { name, bio };

    if (avatar && avatar.startsWith('data:image')) {
      try {
      
        const base64Data = avatar.split(',')[1];
        
        const buffer = Buffer.from(base64Data, 'base64');

        const filename = `user-${user.userId}-${Date.now()}.png`;
        
        const uploadDir = path.join(process.cwd(), 'public');
        
        await writeFile(path.join(uploadDir, filename), buffer);

        updateData.avatar = `/${filename}`;
        
        if (oldAvatarPath && oldAvatarPath != '/avatar.png') {
          const oldFileFullPath = path.join(process.cwd(), 'public', oldAvatarPath);

          try {
            await unlink(oldFileFullPath);
            console.log(`Deleted old avatar: ${oldFileFullPath}`);
          } catch (deleteErr) {
            console.warn("Could not delete old avatar (might not exist):", deleteErr);
          }
        }


      } catch (err) {
        console.error("Error saving image:", err);
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
      }
    }


    if (!name && !bio && !avatar) {
      return NextResponse.json(
        { error: 'At least one field is required' },
        { status: 400 }
      );
    }

    const updatedUser = await updateUser(user.userId, updateData);

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
