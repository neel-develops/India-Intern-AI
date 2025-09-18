
'use client';
import { useParams } from 'next/navigation';
import { studentProfiles, internships } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Download, Mail, Phone, Linkedin, University, BookOpen, Calendar, Star, FileText, MessageSquare, BarChart3, Bot, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function getInitials(name: string) {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export default function CandidateProfilePage() {
    const params = useParams();
    const { studentEmail, id: internshipId } = params;

    const student = studentProfiles.find(p => p.personalInfo.email === decodeURIComponent(studentEmail as string));
    const internship = internships.find(i => i.id === internshipId);

    if (!student || !internship) {
        return <div>Candidate or Internship not found.</div>;
    }

    const testScores = {
        aptitude: 85,
        technical: 78,
        overall: 82,
    };
    
    return (
        <div className="container mx-auto max-w-6xl py-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
                <Avatar className="h-24 w-24 border-4 border-primary">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.personalInfo.name}`} />
                    <AvatarFallback>{getInitials(student.personalInfo.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <h1 className="text-4xl font-bold">{student.personalInfo.name}</h1>
                    <p className="text-lg text-muted-foreground">Applicant for: <span className="font-semibold text-primary">{internship.title}</span></p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> {student.personalInfo.email}</span>
                        <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 12345 67890</span>
                        <a href={student.personalInfo.linkedin} target="_blank" className="flex items-center gap-2 hover:text-primary"><Linkedin className="h-4 w-4" /> LinkedIn Profile</a>
                    </div>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4"/> Download Profile as PDF</Button>
            </div>
            
            <Separator />

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between"><span>Location:</span> <span className="font-medium">{student.personalInfo.location}</span></div>
                            <div className="flex justify-between"><span>Age:</span> <span className="font-medium">{student.personalInfo.age}</span></div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Education</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-start gap-2"><University className="h-4 w-4 mt-0.5 shrink-0" /><p><span className="font-medium">{student.personalInfo.university}</span></p></div>
                             <div className="flex items-start gap-2"><BookOpen className="h-4 w-4 mt-0.5 shrink-0" /><p><span className="font-medium">{student.personalInfo.degree}</span> in {student.personalInfo.stream}</p></div>
                             <div className="flex items-start gap-2"><Calendar className="h-4 w-4 mt-0.5 shrink-0" /><p>Graduating <span className="font-medium">{student.personalInfo.graduatingYear}</span></p></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Resume Summary</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground">{student.resumeSummary}</p></CardContent>
                    </Card>
                </div>
                
                {/* Right Column */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {student.skills.map(skill => (
                                <Badge key={skill.name} variant="secondary">{skill.name} (Self: {skill.proficiency}/5)</Badge>
                            ))}
                        </CardContent>
                    </Card>
                    
                     <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 /> Test Scores</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1"><p>Aptitude Score</p><p className="font-medium">{testScores.aptitude}%</p></div>
                                <Progress value={testScores.aptitude} />
                            </div>
                             <div>
                                <div className="flex justify-between mb-1"><p>Technical Score</p><p className="font-medium">{testScores.technical}%</p></div>
                                <Progress value={testScores.technical} />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1"><p className="font-bold">Overall Score</p><p className="font-bold text-primary">{testScores.overall}%</p></div>
                                <Progress value={testScores.overall} />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare /> Recruiter Notes & Feedback</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <Textarea placeholder={`Add your notes for ${student.personalInfo.name}...`} rows={4} />
                             <Button>Save Note</Button>
                             <Separator />
                             <div className="text-sm text-muted-foreground">No notes added yet.</div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
