
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SmartMatchInternships } from '@/components/smart-match-internships';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth.tsx';
import { useEffect, useMemo } from 'react';
import { useStudentProfile } from '@/hooks/use-student-profile.tsx';
import { useApplications } from '@/hooks/use-applications';
import { Progress } from '@/components/ui/progress';
import { InfoCard } from '@/components/info-card';
import { Briefcase, FileText, UserCheck, IndianRupee, Search, Award } from 'lucide-react';
import { LearnSkill } from '@/components/learn-skill';


export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const { profile, isLoading: profileLoading } = useStudentProfile();
    const { applications } = useApplications();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login');
        }
    }, [user, authLoading, router]);

    const profileCompletion = useMemo(() => {
        if (!profile) return 0;
        let completed = 0;
        const total = 5; // personalInfo, skills, preferences, resumeSummary, eligibility
        if (profile.personalInfo && Object.values(profile.personalInfo).every(v => v)) completed++;
        if (profile.skills && profile.skills.length > 0) completed++;
        if (profile.preferences && Object.values(profile.preferences).every(v => v)) completed++;
        if (profile.resumeSummary) completed++;
        if (profile.eligibility && Object.values(profile.eligibility).every(v => v !== undefined)) completed++;
        return (completed / total) * 100;
    }, [profile]);
    
    const schemeBenefits = [
        {
            icon: <Award className="h-8 w-8" />,
            title: "Real Experience",
            description: "12 months of hands-on experience in India's top companies."
        },
        {
            icon: <IndianRupee className="h-8 w-8" />,
            title: "Financial Support",
            description: "A monthly stipend and a one-time grant for incidental expenses."
        },
        {
            icon: <Search className="h-8 w-8" />,
            title: "Diverse Opportunities",
            description: "Choose from a wide variety of sectors and leading organizations."
        },
        {
            icon: <UserCheck className="h-8 w-8" />,
            title: "Skill Development",
            description: "Enhance your professional skills and improve your employability."
        },
    ];

    if (authLoading || profileLoading || !user) {
        return (
             <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

  return (
    <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {profile?.personalInfo.name?.split(' ')[0] || 'Intern'}!
            </h1>
            <p className="text-muted-foreground">
                Here's your personal dashboard to track and find the best opportunities.
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard title="Applications Sent" value={applications.length} icon={<FileText />} description="Keep track of all your applications."/>
            <InfoCard title="New Programs" value="10+" icon={<Briefcase />} description="New programs available this week."/>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-medium">Profile Completion</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={profileCompletion} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">{Math.round(profileCompletion)}% complete</p>
                </CardContent>
            </Card>
        </div>

        <Separator />
        
        <SmartMatchInternships />

        <Separator />
        
        <LearnSkill />
        
        <Separator />

        <div>
            <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold tracking-tight">PM Internship Scheme Benefits</h2>
                <p className="text-muted-foreground">
                    Understand the advantages of participating in this premier national scheme.
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 {schemeBenefits.map((item, index) => (
                    <Card key={index} className="flex flex-col items-center text-center p-6">
                        <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
                             {item.icon}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                    </Card>
                ))}
            </div>
        </div>
    </div>
  );
}
