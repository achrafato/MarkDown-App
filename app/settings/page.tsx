'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import toast  from 'react-hot-toast';
import { useUserStore } from '@/lib/store';
import AuthGuard from '@/components/auth-gard';

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  )
}

function SettingsContent() {
  const { user, updateUser, logout, isAuthenticated } = useUserStore() // Get actions from store
  const router = useRouter();

  // Local form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. SYNC: Initialize form when user data is available
  useEffect(() => {
    if (!user && isAuthenticated) {
      logout()
      router.push('/login');
      return;
    }
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    const payload: any = { name, bio, avatar: avatarPreview};

    try {
      if (avatarPreview && avatarPreview == user?.avatar) {
        console.log('Avatar unchanged, removing from payload');
        delete payload.avatar;
      }
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      updateUser({ name, bio, avatar: avatarPreview });

      toast.success('Profile updated successfully');
      
    } catch (error) {
      toast.error('Could not save changes');
    } finally {
      setIsSaving(false);
    }
  }


  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative w-24 h-24">
              <img 
                src={avatarPreview || "/placeholder.svg"} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" 
              />
            </div>
            
            <div className="flex flex-col items-center">
              <Label htmlFor="avatar-upload" className="cursor-pointer text-sm text-primary hover:underline">
                Change Profile Picture
              </Label>
              <Input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user?.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell others about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isSaving}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
}