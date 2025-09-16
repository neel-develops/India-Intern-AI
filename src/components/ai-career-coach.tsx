
'use client';

import { useState } from 'react';
import { Sparkles, UserCheck, Briefcase, GraduationCap, Link as LinkIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { getCareerAdvice } from '@/ai/flows/career-coach';
import type { CareerCoachOutput } from '@/ai/flows/career-coach-types';
import { Skeleton } from './ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import Link from 'next/link';

export function AICareerCoach() {
  const [analysisResult, setAnalysisResult] = useState<CareerCoachOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();
  const { profile, isLoading: profileLoading } = useStudentProfile();

  const handleGetAdvice = async () => {
    if (!profile) {
      toast({
        variant: 'destructive',
        title: 'Profile Not Found',
        description: 'Please create your profile to get career advice.',
      });
      return;
    }

    setIsAiLoading(true);
    setAnalysisResult(null);

    try {
      const result = await getCareerAdvice({ 
          studentProfile: {
              personalInfo: {
                name: profile.personalInfo.name,
                degree: profile.personalInfo.degree,
                stream: profile.personalInfo.stream,
              },
              skills: profile.skills.map(s => ({ name: s.name, proficiency: s.proficiency })),
              preferences: profile.preferences,
          }
       });
      setAnalysisResult(result);
    } catch (error) {
      console.error('AI career coach error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get career advice. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  if (profileLoading) {
      return <Skeleton className="h-64 w-full" />
  }

  if (!profile) {
      return (
        <Card>
            <CardHeader>
                <CardTitle>AI Career Advisor</CardTitle>
                <CardDescription>Please complete your profile to get personalized advice.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild><Link href="/profile">Create Profile</Link></Button>
            </CardContent>
        </Card>
      )
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Career Advisor
          </CardTitle>
          <CardDescription>
            Get a personalized career roadmap from our AI, based on your unique profile, skills, and interests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetAdvice} disabled={isAiLoading} size="lg">
            <UserCheck className="mr-2 h-5 w-5" />
            {isAiLoading ? 'Generating Your Roadmap...' : 'Generate My Career Roadmap'}
          </Button>
        </CardContent>
      </Card>
      
      {isAiLoading && (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card>
            <CardHeader>
                <CardTitle>Your Personalized Career Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg font-semibold"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Suggested Career Paths</AccordionTrigger>
                        <AccordionContent className="pt-2">
                            {analysisResult.suggestedPaths.map((path, index) => (
                                <div key={index} className="p-4 mb-2 bg-muted/50 rounded-lg">
                                    <h4 className="font-semibold">{path.path}</h4>
                                    <p className="text-sm text-muted-foreground">{path.reason}</p>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-lg font-semibold"><GraduationCap className="mr-2 h-5 w-5 text-primary"/>Your Learning Plan</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-4">
                            {analysisResult.learningPlan.map((plan, index) => (
                                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="font-semibold text-primary">To learn: {plan.skillToLearn}</h4>
                                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                        {plan.steps.map((step, i) => <li key={i}>{step}</li>)}
                                    </ul>
                                    <div className="mt-3">
                                        <h5 className="font-semibold text-xs uppercase text-muted-foreground">Resources</h5>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {plan.resources.map((res, i) => (
                                                <Button key={i} size="sm" variant="outline" asChild>
                                                    <a href={res.link} target="_blank" rel="noopener noreferrer">
                                                        <LinkIcon className="mr-2 h-3 w-3" />
                                                        {res.name} {res.isFree && "(Free)"}
                                                    </a>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-3">
                        <AccordionTrigger className="text-lg font-semibold"><Info className="mr-2 h-5 w-5 text-primary"/>Professional Development</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-4">
                             <div>
                                <h4 className="font-semibold">Resume Tips</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    {analysisResult.professionalDevelopment.resumeTips.map((tip, i) => <li key={i}>{tip}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold">Interview Prep</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    {analysisResult.professionalDevelopment.interviewPrep.map((tip, i) => <li key={i}>{tip}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold">Networking Tips</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    {analysisResult.professionalDevelopment.networkingTips.map((tip, i) => <li key={i}>{tip}</li>)}
                                </ul>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
