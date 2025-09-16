'use client';
import { useState, useRef, useEffect, use } from 'react';
import { Bot, User, Send, CheckCircle, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { startMockInterview } from '@/ai/flows/start-mock-interview';
import type { StartMockInterviewOutput } from '@/ai/flows/start-mock-interview-types';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface Message {
    role: 'user' | 'model';
    content: string;
    feedback?: string;
}

interface FinalFeedback {
    summary: string;
    score: number;
    tips: string[];
}

export function MockInterview() {
    const [selectedSkill, setSelectedSkill] = useState('');
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [finalFeedback, setFinalFeedback] = useState<FinalFeedback | null>(null);
    const [userInput, setUserInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { profile, isLoading: isProfileLoading } = useStudentProfile();
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, finalFeedback]);

    const handleStartInterview = async () => {
        if (!selectedSkill.trim()) {
            toast({ variant: 'destructive', title: 'Please select a skill for the interview.' });
            return;
        }
        setIsAiLoading(true);
        setInterviewStarted(true);
        setFinalFeedback(null);
        setMessages([]);
        try {
            const result = await startMockInterview({
                skillToInterview: selectedSkill,
            });
            setMessages([{ role: 'model', content: result.interviewerMessage }]);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error starting interview.' });
            setInterviewStarted(false);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSendAnswer = async () => {
        if (!userInput.trim()) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsAiLoading(true);

        try {
            const result = await startMockInterview({
                skillToInterview: selectedSkill,
                history: newMessages,
            });
            
            if (result.isInterviewOver && result.summary && result.score && result.tips) {
                setFinalFeedback({
                    summary: result.summary,
                    score: result.score,
                    tips: result.tips,
                });
                toast({ title: 'Interview Complete!', description: 'Great job! Check out your final feedback below.' });
            } else {
                 const newAiMessage: Message = {
                    role: 'model',
                    content: result.interviewerMessage,
                    feedback: result.feedback,
                };
                setMessages([...newMessages, newAiMessage]);
            }

        } catch (error) {
            console.error('AI interview error:', error);
            toast({ variant: 'destructive', title: 'Error during interview.' });
            setMessages(messages); // Revert on error
        } finally {
            setIsAiLoading(false);
        }
    };
    
    if(isProfileLoading) return <Skeleton className="h-64 w-full" />;
    
    if(!profile) return (
        <Card>
            <CardHeader>
                <CardTitle>Mock Interview</CardTitle>
                <CardDescription>Please create your profile to start a mock interview.</CardDescription>
            </CardHeader>
        </Card>
    );

    if (!interviewStarted) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <BrainCircuit className="h-8 w-8 text-primary" />
                        AI Mock Interviewer
                    </CardTitle>
                    <CardDescription>Practice your interview skills with our AI. Select a primary skill from your profile to begin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select onValueChange={setSelectedSkill} value={selectedSkill}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a skill from your profile..." />
                        </SelectTrigger>
                        <SelectContent>
                            {profile.skills.length > 0 ? profile.skills.map(skill => (
                                <SelectItem key={skill.name} value={skill.name}>{skill.name}</SelectItem>
                            )) : <SelectItem value="noskills" disabled>No skills found in profile</SelectItem>}
                        </SelectContent>
                    </Select>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleStartInterview} disabled={isAiLoading || profile.skills.length === 0}>
                        {isAiLoading ? 'Starting...' : 'Start Interview'}
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col h-[80vh]">
            <CardHeader>
                <CardTitle>Mock Interview: <span className="text-primary">{selectedSkill}</span></CardTitle>
                <CardDescription>Respond to the interviewer's questions below. Good luck!</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <Bot className={`h-8 w-8 p-1.5 rounded-full bg-muted shrink-0 ${message.role === 'user' ? 'hidden' : ''}`} />
                                    <User className={`h-8 w-8 p-1.5 rounded-full bg-primary text-primary-foreground shrink-0 ${message.role === 'model' ? 'hidden' : ''}`} />
                                    <div className={`rounded-lg p-3 max-w-md ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                                {message.feedback && (
                                    <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 ml-11 max-w-md">
                                        <CardContent className="p-3">
                                            <p className="text-xs text-green-800 dark:text-green-200"><span className="font-semibold">Feedback:</span> {message.feedback}</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        ))}
                        {isAiLoading && <div className="flex items-start gap-3"><Bot className="h-8 w-8 p-1.5 rounded-full bg-muted shrink-0"/><Skeleton className="h-16 w-3/4" /></div>}
                        {finalFeedback && (
                            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                                <CardHeader>
                                    <CardTitle>Interview Complete!</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Final Score: {finalFeedback.score}/10</h3>
                                        <Progress value={finalFeedback.score * 10} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Summary:</h3>
                                        <p className="text-sm text-muted-foreground">{finalFeedback.summary}</p>
                                    </div>
                                     <div>
                                        <h3 className="font-semibold">Improvement Tips:</h3>
                                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                                            {finalFeedback.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                        </ul>
                                    </div>
                                    <Button onClick={() => setInterviewStarted(false)}>Start a New Interview</Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="pt-4 border-t">
                 <div className="flex w-full items-center space-x-2">
                    <Textarea
                        placeholder={finalFeedback ? "The interview has ended." : "Type your answer here..."}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && !isAiLoading && handleSendAnswer()}
                        disabled={isAiLoading || !!finalFeedback}
                        className="flex-grow"
                        rows={2}
                    />
                    <Button onClick={handleSendAnswer} disabled={isAiLoading || !!finalFeedback}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
