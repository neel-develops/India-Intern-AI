
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileScan, Wand2, Lightbulb, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { analyzeResume } from '@/ai/flows/analyze-resume';
import type { AnalyzeResumeOutput } from '@/ai/flows/analyze-resume-types';
import { Skeleton } from './ui/skeleton';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function ResumeAnalyser() {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeResumeOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();
  const { profile, isLoading: profileLoading } = useStudentProfile();

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({ variant: 'destructive', title: 'Please paste your resume text.' });
      return;
    }
    setIsAiLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeResume({ resumeText });
      setAnalysis(result);
    } catch (error) {
      console.error('Resume analysis error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not analyze your resume. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  if (profileLoading) return <Skeleton className="h-96 w-full" />;

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Resume Analyser</CardTitle>
          <CardDescription>Please complete your profile to use the resume analyser.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild><Link href="/profile">Create Profile</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileScan className="h-8 w-8 text-primary" />
            AI Resume Analyser
          </CardTitle>
          <CardDescription>
            Paste your resume text below to get instant feedback and suggestions for improvement from our AI career coach.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the full text of your resume here..."
            rows={15}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isAiLoading}
          />
          <Button onClick={handleAnalyze} disabled={isAiLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isAiLoading ? 'Analyzing...' : 'Analyze My Resume'}
          </Button>
        </CardContent>
      </Card>

      {isAiLoading && <Skeleton className="h-80 w-full" />}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>{analysis.overallFeedback}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.strengths.map((item, index) => (
                    <div key={index}>
                      <p className="font-semibold">{item.point}</p>
                      <p className="text-sm text-muted-foreground">{item.explanation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ThumbsDown className="h-5 w-5 text-red-500" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.areasForImprovement.map((item, index) => (
                    <div key={index}>
                      <p className="font-semibold">{item.point}</p>
                      <p className="text-sm text-muted-foreground">{item.suggestion}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
                <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Actionable Tips</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            {analysis.actionableTips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
