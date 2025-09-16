'use client';
import { useState } from 'react';
import { Target, Lightbulb, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { analyzeSkillGap } from '@/ai/flows/analyze-skill-gap';
import type { AnalyzeSkillGapOutput } from '@/ai/flows/analyze-skill-gap-types';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

export function SkillGapVisualizer() {
    const [internshipDescription, setInternshipDescription] = useState('');
    const [analysis, setAnalysis] = useState<AnalyzeSkillGapOutput | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { profile, isLoading: isProfileLoading } = useStudentProfile();
    const { toast } = useToast();

    const handleAnalyze = async () => {
        if (!profile) return;
        if (!internshipDescription.trim()) {
            toast({ variant: 'destructive', title: 'Please paste an internship description.' });
            return;
        }
        setIsAiLoading(true);
        setAnalysis(null);
        try {
            const result = await analyzeSkillGap({
                userSkills: profile.skills,
                internshipDescription,
            });
            setAnalysis(result);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error analyzing skill gap.' });
        } finally {
            setIsAiLoading(false);
        }
    };
    
    if (isProfileLoading) return <Skeleton className="h-64 w-full" />;

    if (!profile) return (
        <Card>
            <CardHeader>
                <CardTitle>Skill Gap Visualizer</CardTitle>
                <CardDescription>Please create your profile to analyze your skill gap.</CardDescription>
            </CardHeader>
        </Card>
    );

    const matchPercentage = analysis ? (analysis.matchingSkills.length / analysis.requiredSkills.length) * 100 : 0;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Target className="h-8 w-8 text-primary" />
                        Skill Gap Visualizer
                    </CardTitle>
                    <CardDescription>Paste an internship description to see how your skills match up and what you need to learn.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Paste the full internship description here..."
                        rows={10}
                        value={internshipDescription}
                        onChange={(e) => setInternshipDescription(e.target.value)}
                    />
                </CardContent>
                <CardContent>
                     <Button onClick={handleAnalyze} disabled={isAiLoading}>
                        {isAiLoading ? 'Analyzing...' : 'Analyze My Skill Gap'}
                    </Button>
                </CardContent>
            </Card>

            {isAiLoading && <Skeleton className="h-80 w-full" />}

            {analysis && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Skill Gap Analysis</CardTitle>
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
                                {analysis.missingSkills.map((item, index) => (
                                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                        <h4 className="font-semibold text-primary">{item.skill}</h4>
                                        <p className="text-sm text-muted-foreground">{item.importance}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
