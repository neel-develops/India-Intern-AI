
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GraduationCap, Send, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { chatWithCareerCoach } from '@/ai/flows/career-coach';
import type { Message } from '@/ai/flows/career-coach-types';
import { Skeleton } from './ui/skeleton';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { marked } from 'marked';

export function AICareerCoach() {
  const searchParams = useSearchParams();
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();
  const { profile, isLoading: profileLoading } = useStudentProfile();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [conversation]);
  
  const handleSendMessage = useCallback(async (message?: string) => {
    const currentInput = message || userInput;
    if (!currentInput.trim() || !profile) return;

    const newConversation: Message[] = [...conversation, { role: 'user', content: currentInput }];
    setConversation(newConversation);
    setUserInput('');
    setIsAiLoading(true);

    try {
      const result = await chatWithCareerCoach({
        studentProfile: {
          personalInfo: {
            name: profile.personalInfo.name,
            degree: profile.personalInfo.degree,
            stream: profile.personalInfo.stream,
          },
          skills: profile.skills.map(s => ({ name: s.name, proficiency: s.proficiency })),
          preferences: profile.preferences,
        },
        history: newConversation,
      });
      setConversation([...newConversation, { role: 'model', content: result.response }]);
    } catch (error) {
      console.error('AI career coach error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get career advice. Please try again.',
      });
      // Add the user's message back if the API fails
      setConversation(conversation);
    } finally {
      setIsAiLoading(false);
    }
  }, [conversation, profile, userInput, toast]);

   useEffect(() => {
    if (profile && !hasInitialized.current) {
      const initialPrompt = searchParams.get('prompt');
      if (initialPrompt) {
        hasInitialized.current = true;
        handleSendMessage(initialPrompt);
      }
    }
  }, [profile, searchParams, handleSendMessage]);

  if (profileLoading) return <Skeleton className="h-96 w-full" />;

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
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <GraduationCap className="h-8 w-8 text-primary" />
            AI Career Advisor
          </CardTitle>
          <CardDescription>
            Chat with our AI to get a personalized career roadmap based on your unique profile, skills, and interests.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <ScrollArea className="h-[400px] w-full p-4 border rounded-md" ref={scrollAreaRef}>
            <div className="space-y-4">
              {conversation.length === 0 && (
                <div className="text-center text-muted-foreground">
                  <p>Ask me anything about your career path!</p>
                  <p className="text-sm">e.g., "What jobs can I get with my skills?" or "Create a learning plan for me to become a data analyst."</p>
                </div>
              )}
              {conversation.map((msg, index) => (
                <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                  {msg.role === 'model' && <Bot className="h-6 w-6 text-primary shrink-0" />}
                  <div className={cn("p-3 rounded-lg max-w-lg prose prose-sm", msg.role === 'model' ? 'bg-muted' : 'bg-primary text-primary-foreground prose-invert')}>
                     <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
                  </div>
                  {msg.role === 'user' && <User className="h-6 w-6 shrink-0" />}
                </div>
              ))}
              {isAiLoading && (
                  <div className="flex items-start gap-3">
                      <Bot className="h-6 w-6 text-primary shrink-0" />
                      <div className="p-3 rounded-lg bg-muted"><Skeleton className="h-5 w-24" /></div>
                  </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="gap-2">
          <Textarea
            placeholder="Ask for career advice..."
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            disabled={isAiLoading}
          />
          <Button onClick={() => handleSendMessage()} disabled={isAiLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
