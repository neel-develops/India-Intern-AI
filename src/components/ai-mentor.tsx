'use client';
import { useState } from 'react';
import { Sparkles, Bot, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { askAiMentor } from '@/ai/flows/ask-ai-mentor';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export function AIMentor() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { toast } = useToast();

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsAiLoading(true);

        try {
            const result = await askAiMentor({
                question: userInput,
                history: messages,
            });
            setMessages([...newMessages, { role: 'model', content: result.answer }]);
        } catch (error) {
            console.error('AI mentor error:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not get a response from the mentor. Please try again.',
            });
             // Remove the user's message if the AI fails to respond
            setMessages(messages);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[70vh]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="h-8 w-8 text-primary" />
                    AI Career Mentor
                </CardTitle>
                <CardDescription>
                    Ask for career advice, resume tips, or anything else to help you on your internship journey.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                 <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                {message.role === 'model' && (
                                    <Avatar>
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`rounded-lg p-3 max-w-md ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                        placeholder="Ask your question..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isAiLoading && handleSendMessage()}
                        disabled={isAiLoading}
                        className="flex-grow"
                    />
                    <Button onClick={handleSendMessage} disabled={isAiLoading}>
                       <Send className="h-4 w-4" />
                       <span className="sr-only">Send</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
