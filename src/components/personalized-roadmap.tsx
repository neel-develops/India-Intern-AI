'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/use-student-profile';
import type { PersonalizedRoadmapOutput } from '@/ai/flows/generate-personalized-roadmap-types';
import { generatePersonalizedRoadmap } from '@/ai/flows/generate-personalized-roadmap';
import { Skeleton } from './ui/skeleton';
import { GraduationCap, MapPin, Target, ListChecks, CalendarDays } from 'lucide-react';

export function PersonalizedRoadmap() {
    const { profile, isLoading: profileLoading } = useStudentProfile();
    const { toast } = useToast();
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [roadmap, setRoadmap] = useState<PersonalizedRoadmapOutput | null>(null);
    const [formData, setFormData] = useState({
        locationType: 'urban',
        matchScore: '75',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) {
            toast({
                variant: 'destructive',
                title: 'Profile not found',
                description: 'Please complete your profile first.',
            });
            return;
        }

        setIsAiLoading(true);
        setRoadmap(null);

        try {
            const result = await generatePersonalizedRoadmap({
                userId: profile.personalInfo.email,
                locationType: formData.locationType as 'urban' | 'rural',
                skills: profile.skills.map(s => ({ name: s, level: 'intermediate' })), // Assuming intermediate for now
                matchScore: parseInt(formData.matchScore, 10),
            });
            setRoadmap(result);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error generating roadmap',
                description: 'There was an issue creating your personalized plan. Please try again.',
            });
        } finally {
            setIsAiLoading(false);
        }
    };
    
    if (profileLoading) {
        return <Skeleton className="h-64 w-full" />;
    }
    
    if (!profile) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Personalized Roadmap</CardTitle>
                    <CardDescription>Please create your profile to generate a personalized learning roadmap.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        AI-Powered Learning Roadmap
                    </CardTitle>
                    <CardDescription>
                        Get a personalized, week-by-week plan to improve your skills and land your dream internship.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="locationType">Location Type</Label>
                                <Select
                                    value={formData.locationType}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, locationType: value }))}
                                >
                                    <SelectTrigger id="locationType">
                                        <SelectValue placeholder="Select location type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="urban">Urban</SelectItem>
                                        <SelectItem value="rural">Rural</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="matchScore">Target Internship Match Score (%)</Label>
                                <Input
                                    id="matchScore"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.matchScore}
                                    onChange={(e) => setFormData(prev => ({...prev, matchScore: e.target.value}))}
                                    placeholder="e.g., 85"
                                />
                            </div>
                        </div>
                       
                        <Button type="submit" disabled={isAiLoading}>
                            {isAiLoading ? 'Generating Your Roadmap...' : 'Generate My Roadmap'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {isAiLoading && <Skeleton className="w-full h-96" />}

            {roadmap && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Personalized Roadmap</CardTitle>
                        <CardDescription>Follow these recommendations and weekly tasks to boost your skills.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                                <ListChecks className="h-5 w-5 text-primary" /> Recommendations
                            </h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                {roadmap.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                        <div>
                             <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <CalendarDays className="h-5 w-5 text-primary" /> 3-Week Improvement Plan
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(roadmap.roadmap).map(([week, actions]) => (
                                    <div key={week} className="p-4 border-l-4 border-primary bg-muted/50 rounded-r-lg">
                                        <h4 className="font-bold capitalize text-primary">{week.replace('week', 'Week ')}</h4>
                                        <ul className="list-disc list-inside text-muted-foreground mt-2">
                                            {actions.map((action, i) => <li key={i}>{action}</li>)}
                                        </ul>
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
