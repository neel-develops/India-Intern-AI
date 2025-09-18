
'use client';

import { StudentCard } from '@/components/student-card';
import { studentProfiles } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TalentPoolPage() {
  const { user, userType, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (userType !== 'industry' || !user)) {
      router.replace('/login');
    }
  }, [user, userType, loading, router]);

  if (loading || userType !== 'industry' || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-12">
       <div>
        <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Talent Pool
            </h1>
            <p className="text-lg text-muted-foreground">
                Browse all student profiles.
            </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studentProfiles.map((student) => (
                <StudentCard key={student.personalInfo.email} student={student} />
            ))}
        </div>
      </div>
    </div>
  );
}
