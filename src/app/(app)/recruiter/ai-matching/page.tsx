
'use client';

import { SmartMatchCandidates } from '@/components/smart-match-candidates';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RecruiterAIInsightsPage() {
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
       <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            AI Hiring Insights
            </h1>
            <p className="text-lg text-muted-foreground">
            Get AI-powered candidate rankings, hiring recommendations, and detailed analysis to find the perfect match for your internship.
            </p>
        </div>
        <SmartMatchCandidates />
    </div>
  );
}
