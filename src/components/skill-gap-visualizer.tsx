
'use client';
import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Target, Lightbulb, Check, Award, GraduationCap, BarChart, ListTodo, Bot, User, AlertTriangle, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { analyzeSkillGap } from '@/ai/flows/analyze-skill-gap';
import type { AnalyzeSkillGapOutput } from '@/ai/flows/analyze-skill-gap-types';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import type { Internship } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { internships as allInternships } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const getPriorityBadgeClass = (priority: 'Critical' | 'High' | 'Moderate') => {
    switch(priority) {
        case 'Critical': return 'bg-red-500 text-white';
        case 'High': return 'bg-yellow-500 text-black';
        case 'Moderate': return 'bg-blue-500 text-white';
        default: return 'bg-gray-500 text-white';
    }
}


export function SkillGapVisualizer() {
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
    const [analysis, setAnalysis] = useState<AnalyzeSkillGapOutput | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const { profile, isLoading: isProfileLoading } = useStudentProfile();
    const { toast } = useToast();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');

    const handleAnalyze = useCallback(async (internship: Internship | null) => {
        if (!profile) {
            toast({ variant: 'destructive', title: 'Please complete your profile first.' });
            return;
        }
        if (!internship) {
            setSelectedInternship(null);
            setAnalysis(null);
            return;
        }
        
        setSelectedInternship(internship);
        setSearchQuery(internship.title);
        setIsAiLoading(true);
        setAnalysis(null);
        setApiError(null);
        try {
            const result = await analyzeSkillGap({
                userSkills: profile.skills.map(s => ({name: s.name, proficiency: s.proficiency})),
                internshipDescription: internship.longDescription,
                internshipTitle: internship.title,
            });
            if (result) {
                setAnalysis(result);
            } else {
                 setApiError('You have exceeded the daily limit for AI suggestions on the free plan. Please try again tomorrow.');
            }
        } catch (error) {
            console.error("Skill gap analysis error:", error);
            setApiError('Could not analyze skill gap. Please try again later.');
            toast({ variant: 'destructive', title: 'Error analyzing skill gap.' });
        } finally {
            setIsAiLoading(false);
        }
    }, [profile, toast]);
    
    const handleGenerateLearningPlan = () => {
        if (!analysis || analysis.prioritizedGaps.length === 0) return;
        const missingSkillsText = analysis.prioritizedGaps.map(s => s.skill).join(', ');
        const prompt = `Please generate a detailed learning plan for me to acquire the following skills for the ${selectedInternship?.title} role: ${missingSkillsText}.`;
        router.push(`/career-coach?prompt=${encodeURIComponent(prompt)}`);
    }

     const chartConfig = useMemo(() => {
        const config: any = {
            user: { label: "Your Skills", color: "hsl(var(--chart-1))" },
            required: { label: "Required Skills", color: "hsl(var(--chart-2))" },
        };
        analysis?.chartData.forEach(item => {
            config[item.skill] = { label: item.skill };
        });
        return config;
    }, [analysis]);
    
    if (isProfileLoading) return <Skeleton className="h-64 w-full" />;

    if (!profile) return (
        <Card>
            <CardHeader>
                <CardTitle>Skill Gap Visualizer</CardTitle>
                <CardDescription>Please create your profile to analyze your skill gap.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild><Link href="/profile">Create Profile</Link></Button>
            </CardContent>
        </Card>
    );
    
    const filteredInternships = useMemo(() => {
        if (!searchQuery) return [];
        return allInternships.filter(internship => 
            internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            internship.company.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);


    return (
        <div className="space-y-6">
            <Card className="bg-card/70 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Target className="h-8 w-8 text-secondary" />
                        Skill Gap Visualizer
                    </CardTitle>
                    <CardDescription>
                        Enter your dream internship in the text box below to analyze your skill gap and get a personalized action plan to land the job.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <div className="relative w-full md:w-[500px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Enter your dream internship title or company..."
                                    className="w-full pl-10"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (!open) setOpen(true);
                                        if (selectedInternship) setSelectedInternship(null);
                                        if (analysis) setAnalysis(null);
                                    }}
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[500px] p-0" align="start">
                            <Command>
                            <CommandEmpty>{searchQuery.length > 2 && filteredInternships.length === 0 ? "No internships found." : "Keep typing to see results..."}</CommandEmpty>
                            <CommandGroup>
                                {filteredInternships.map((internship) => (
                                <CommandItem
                                    key={internship.id}
                                    value={internship.title}
                                    onSelect={() => {
                                        handleAnalyze(internship);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span>{internship.title}</span>
                                        <span className="text-xs text-muted-foreground">{internship.company}</span>
                                    </div>
                                </CommandItem>
                                ))}
                            </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </CardContent>
            </Card>

            
            {apiError && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>API Limit Reached</AlertTitle>
                    <AlertDescription>
                        {apiError}
                    </AlertDescription>
                </Alert>
            )}

            {isAiLoading && (
                <Card>
                    <CardHeader>
                         <Skeleton className="h-8 w-3/4" />
                    </CardHeader>
                    <CardContent className="text-center p-8">
                        <div className="flex justify-center items-center">
                            <Bot className="h-16 w-16 text-secondary animate-pulse" />
                        </div>
                        <p className="mt-4 text-muted-foreground animate-pulse">Our AI is analyzing your profile against the internship requirements...</p>
                    </CardContent>
                </Card>
            )}

            {!selectedInternship && !isAiLoading && (
                 <Alert className="bg-card/70 backdrop-blur-sm border-secondary/30 text-secondary">
                    <Search className="h-4 w-4" />
                    <AlertTitle>Ready to Analyze?</AlertTitle>
                    <AlertDescription>
                        Use the search bar above to find and select an internship. We'll instantly show you how you stack up.
                    </AlertDescription>
                </Alert>
            )}

            {analysis && selectedInternship && (
                <Card className="bg-card/70 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Analysis for: <span className="text-secondary">{selectedInternship.title}</span></CardTitle>
                        <CardDescription>Here's a breakdown of your skills compared to the internship requirements.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="flex flex-col items-center justify-center text-center p-6 md:col-span-1 bg-card/50">
                                <CardTitle className="mb-2">Overall Match</CardTitle>
                                <div className="relative h-32 w-32">
                                     <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="2"></circle>
                                        <g className="origin-center -rotate-90 transform">
                                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-secondary" strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - analysis.overallMatchPercentage}></circle>
                                        </g>
                                    </svg>
                                    <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                        <span className="text-center text-3xl font-bold text-foreground">{Math.round(analysis.overallMatchPercentage)}%</span>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6 md:col-span-2 bg-card/50">
                                <CardTitle className="mb-4 flex items-center gap-2"><BarChart className="h-5 w-5"/> Skill Comparison</CardTitle>
                                <ChartContainer config={chartConfig} className="w-full h-64">
                                    <ResponsiveContainer>
                                        <RadarChart data={analysis.chartData}>
                                            <ChartTooltipContent />
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="skill" />
                                            <Radar name="Your Skills" dataKey="user" stroke="var(--color-user)" fill="var(--color-user)" fillOpacity={0.6} />
                                            <Radar name="Required Skills" dataKey="required" stroke="var(--color-required)" fill="var(--color-required)" fillOpacity={0.6} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </Card>
                        </div>

                         <Separator />
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-card/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-green-500"/> Your Strengths</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {analysis.strengths.length > 0 ? (
                                        analysis.strengths.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No specific strengths identified for this role.</p>
                                    )}
                                </CardContent>
                            </Card>
                            <Card className="bg-card/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-500"/> Prioritized Gaps</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                     {analysis.prioritizedGaps.length > 0 ? (
                                        analysis.prioritizedGaps.map(item => (
                                            <div key={item.skill}>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold">{item.skill}</h4>
                                                    <Badge className={getPriorityBadgeClass(item.priority)}>{item.priority}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{item.reason}</p>
                                            </div>
                                        ))
                                     ) : (
                                        <p className="text-sm text-muted-foreground">No critical skill gaps identified. Great match!</p>
                                     )}
                                </CardContent>
                            </Card>
                        </div>
                        
                         <Separator />

                        <div>
                            <Card className="border-secondary bg-card/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-secondary">
                                        <ListTodo className="h-6 w-6" />
                                        Your Personalized Action Plan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     {analysis.actionPlan.map((step, index) => (
                                        <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                            <h4 className="font-semibold">{step.step}</h4>
                                            <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
                                                {step.tasks.map((task, i) => <li key={i}>{task}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                    {analysis.prioritizedGaps.length > 0 && (
                                        <Button onClick={handleGenerateLearningPlan} className="mt-4" variant="secondary">
                                            <Bot className="mr-2 h-4 w-4"/>
                                            Chat with AI Career Advisor for more details
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
