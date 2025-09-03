'use client';

import { StudentProfileForm } from '@/components/student-profile-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentProfile } from '@/hooks/use-student-profile';

export default function ProfilePage() {
  const { profile, saveProfile, isLoading } = useStudentProfile();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Keep your profile updated to get the best internship matches.
        </p>
      </div>
      <StudentProfileForm profile={profile} onSave={saveProfile} />
    </div>
  );
}
