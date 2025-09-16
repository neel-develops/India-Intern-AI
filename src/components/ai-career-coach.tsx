
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Bot, User, Send, BrainCircuit, BookOpen, Rocket, Youtube, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { careerCoach } from '@/ai/flows/career-coach';
import type { CareerCoachOutput, GenerateLearningPlanOutput } from '@/ai/flows/career-coach-types';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface Message {
    role: 'user' | 'model';
    content: string;
    learningPlan?: GenerateLearningPlanOutput | null;
}

export function AICareerCoach() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { toast } = useToast();
    const searchParams = useSearchParams();

    useEffect(() => {
        const prompt = searchParams.get('prompt');
        if (prompt) {
            handleSendMessage(prompt);
        }
    }, [searchParams]);
    
    const suggestedPrompts = [
        "How do I prepare for a technical interview?",
        "Create a learning plan for Python",
        "What are some in-demand skills for web developers?",
        "How can I improve my resume?",
    ];

    const handleSendMessage = async (prompt?: string) => {
        const messageText = prompt || userInput;
        if (!messageText.trim()) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: messageText }];
        setMessages(newMessages);
        setUserInput('');
        setIsAiLoading(true);

        try {
            const result = await careerCoach({
                question: messageText,
                history: messages,
            });

            const newAiMessage: Message = {
                role: 'model',
                content: result.answer,
                learningPlan: result.learningPlan,
            };

            setMessages([...newMessages, newAiMessage]);

        } catch (error) {
            console.error('AI career coach error:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not get a response from the coach. Please try again.',
            });
            setMessages(messages);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[80vh]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="h-8 w-8 text-primary" />
                    AI Career Coach
                </CardTitle>
                <CardDescription>
                    Your personal guide for career advice and skill development. Ask a question or ask for a learning plan.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                 <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                         {messages.length === 0 && !isAiLoading && (
                            <div className="p-4 rounded-lg bg-muted/50">
                                <h4 className="font-semibold mb-2">Welcome! How can I help you today?</h4>
                                <p className="text-sm text-muted-foreground mb-4">Here are some things you can ask:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {suggestedPrompts.map((prompt, i) => (
                                        <Button key={i} variant="outline" size="sm" className="h-auto justify-start text-left" onClick={() => handleSendMessage(prompt)}>
                                            <p className="whitespace-normal">{prompt}</p>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                {message.role === 'model' && (
                                    <Avatar>
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`rounded-lg p-3 max-w-2xl ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    {message.learningPlan && (
                                        <div className="mt-4 bg-background/50 rounded-lg p-2">
                                             <Accordion type="single" collapsible className="w-full">
                                                {message.learningPlan.learningPlan.map((step, index) => (
                                                    <AccordionItem value={`item-${index}`} key={index}>
                                                        <AccordionTrigger className="text-base">{index+1}. {step.step}</AccordionTrigger>
                                                        <AccordionContent className="space-y-4 pl-2">
                                                            <p className="text-muted-foreground">{step.description}</p>
                                                            {step.resources.length > 0 && (
                                                                <div>
                                                                    <h4 className="font-semibold pt-2">Resources:</h4>
                                                                    <ul className="list-disc list-inside text-muted-foreground">
                                                                        {step.resources.map((resource, rIndex) => <li key={rIndex}><a href={resource} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{resource}</a></li>)}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                             {step.youtubeResources.length > 0 && (
                                                                <div>
                                                                    <h4 className="font-semibold pt-2 flex items-center gap-2"><Youtube className="h-5 w-5 text-red-600" /> YouTube:</h4>
                                                                    <ul className="list-disc list-inside text-muted-foreground">
                                                                        {step.youtubeResources.map((resource, rIndex) => <li key={rIndex}><a href={resource} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{resource}</a></li>)}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {step.freeCertifications.length > 0 && (
                                                                <div>
                                                                    <h4 className="font-semibold pt-2 flex items-center gap-2"><Award className="h-5 w-5 text-yellow-500" /> Free Certifications:</h4>
                                                                    <ul className="list-disc list-inside text-muted-foreground">
                                                                        {step.freeCertifications.map((resource, rIndex) => <li key={rIndex}><a href={resource} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{resource}</a></li>)}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                            <div className="p-4 mt-4 bg-muted/50 rounded-lg">
                                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Rocket className="h-5 w-5"/> Project Idea: {message.learningPlan.projectIdea.title}</h3>
                                                <p className="text-muted-foreground">{message.learningPlan.projectIdea.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {message.role === 'user' && (
                                    <Avatar>
                                        <AvatarFallback><User/></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isAiLoading && (
                             <div className="flex items-start gap-3">
                                <Avatar>
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                                <div className="rounded-lg p-3 bg-muted">
                                   <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        )}
                    </div>
                 </ScrollArea>
            </CardContent>
            <CardFooter className="pt-4 border-t">
                <div className="flex w-full items-center space-x-2">
                    <Input
                        placeholder="Ask a question or request a learning plan..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isAiLoading && handleSendMessage()}
                        disabled={isAiLoading}
                        className="flex-grow"
                    />
                    <Button onClick={() => handleSendMessage()} disabled={isAiLoading}>
                       <Send className="h-4 w-4" />
                       <span className="sr-only">Send</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
