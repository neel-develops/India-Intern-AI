'use client';
import { useState, useRef, useEffect } from 'react';
import { Mic, Bot, User, Send, CheckCircle, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { startMockInterview } from '@/ai/flows/start-mock-interview';
import type { StartMockInterviewOutput } from '@/ai/flows/start-mock-interview-types';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';

interface Message {
    role: 'user' | 'model';
    content: string;
    feedback?: string;
}

export function MockInterview() {
    const [internshipTitle, setInternshipTitle] = useState('');
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { profile, isLoading: isProfileLoading } = useStudentProfile();
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleStartInterview = async () => {
        if (!internshipTitle.trim()) {
            toast({ variant: 'destructive', title: 'Please enter an internship title.' });
            return;
        }
        setIsAiLoading(true);
        setInterviewStarted(true);
        try {
            const result = await startMockInterview({
                internshipTitle,
                userSkills: profile?.skills || [],
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
                internshipTitle,
                userSkills: profile?.skills || [],
                history: newMessages,
            });
            
            const newAiMessage: Message = {
                role: 'model',
                content: result.interviewerMessage,
                feedback: result.feedback,
            };

            setMessages([...newMessages, newAiMessage]);

            if (result.isInterviewOver) {
                 toast({ title: 'Interview Complete!', description: 'Great job completing the mock interview.' });
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
                        AI Mock Interview
                    </CardTitle>
                    <CardDescription>Practice your interview skills with our AI. Enter the title of the internship you want to practice for.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="e.g., Frontend Developer Intern"
                        value={internshipTitle}
                        onChange={(e) => setInternshipTitle(e.target.value)}
                    />
                </CardContent>
                <CardFooter>
                    <Button onClick={handleStartInterview} disabled={isAiLoading}>
                        {isAiLoading ? 'Starting...' : 'Start Interview'}
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col h-[75vh]">
            <CardHeader>
                <CardTitle>Mock Interview: <span className="text-primary">{internshipTitle}</span></CardTitle>
                <CardDescription>Respond to the interviewer's questions below.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <Bot className={`h-8 w-8 p-1.5 rounded-full bg-muted ${message.role === 'user' ? 'hidden' : ''}`} />
                                    <User className={`h-8 w-8 p-1.5 rounded-full bg-primary text-primary-foreground ${message.role === 'model' ? 'hidden' : ''}`} />
                                    <div className={`rounded-lg p-3 max-w-md ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm">{message.content}</p>
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
                        {isAiLoading && <Skeleton className="h-16 w-3/4" />}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="pt-4 border-t">
                 <div className="flex w-full items-center space-x-2">
                    <Textarea
                        placeholder="Type your answer here..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && !isAiLoading && handleSendAnswer()}
                        disabled={isAiLoading}
                        className="flex-grow"
                        rows={2}
                    />
                    <Button onClick={handleSendAnswer} disabled={isAiLoading}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
