
'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Target, Lightbulb, Check, X, GraduationCap, BarChart3, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { analyzeSkillGap } from '@/ai/flows/analyze-skill-gap';
import type { AnalyzeSkillGapOutput } from '@/ai/flows/analyze-skill-gap-types';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import type { Internship } from '@/lib/types';
import { SmartMatchInternships } from './smart-match-internships';

export function SkillGapVisualizer() {
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
    const [analysis, setAnalysis] = useState<AnalyzeSkillGapOutput | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { profile, isLoading: isProfileLoading } = useStudentProfile();
    const { toast } = useToast();

    const handleAnalyze = useCallback(async (internship: Internship) => {
        if (!profile) {
            toast({ variant: 'destructive', title: 'Please complete your profile first.' });
            return;
        }
        if (!internship) return;
        
        setSelectedInternship(internship);
        setIsAiLoading(true);
        setAnalysis(null);
        try {
            const result = await analyzeSkillGap({
                userSkills: profile.skills,
                internshipDescription: internship.longDescription,
            });
            setAnalysis(result);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error analyzing skill gap.' });
        } finally {
            setIsAiLoading(false);
        }
    }, [profile, toast]);
    
    if (isProfileLoading) return <Skeleton className="h-64 w-full" />;

    if (!profile) return (
        <Card>
            <CardHeader>
                <CardTitle>Skill Gap Visualizer</CardTitle>
                <CardDescription>Please create your profile to analyze your skill gap.</CardDescription>
            </CardHeader>
        </Card>
    );

    const matchPercentage = analysis ? (analysis.matchingSkills.length / (analysis.requiredSkills.length || 1)) * 100 : 0;
    const firstMissingSkill = analysis?.missingSkills?.[0]?.skill;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Target className="h-8 w-8 text-primary" />
                        Skill Gap Visualizer
                    </CardTitle>
                    <CardDescription>
                        First, find your AI-powered internship matches. Then, select a card to analyze your skill gap.
                    </CardDescription>
                </CardHeader>
            </Card>

            <SmartMatchInternships onInternshipSelect={handleAnalyze} selectedInternshipId={selectedInternship?.id}/>

            {isAiLoading && <Skeleton className="h-80 w-full" />}

            {analysis && selectedInternship && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Skill Gap Analysis for: <span className="text-primary">{selectedInternship.title}</span></CardTitle>
                        <CardDescription>Here's a breakdown of your skills compared to the internship requirements.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Overall Match: {Math.round(matchPercentage)}%</h3>
                            <Progress value={matchPercentage} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg"><Check className="h-5 w-5 text-green-500"/> Matching Skills</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {analysis.matchingSkills.length > 0 ? (
                                        analysis.matchingSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No matching skills found.</p>
                                    )}
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg"><X className="h-5 w-5 text-red-500"/> Missing Skills</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                     {analysis.missingSkills.length > 0 ? (
                                        analysis.missingSkills.map(item => <Badge key={item.skill} variant="destructive">{item.skill}</Badge>)
                                     ) : (
                                        <p className="text-sm text-muted-foreground">No missing skills identified. Great match!</p>
                                     )}
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-primary" />Why Your Missing Skills Matter
                            </h3>
                            <div className="space-y-4">
                                {analysis.missingSkills.length > 0 ? (
                                    analysis.missingSkills.map((item, index) => (
                                        <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                            <h4 className="font-semibold text-primary">{item.skill}</h4>
                                            <p className="text-sm text-muted-foreground">{item.importance}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">You have all the required skills for this role!</p>
                                )}
                            </div>
                        </div>
                         {firstMissingSkill && (
                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-semibold mb-2">Next Step</h3>
                                <p className="text-muted-foreground mb-4">Bridge the gap! Click below to get a personalized learning plan for your first missing skill.</p>
                                <Button asChild>
                                    <Link href={`/learn?skill=${encodeURIComponent(firstMissingSkill)}`}>
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        Learn "{firstMissingSkill}"
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
