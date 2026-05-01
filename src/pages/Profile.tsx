import { StudentProfileForm } from '@/components/student-profile-form';
import { IndustryProfileForm } from '@/components/industry-profile-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { useIndustryProfile } from '@/hooks/use-industry-profile';
import { useAuth } from '@/hooks/use-auth';
import type { StudentProfile, IndustryProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, userType, loading: authLoading } = useAuth();
  const { profile: studentProfile, saveProfile: saveStudentProfile, isLoading: studentLoading } = useStudentProfile();
  const { profile: industryProfile, saveProfile: saveIndustryProfile, isLoading: industryLoading } = useIndustryProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleSaveStudent = async (data: StudentProfile) => {
    if (!user) return;
    try {
      await saveStudentProfile(user.uid, data);
      toast({ title: 'Profile Saved ✅', description: 'Your profile has been updated successfully.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Save Failed ❌', description: 'Could not save profile.' });
    }
  };

  const handleSaveIndustry = async (data: IndustryProfile) => {
    if (!user) return;
    try {
      await saveIndustryProfile(user.uid, data);
      toast({ title: 'Profile Saved ✅', description: 'Your recruiter profile has been updated successfully.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Save Failed ❌', description: 'Could not save profile.' });
    }
  };

  const isLoading = authLoading || (userType === 'student' ? studentLoading : industryLoading);

  if (isLoading) {
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

  const isIndustry = userType === 'industry';
  const hasProfile = isIndustry ? !!industryProfile : !!studentProfile;

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {hasProfile ? 'Your Profile' : 'Create Your Profile'}
        </h1>
        <p className="text-muted-foreground">
          {isIndustry
            ? 'Update your company and professional details.'
            : 'Keep your profile updated to get the best internship matches.'}
        </p>
      </div>
      
      {isIndustry ? (
        <IndustryProfileForm 
          profile={industryProfile} 
          onSave={handleSaveIndustry} 
          userEmail={user.email || ''} 
        />
      ) : (
        <StudentProfileForm 
          profile={studentProfile} 
          onSave={handleSaveStudent} 
          userEmail={user.email || ''} 
        />
      )}
    </div>
  );
}
