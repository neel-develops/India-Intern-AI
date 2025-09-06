'use client';

import { useState } from 'react';
import { BrainCircuit, BookOpen, Rocket, PlusCircle, Youtube, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateLearningPlan } from '@/ai/flows/generate-learning-plan';
import type { GenerateLearningPlanOutput } from '@/ai/flows/generate-learning-plan';
import { Skeleton } from './ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { useAuth } from '@/hooks/use-auth';

export function LearnSkill() {
  const [skill, setSkill] = useState('');
  const [learningPlan, setLearningPlan] = useState<GenerateLearningPlanOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();
  const { profile, saveProfile } = useStudentProfile();
  const { user } = useAuth();

  const handleGeneratePlan = async () => {
    if (!skill.trim()) {
      toast({
        variant: 'destructive',
        title: 'Skill Required',
        description: 'Please enter a skill you want to learn.',
      });
      return;
    }

    setIsAiLoading(true);
    setLearningPlan(null);

    try {
      const result = await generateLearningPlan({ skill });
      setLearningPlan(result);
    } catch (error) {
      console.error('AI learning plan error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate a learning plan. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleAddSkillToProfile = () => {
      if (!profile || !user) {
        toast({
            variant: 'destructive',
            title: 'Profile not found',
            description: 'Please create a profile first.'
        });
        return;
      }
      
      const updatedSkills = [...profile.skills, skill];
      const updatedProfile = {
          ...profile,
          skills: updatedSkills
      };
      
      saveProfile(user.uid, updatedProfile);
      
      toast({
          title: 'Skill Added!',
          description: `"${skill}" has been added to your profile.`,
      });
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-accent/30 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BrainCircuit className="h-8 w-8 text-primary" />
            Learn a New Skill with AI
          </CardTitle>
          <CardDescription>
            Tell us what skill you want to learn, and our AI will generate a personalized roadmap to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-2">
          <Input
            placeholder="e.g., Blockchain, Solidity, Data Visualization..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="text-base flex-grow"
          />
          <Button onClick={handleGeneratePlan} disabled={isAiLoading} size="lg">
            {isAiLoading ? 'Generating Plan...' : 'Generate Learning Plan'}
          </Button>
        </CardContent>
      </Card>
      
      {isAiLoading && (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      )}

      {learningPlan && (
        <Card>
            <CardHeader>
                <CardTitle>Your Learning Plan for: <span className="text-primary">{skill}</span></CardTitle>
                <CardDescription>Follow these steps and build the project to master this skill.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><BookOpen className="h-5 w-5"/> Learning Steps</h3>
                     <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {learningPlan.learningPlan.map((step, index) => (
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
                                            <h4 className="font-semibold pt-2 flex items-center gap-2"><Youtube className="h-5 w-5 text-red-600" /> YouTube Resources:</h4>
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
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                     <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Rocket className="h-5 w-5"/> Project Idea: {learningPlan.projectIdea.title}</h3>
                     <p className="text-muted-foreground">{learningPlan.projectIdea.description}</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleAddSkillToProfile}>
                    <PlusCircle className="mr-2" /> Add "{skill}" to My Skills
                </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
