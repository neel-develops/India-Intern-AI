'use client';

import { useState } from 'react';
import { FileScan, Wand2, Star, ThumbsUp, Lightbulb, Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { analyseResumeText } from '@/ai/flows/analyse-resume-text';
import type { AnalyseResumeOutput } from '@/ai/flows/analyse-resume-text-types';
import { Skeleton } from './ui/skeleton';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { Progress } from './ui/progress';

export function ResumeAnalyser() {
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyseResumeOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();
  const { profile } = useStudentProfile();

  const handleAnalyseResume = async () => {
    if (resumeText.trim().length < 100) {
      toast({
        variant: 'destructive',
        title: 'Resume Too Short',
        description: 'Please paste the full text of your resume (at least 100 characters).',
      });
      return;
    }

    setIsAiLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyseResumeText({ resumeText });
      setAnalysisResult(result);
    } catch (error) {
      console.error('AI resume analysis error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not analyse your resume. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleLoadFromProfile = () => {
      if(profile?.resumeSummary) {
          setResumeText(profile.resumeSummary);
          toast({
              title: 'Resume Loaded',
              description: 'Your resume summary has been loaded from your profile.'
          })
      } else {
           toast({
              variant: 'destructive',
              title: 'No Summary Found',
              description: 'Please add a resume summary to your profile first.',
          });
      }
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
            Paste your resume text below and our AI will provide feedback to help you stand out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your full resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="text-base min-h-[250px] font-mono"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleAnalyseResume} disabled={isAiLoading || !resumeText.trim()} size="lg" className="flex-grow">
              <Wand2 className="mr-2 h-5 w-5" />
              {isAiLoading ? 'Analysing...' : 'Analyse My Resume'}
            </Button>
            <Button onClick={handleLoadFromProfile} variant="outline" size="lg">
                Load from Profile
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isAiLoading && (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-16 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card>
            <CardHeader>
                <CardTitle>Analysis Complete</CardTitle>
                <CardDescription>Here's the AI-powered feedback for your resume.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Star className="h-6 w-6 text-yellow-500" /> Overall Impact Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <span className="text-5xl font-bold text-primary">{analysisResult.analysis.impactScore}</span>
                            <div className="flex-grow">
                                <Progress value={analysisResult.analysis.impactScore} className="h-3" />
                                <p className="text-sm text-muted-foreground mt-2">A score of 80+ is generally considered strong for internship applications.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ThumbsUp className="h-6 w-6 text-green-500" /> Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{analysisResult.analysis.strengths}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lightbulb className="h-6 w-6 text-blue-500" /> Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{analysisResult.analysis.suggestions}</p>
                        </CardContent>
                    </Card>
                </div>
                
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Detected Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {analysisResult.detectedSkills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>

            </CardContent>
        </Card>
      )}
    </div>
  );
}
