import { StudentProfileForm } from '@/components/student-profile-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { useAuth } from '@/hooks/use-auth';
import type { StudentProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, saveProfile, isLoading: profileLoading } = useStudentProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleSave = async (data: StudentProfile) => {
    if (!user) return;
    try {
      await saveProfile(user.uid, data);
      toast({
        title: 'Profile Saved ✅',
        description: 'Your profile has been updated successfully.',
      });
    } catch (err: any) {
      console.error('Profile save error:', err);
      toast({
        title: 'Save Failed ❌',
        description: err?.message?.includes('permission')
          ? 'Permission denied — please sign out and sign back in, then try again.'
          : 'Could not save your profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="mb-4">Please log in to view your profile.</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {profile ? 'Your Profile' : 'Create Your Profile'}
        </h1>
        <p className="text-muted-foreground">
          {profile
            ? 'Keep your profile updated to get the best internship matches.'
            : 'Complete your profile to start finding internships.'}
        </p>
      </div>
      <StudentProfileForm profile={profile} onSave={handleSave} userEmail={user.email || ''} />
    </div>
  );
}
