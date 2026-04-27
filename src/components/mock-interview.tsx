

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Send, User, Bot, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { startMockInterview  } from '@/lib/api';
import type { Message } from '@/ai/flows/start-mock-interview-types';
import { Skeleton } from './ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { marked } from 'marked';


export function MockInterview() {
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [finalReport, setFinalReport] = useState<{score: number; feedback: string; tips: string[]}| null>(null);

  const { toast } = useToast();
  const { profile, isLoading: profileLoading } = useStudentProfile();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [conversation]);

  const handleStartInterview = async () => {
    if (!selectedSkill) {
      toast({ variant: 'destructive', title: 'Please select a skill.' });
      return;
    }
    setInterviewStarted(true);
    setIsAiLoading(true);
    try {
      const result = await startMockInterview({ skill: selectedSkill, history: [] });
      setConversation([{ role: 'model', content: result.response }]);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error starting interview.' });
      setInterviewStarted(false);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newConversation: Message[] = [...conversation, { role: 'user', content: userInput }];
    setConversation(newConversation);
    setUserInput('');
    setIsAiLoading(true);

    try {
      const result = await startMockInterview({ skill: selectedSkill, history: newConversation });
      let modelResponse = result.response;
      if (result.feedback) {
          modelResponse = `**Feedback on your last answer:** ${result.feedback}\n\n**Next Question:**\n${result.response}`;
      }
      setConversation([...newConversation, { role: 'model', content: modelResponse }]);

      if (result.interviewFinished) {
          setInterviewFinished(true);
          setFinalReport({
              score: result.finalScore || 0,
              feedback: result.overallFeedback || '',
              tips: result.improvementTips || [],
          });
      }

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error sending message.' });
    } finally {
      setIsAiLoading(false);
    }
  };

  if (profileLoading) return <Skeleton className="h-96 w-full" />;

  if (!profile || profile.skills.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Mock Interviewer</CardTitle>
          <CardDescription>Add some skills to your profile to start a mock interview.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/profile">Go to Profile</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BrainCircuit className="h-8 w-8 text-primary" />
            AI Mock Interviewer
          </CardTitle>
          <CardDescription>
            Practice your interview skills with our AI. Select a skill from your profile to begin.
          </CardDescription>
        </CardHeader>
        {!interviewStarted && (
            <CardContent className="flex flex-col sm:flex-row gap-2 items-center">
                <Select onValueChange={setSelectedSkill} value={selectedSkill}>
                    <SelectTrigger className="w-full sm:w-[280px]">
                        <SelectValue placeholder="Select a skill to practice" />
                    </SelectTrigger>
                    <SelectContent>
                        {profile.skills.map(skill => (
                            <SelectItem key={skill.name} value={skill.name}>{skill.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleStartInterview} disabled={!selectedSkill || isAiLoading}>
                    {isAiLoading ? "Starting..." : "Start Interview"}
                </Button>
            </CardContent>
        )}
      </Card>

      {interviewStarted && (
        <Card>
          <CardHeader>
            <CardTitle>Interview in Progress: {selectedSkill}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full p-4 border rounded-md" ref={scrollAreaRef}>
              <div className="space-y-4">
                {conversation.map((msg, index) => (
                  <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                    {msg.role === 'model' && <Bot className="h-6 w-6 text-primary shrink-0" />}
                    <div className={cn("p-3 rounded-lg max-w-lg prose prose-sm", msg.role === 'model' ? 'bg-muted' : 'bg-primary text-primary-foreground prose-invert')}>
                      <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}/>
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
          {!interviewFinished ? (
            <CardFooter className="gap-2">
              <Textarea
                placeholder="Type your answer..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={isAiLoading}
              />
              <Button onClick={handleSendMessage} disabled={isAiLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </CardFooter>
          ) : finalReport ? (
              <CardFooter className="flex-col items-start gap-4 p-6 border-t">
                  <h3 className="text-xl font-bold">Interview Concluded</h3>
                  <div className="grid md:grid-cols-2 gap-4 w-full">
                      <Card className="p-4">
                          <CardTitle className="flex items-center gap-2 mb-2"><Star className="text-yellow-500"/> Final Score</CardTitle>
                          <p className="text-4xl font-bold text-primary">{finalReport.score}/10</p>
                      </Card>
                       <Card className="p-4">
                          <CardTitle className="mb-2">Overall Feedback</CardTitle>
                          <p className="text-sm text-muted-foreground">{finalReport.feedback}</p>
                      </Card>
                  </div>
                   <Card className="p-4 w-full">
                        <CardTitle className="mb-2">Improvement Tips</CardTitle>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {finalReport.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                    </Card>
              </CardFooter>
          ) : null }
        </Card>
      )}
    </div>
  );
}
