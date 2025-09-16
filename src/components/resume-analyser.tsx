
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileScan, Wand2, Lightbulb, ThumbsUp, ThumbsDown, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { analyzeResume } from '@/ai/flows/analyze-resume';
import type { AnalyzeResumeOutput } from '@/ai/flows/analyze-resume-types';
import { Skeleton } from './ui/skeleton';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';

export function ResumeAnalyser() {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<AnalyzeResumeOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { toast } = useToast();
  const { profile, isLoading: profileLoading } = useStudentProfile();

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({ variant: 'destructive', title: 'Please paste your resume text.' });
      return;
    }
    setIsAiLoading(true);
    setAnalysis(null);
    setApiError(null);
    try {
      const result = await analyzeResume({ resumeText });
      if (result) {
        setAnalysis(result);
      } else {
        setApiError('You have exceeded the daily limit for AI suggestions on the free plan. Please try again tomorrow.');
      }
    } catch (error) {
      console.error('Resume analysis error:', error);
      setApiError('Could not analyze your resume. Please try again later.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not analyze your resume. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleUseProfileResume = () => {
    if (profile?.resumeSummary) {
        setResumeText(profile.resumeSummary);
        toast({ title: 'Resume summary loaded from your profile.' });
    } else {
        toast({ variant: 'destructive', title: 'No resume summary found in your profile.' });
    }
  }

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
            Paste your resume text below, or use the summary from your profile to get instant feedback, a score, and an enhanced version.
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
          <div className="flex gap-2">
            <Button onClick={handleAnalyze} disabled={isAiLoading}>
              <Wand2 className="mr-2 h-4 w-4" />
              {isAiLoading ? 'Analyzing...' : 'Analyze My Resume'}
            </Button>
            <Button variant="outline" onClick={handleUseProfileResume} disabled={isAiLoading}>
                <User className="mr-2 h-4 w-4" />
                Use Resume from Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {isAiLoading && <Skeleton className="h-80 w-full" />}
      
      {apiError && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>API Limit Reached</AlertTitle>
            <AlertDescription>
                {apiError}
            </AlertDescription>
        </Alert>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>{analysis.overallFeedback}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Resume Score</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                     <div className="relative h-24 w-24">
                        <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="2"></circle>
                            <g className="origin-center -rotate-90 transform">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - analysis.resumeScore}></circle>
                            </g>
                        </svg>
                        <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                            <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{analysis.resumeScore}</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg">Rationale</h4>
                        <p className="text-muted-foreground">{analysis.scoreRationale}</p>
                    </div>
                </CardContent>
            </Card>

             <div>
              <h3 className="text-lg font-semibold mb-2">Enhanced Summary</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Original</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {resumeText}
                  </CardContent>
                </Card>
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="text-base text-primary">AI-Enhanced Version</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    {analysis.enhancedSummary}
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />
            
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
