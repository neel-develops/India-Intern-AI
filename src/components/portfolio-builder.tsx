'use client';
import { useState, useRef } from 'react';
import { Wand2, User, Mail, Linkedin, Rocket, Star, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { generatePortfolio } from '@/ai/flows/generate-portfolio';
import type { GeneratePortfolioOutput } from '@/ai/flows/generate-portfolio-types';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function PortfolioBuilder() {
    const [portfolio, setPortfolio] = useState<GeneratePortfolioOutput | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const { profile, isLoading: isProfileLoading } = useStudentProfile();
    const { toast } = useToast();
    const portfolioRef = useRef<HTMLDivElement>(null);

    const handleGeneratePortfolio = async () => {
        if (!profile) return;
        setIsAiLoading(true);
        setPortfolio(null);
        try {
            const result = await generatePortfolio({
                name: profile.personalInfo.name,
                email: profile.personalInfo.email,
                linkedin: profile.personalInfo.linkedin,
                resumeSummary: profile.resumeSummary,
                skills: profile.skills,
            });
            setPortfolio(result);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error generating portfolio.' });
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
        const element = portfolioRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('portfolio.pdf');
    };
    
    if(isProfileLoading) return <Skeleton className="h-64 w-full" />;
    
    if(!profile) return (
        <Card>
            <CardHeader>
                <CardTitle>Portfolio Builder</CardTitle>
                <CardDescription>Please create your profile to build a portfolio.</CardDescription>
            </CardHeader>
        </Card>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Wand2 className="h-8 w-8 text-primary" />
                        AI Portfolio Builder
                    </CardTitle>
                    <CardDescription>Generate a professional one-page portfolio based on your profile with a single click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGeneratePortfolio} disabled={isAiLoading}>
                        {isAiLoading ? 'Generating...' : 'Generate My Portfolio'}
                    </Button>
                </CardContent>
            </Card>

            {isAiLoading && <Skeleton className="w-full h-96" />}
            
            {portfolio && (
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle>Your Professional Portfolio</CardTitle>
                            <CardDescription>Review your generated portfolio below. You can copy the content or download it as a PDF.</CardDescription>
                        </div>
                         <Button onClick={handleDownloadPdf}>
                            <Download className="mr-2 h-4 w-4"/> Download PDF
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div ref={portfolioRef} className="p-8 border rounded-lg bg-background">
                            <header className="text-center border-b pb-6 mb-6">
                                <h1 className="text-4xl font-bold">{profile.personalInfo.name}</h1>
                                <p className="text-xl text-primary font-medium mt-1">{portfolio.professionalTitle}</p>
                                <div className="flex justify-center items-center gap-6 mt-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {profile.personalInfo.email}</div>
                                    {profile.personalInfo.linkedin && <div className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> <a href={profile.personalInfo.linkedin} className="hover:underline">{profile.personalInfo.linkedin}</a></div>}
                                </div>
                            </header>

                            <main className="space-y-8">
                                <section>
                                    <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2"><User className="h-6 w-6 text-primary" /> About Me</h2>
                                    <p className="text-muted-foreground">{portfolio.aboutMe}</p>
                                </section>

                                 <section>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Star className="h-6 w-6 text-primary" /> Key Skills</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {portfolio.skillHighlights.map((highlight, index) => (
                                            <div key={index}>
                                                <h3 className="font-semibold text-lg">{highlight.skill}</h3>
                                                <p className="text-muted-foreground text-sm">{highlight.showcase}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><Rocket className="h-6 w-6 text-primary" /> Project Showcase Ideas</h2>
                                    <div className="space-y-6">
                                        {portfolio.projectIdeas.map((project, index) => (
                                            <div key={index} className="p-4 border-l-4 border-primary bg-muted/50 rounded-r-lg">
                                                <h3 className="font-semibold text-xl">{project.title}</h3>
                                                <p className="text-muted-foreground my-2">{project.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.skillsUsed.map(skill => <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{skill}</span>)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </main>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
