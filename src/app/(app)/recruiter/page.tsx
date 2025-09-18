
'use client';

import { SmartMatchCandidates } from '@/components/smart-match-candidates';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Users } from 'lucide-react';

export default function RecruiterPage() {
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
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Recruiter Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
              Find the perfect match for your internship using our AI-powered tools.
              </p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="lg" variant="outline">
                <Link href="/recruiter/talent-pool">
                    <Users className="mr-2" />
                    Browse Talent Pool
                </Link>
            </Button>
            <Button asChild size="lg">
                <Link href="/recruiter/internships">
                    <PlusCircle className="mr-2" />
                    Manage Internships
                </Link>
            </Button>
          </div>
        </div>
        <SmartMatchCandidates />
      </div>
    </div>
  );
}
