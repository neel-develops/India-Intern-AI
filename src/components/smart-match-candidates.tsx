
'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { suggestSuitableCandidates } from '@/ai/flows/suggest-suitable-candidates';
import { studentProfiles as allStudentProfiles } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { SuggestSuitableCandidatesOutput } from '@/ai/flows/suggest-suitable-candidates';
import { StudentCard } from './student-card';
import { Skeleton } from './ui/skeleton';

export function SmartMatchCandidates() {
  const [internshipDescription, setInternshipDescription] = useState('');
  const [suggestedCandidates, setSuggestedCandidates] = useState<SuggestSuitableCandidatesOutput>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const handleFindCandidates = async () => {
    if (!internshipDescription.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide an internship description.',
      });
      return;
    }

    setIsAiLoading(true);
    setSuggestedCandidates([]);

    try {
        const profilesForAI = allStudentProfiles.map(p => ({
            personalInfo: {
                name: p.personalInfo.name,
                age: p.personalInfo.age,
                email: p.personalInfo.email,
                location: p.personalInfo.location,
            },
            skills: p.skills,
            preferences: [`Domain: ${p.preferences.domain}`, `Type: ${p.preferences.internshipType}`],
            resumeSummary: p.resumeSummary,
            affirmativeAction: {
                // This data is currently missing from the student profile, so we'll use defaults
                socialCategory: 'General',
                isFromAspirationalDistrict: false,
                hasParticipatedBefore: false,
            },
        }));

      const result = await suggestSuitableCandidates({
        internshipDescription,
        studentProfiles: profilesForAI,
      });

      // Sort results by match score descending
      const sortedResult = result.sort((a, b) => b.matchScore - a.matchScore);
      setSuggestedCandidates(sortedResult);

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            Find Top Talent with AI
          </CardTitle>
          <CardDescription>
            Paste your internship description below to find the most suitable candidates from our talent pool, based on skills and affirmative action criteria.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your full internship description here..."
            rows={8}
            value={internshipDescription}
            onChange={(e) => setInternshipDescription(e.target.value)}
            className="text-base"
          />
          <Button onClick={handleFindCandidates} disabled={isAiLoading || !internshipDescription.trim()}>
            {isAiLoading ? 'Analyzing...' : 'Find Suitable Candidates'}
          </Button>
        </CardContent>
      </Card>
      
      {isAiLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isAiLoading && suggestedCandidates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Suggested Candidates (Ranked)</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestedCandidates.map((candidate) => {
              const studentProfile = allStudentProfiles.find(p => p.personalInfo.name === candidate.studentName);
              if (!studentProfile) return null;

              return (
                <StudentCard
                  key={candidate.studentName}
                  student={{
                    ...studentProfile,
                    matchScore: candidate.matchScore,
                    reasons: candidate.reasons,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
