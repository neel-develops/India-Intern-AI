
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wand2 } from 'lucide-react';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { suggestRelevantInternships } from '@/ai/flows/suggest-relevant-internships';
import { internships as allInternships } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InternshipCard } from '@/components/internship-card';
import { useToast } from '@/hooks/use-toast';
import type { SuggestRelevantInternshipsOutput } from '@/ai/flows/suggest-relevant-internships';

export function SmartMatchInternships() {
  const { profile, isLoading: isProfileLoading } = useStudentProfile();
  const [suggestedInternships, setSuggestedInternships] = useState<SuggestRelevantInternshipsOutput>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const handleFindMatches = async () => {
    if (!profile) return;

    setIsAiLoading(true);
    setSuggestedInternships([]);

    try {
      const studentProfileForAI = {
        personalInfo: profile.personalInfo,
        skills: profile.skills,
        preferences: profile.preferences,
        resumeText: profile.resumeSummary,
      };

      const result = await suggestRelevantInternships({
        studentProfile: studentProfileForAI,
        internshipListings: allInternships,
      });

      setSuggestedInternships(result);
    } catch (error) {
      console.error('AI match error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch AI-powered suggestions. Please try again later.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isProfileLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/5" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-40" />
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unlock Your Perfect Internship</CardTitle>
          <CardDescription>
            Complete your profile to get personalized, AI-powered internship recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/profile">Create My Profile</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            AI-Powered Internship Matches
          </CardTitle>
          <CardDescription>
            Based on your profile, our AI will find the most suitable internships for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleFindMatches} disabled={isAiLoading}>
            {isAiLoading ? 'Analyzing...' : 'Find My Smart Matches'}
          </Button>
        </CardContent>
      </Card>
      
      {isAiLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isAiLoading && suggestedInternships.length > 0 && (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Your Top Matches</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestedInternships.map((internship, index) => (
                <InternshipCard
                key={`${internship.title}-${index}`}
                internship={{...internship, id: String(index), image: `https://picsum.photos/600/400?random=${10+index}`}}
                matchReason={internship.matchReason}
                />
            ))}
            </div>
        </div>
      )}

      {!isAiLoading && !suggestedInternships.length && (
         <Alert className="bg-accent/50 border-accent">
            <Wand2 className="h-4 w-4" />
            <AlertTitle>Ready for your matches?</AlertTitle>
            <AlertDescription>
                Click the "Find My Smart Matches" button to let our AI discover the best opportunities for you.
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
