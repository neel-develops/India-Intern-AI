
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wand2, BellRing, Mail } from 'lucide-react';
import { useStudentProfile } from '@/hooks/use-student-profile.tsx';
import { suggestRelevantInternships } from '@/ai/flows/suggest-relevant-internships';
import { internships as allInternships } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InternshipCard } from '@/components/internship-card';
import { useToast } from '@/hooks/use-toast';
import type { SuggestRelevantInternshipsOutput } from '@/ai/flows/suggest-relevant-internships-types';
import type { Internship } from '@/lib/types';
import { Input } from './ui/input';

interface SmartMatchInternshipsProps {
    onInternshipSelect?: (internship: Internship) => void;
    selectedInternshipId?: string;
}

export function SmartMatchInternships({ onInternshipSelect, selectedInternshipId }: SmartMatchInternshipsProps) {
  const { profile, isLoading: isProfileLoading } = useStudentProfile();
  const [suggestedInternships, setSuggestedInternships] = useState<(Internship & { matchReason: string })[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { toast } = useToast();

  const handleFindMatches = async () => {
    if (!profile) return;

    setIsAiLoading(true);
    setSearchPerformed(true);
    setSuggestedInternships([]);

    try {
      const studentProfileForAI = {
        personalInfo: {
          name: profile.personalInfo.name || '',
          age: profile.personalInfo.age || 0,
          location: profile.personalInfo.location || '',
        },
        skills: profile.skills,
        preferences: profile.preferences,
        resumeText: profile.resumeSummary,
      };

      const result: SuggestRelevantInternshipsOutput = await suggestRelevantInternships({
        studentProfile: studentProfileForAI,
        internshipListings: allInternships.map(i => ({...i, description: i.description})),
      });

      const enrichedInternships = result.map(suggested => {
        const originalInternship = allInternships.find(i => i.id === suggested.id);
        if (!originalInternship) return null;
        return {
          ...originalInternship,
          matchReason: suggested.matchReason,
        };
      }).filter((i): i is Internship & { matchReason: string } => i !== null);


      setSuggestedInternships(enrichedInternships);
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
  
  const handleNotifyClick = () => {
    toast({
        title: 'Subscription Confirmed!',
        description: 'You will be notified when new internships match your profile.'
    })
  }

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

      {!isAiLoading && searchPerformed && suggestedInternships.length > 0 && (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Your Top Matches</h2>
             <p className="text-muted-foreground">
                {onInternshipSelect ? 'Click a card below to analyze your skill gap.' : 'Here are your best matches based on your profile.'}
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestedInternships.map((internship, index) => (
                <InternshipCard
                key={`${internship.id}-${index}`}
                internship={internship}
                matchReason={internship.matchReason}
                onSelect={onInternshipSelect}
                isSelected={selectedInternshipId === internship.id}
                />
            ))}
            </div>
        </div>
      )}

      {!isAiLoading && searchPerformed && suggestedInternships.length === 0 && (
          <Card className="text-center bg-accent/50 border-accent">
            <CardContent className="p-8">
                <BellRing className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Matches Found Right Now</h3>
                <p className="text-muted-foreground mb-6">
                    Don't worry! We can notify you via email as soon as a new internship matching your profile is available.
                </p>
                <div className="flex max-w-sm mx-auto">
                    <div className="relative w-full">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                         <Input 
                            type="email" 
                            placeholder="Your email address" 
                            defaultValue={profile.personalInfo.email} 
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={handleNotifyClick} className="ml-2">Notify Me</Button>
                </div>
            </CardContent>
          </Card>
      )}

      {!isAiLoading && !searchPerformed && (
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
