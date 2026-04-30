

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wand2, BellRing, Mail, AlertTriangle, TrendingUp } from 'lucide-react';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { suggestRelevantInternships  } from '@/lib/api';
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

import { SmartMatchInternshipsProps, EnrichedInternship } from './smart-match-internships-types';
import { useInternships } from '@/hooks/use-internships';

export function SmartMatchInternships({ onInternshipSelect, selectedInternshipId }: SmartMatchInternshipsProps) {
  const { profile, isLoading: isProfileLoading } = useStudentProfile();
  const { internships: liveInternships, isLoading: isInternshipsLoading } = useInternships();
  const [suggestedInternships, setSuggestedInternships] = useState<EnrichedInternship[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFindMatches = async () => {
    if (!profile) return;

    setIsAiLoading(true);
    setSearchPerformed(true);
    setSuggestedInternships([]);
    setApiError(null);

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

      // Use live internships for matching
      const listingsToMatch = liveInternships.length > 0 ? liveInternships : allInternships;

      const result: SuggestRelevantInternshipsOutput = await suggestRelevantInternships({
        studentProfile: studentProfileForAI,
        internshipListings: listingsToMatch.map(i => ({...i, description: i.longDescription || i.description})),
      });

      if (result && result.length > 0) {
        const enrichedInternships = result.map(suggested => {
          const originalInternship = listingsToMatch.find(i => i.id === suggested.id);
          if (!originalInternship) return null;
          return {
            ...originalInternship,
            matchReason: suggested.matchReason,
            matchPercentage: suggested.matchPercentage,
          };
        }).filter((i): i is EnrichedInternship => i !== null);
         setSuggestedInternships(enrichedInternships);
      } else {
        // This case handles when AI runs but finds no matches, or if the API call returns an empty array due to rate limiting
        setSuggestedInternships([]);
        if (result.length === 0 && searchPerformed) {
            // Check if it was a rate limit error specifically
             const testForRateLimitError = await suggestRelevantInternships({
                studentProfile: studentProfileForAI,
                internshipListings: [allInternships[0]].map(i => ({...i, description: i.longDescription})),
             }).catch(() => null);

             if (testForRateLimitError === null || testForRateLimitError.length === 0) {
                 setApiError('You may have exceeded the daily limit for AI suggestions on the free plan. Please try again tomorrow.');
             }
        }
      }

    } catch (error: any) {
      console.error('AI match error:', error);
      setApiError('Could not fetch AI-powered suggestions. Please try again later.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch AI-powered suggestions.',
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
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Unlock Your Perfect Internship</CardTitle>
          <CardDescription>
            Complete your profile to get personalized, AI-powered internship recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/profile">Create My Profile</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-secondary" />
            AI-Powered Internship Matches
          </CardTitle>
          <CardDescription>
            Based on your profile, our AI will find the most suitable internships for you and calculate a match score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleFindMatches} disabled={isAiLoading} variant="secondary">
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
      
      {apiError && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Error</AlertTitle>
            <AlertDescription>
                {apiError}
            </AlertDescription>
        </Alert>
      )}

      {!isAiLoading && searchPerformed && !apiError && suggestedInternships.length > 0 && (
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
                matchPercentage={internship.matchPercentage}
                onSelect={onInternshipSelect}
                isSelected={selectedInternshipId === internship.id}
                />
            ))}
            </div>
        </div>
      )}

      {!isAiLoading && searchPerformed && !apiError && suggestedInternships.length === 0 && (
          <Card className="text-center bg-card/70 backdrop-blur-sm border-secondary/30">
            <CardContent className="p-8">
                <BellRing className="mx-auto h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Matches Found Right Now</h3>
                <p className="text-muted-foreground mb-6">
                    Our AI couldn't find a strong match for your profile at the moment. We can notify you when a new opportunity comes up!
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

      {!isAiLoading && !searchPerformed && !apiError && (
         <Alert className="bg-card/70 backdrop-blur-sm border-secondary/30 text-secondary">
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
