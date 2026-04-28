

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SmartMatchInternships } from '@/components/smart-match-internships';
import { Separator } from '@/components/ui/separator';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useMemo } from 'react';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { useApplications } from '@/hooks/use-applications';
import { useSavedInternships } from '@/hooks/use-saved-internships';
import { Progress } from '@/components/ui/progress';
import { InfoCard } from '@/components/info-card';
import {
  Briefcase, FileText, UserCheck, IndianRupee, Search,
  Award, Bookmark, Sparkles, ArrowRight, CheckCircle2, Clock, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Application } from '@/lib/types';

const STATUS_STYLES: Record<string, { color: string; icon: React.ReactNode }> = {
  Applied: { color: 'bg-blue-500/20 text-blue-400', icon: <Clock className="h-3.5 w-3.5" /> },
  'In Review': { color: 'bg-yellow-500/20 text-yellow-400', icon: <Clock className="h-3.5 w-3.5" /> },
  Interview: { color: 'bg-purple-500/20 text-purple-400', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  Offered: { color: 'bg-green-500/20 text-green-400', icon: <Award className="h-3.5 w-3.5" /> },
  Rejected: { color: 'bg-red-500/20 text-red-400', icon: <XCircle className="h-3.5 w-3.5" /> },
};

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const { profile, isLoading: profileLoading } = useStudentProfile();
    const { applications, isLoading: applicationsLoading } = useApplications();
    const { savedIds } = useSavedInternships();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    const profileCompletion = useMemo(() => {
        if (!profile) return 0;
        let completed = 0;
        const total = 5;
        if (profile.personalInfo && Object.values(profile.personalInfo).some(v => v)) completed++;
        if (profile.skills && profile.skills.length > 0) completed++;
        if (profile.preferences && Object.values(profile.preferences).some(v => v)) completed++;
        if (profile.resumeSummary) completed++;
        if (profile.eligibility) completed++;
        return Math.round((completed / total) * 100);
    }, [profile]);

    // AI Match Score: rough heuristic based on profile completion + skills count
    const aiMatchScore = useMemo(() => {
        if (!profile) return 0;
        const skillsScore = Math.min((profile.skills?.length ?? 0) * 10, 50);
        const profileScore = profileCompletion * 0.5;
        return Math.min(Math.round(skillsScore + profileScore), 99);
    }, [profile, profileCompletion]);

    const recentApps = useMemo(() =>
      [...applications].sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()).slice(0, 4),
      [applications]
    );

    const schemeBenefits = [
        { icon: <Award className="h-8 w-8" />, title: "Real Experience", description: "12 months of hands-on experience in India's top companies." },
        { icon: <IndianRupee className="h-8 w-8" />, title: "Financial Support", description: "A monthly stipend and a one-time grant for incidental expenses." },
        { icon: <Search className="h-8 w-8" />, title: "Diverse Opportunities", description: "Choose from a wide variety of sectors and leading organizations." },
        { icon: <UserCheck className="h-8 w-8" />, title: "Skill Development", description: "Enhance your professional skills and improve your employability." },
    ];

    const aiTools = [
      { href: '/resume-analyser', label: 'Resume Analyser', icon: <FileText className="h-5 w-5" />, desc: 'Get AI-powered feedback on your resume' },
      { href: '/skill-gap-visualizer', label: 'Skill Gap', icon: <Briefcase className="h-5 w-5" />, desc: 'Identify missing skills for target roles' },
      { href: '/career-coach', label: 'Career Coach', icon: <Sparkles className="h-5 w-5" />, desc: 'AI-powered career guidance chat' },
      { href: '/mock-interview', label: 'Mock Interview', icon: <UserCheck className="h-5 w-5" />, desc: 'Practice with AI interview simulations' },
    ];

    if (authLoading || profileLoading || applicationsLoading || !user) {
        return (
             <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

  return (
    <div className="space-y-8">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {profile?.personalInfo.name?.split(' ')[0] || 'Intern'}! 👋
            </h1>
            <p className="text-muted-foreground">
                Here's your personal dashboard to track and find the best opportunities.
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <InfoCard title="Applications Sent" value={applications.length} icon={<FileText />} description="Keep track of all your applications." />
            <InfoCard title="Saved Internships" value={savedIds.length} icon={<Bookmark />} description="Internships you've bookmarked." />
            <InfoCard title="AI Match Score" value={`${aiMatchScore}%`} icon={<Sparkles />} description="Based on your profile & skills." />
            <Card className="bg-card/70 backdrop-blur-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-violet-400" />
                      Profile Completion
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold mb-2">{profileCompletion}%</p>
                    <Progress value={profileCompletion} className="h-2" />
                    {profileCompletion < 100 && (
                      <Button asChild variant="link" className="p-0 h-auto mt-2 text-xs text-violet-400">
                        <Link to="/profile">Complete profile →</Link>
                      </Button>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* AI Tools Quick Access */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">AI Tools</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {aiTools.map(tool => (
              <Link key={tool.href} to={tool.href}>
                <Card className="bg-card/70 backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group h-full">
                  <CardContent className="p-4 space-y-2">
                    <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400 w-fit group-hover:bg-violet-500/30 transition-colors">
                      {tool.icon}
                    </div>
                    <p className="font-semibold text-sm">{tool.label}</p>
                    <p className="text-xs text-muted-foreground">{tool.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        {recentApps.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">Recent Applications</h2>
              <Button variant="link" asChild className="text-sm text-violet-400 p-0 h-auto">
                <Link to="/applications">View all <ArrowRight className="inline h-3.5 w-3.5 ml-1" /></Link>
              </Button>
            </div>
            <div className="space-y-2">
              {recentApps.map(app => {
                const s = STATUS_STYLES[app.status] ?? STATUS_STYLES.Applied;
                return (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-card/60 border hover:bg-card/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn('p-1.5 rounded-full', s.color)}>{s.icon}</div>
                      <div>
                        <p className="font-medium text-sm">{app.internshipId.slice(0, 8)}…</p>
                        <p className="text-xs text-muted-foreground">{new Date(app.appliedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn('text-xs', s.color)}>{app.status}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <SmartMatchInternships />
        
        <Separator className="my-8" />

        <div>
            <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-bold tracking-tight">PM Internship Scheme Benefits</h2>
                <p className="text-muted-foreground">
                    Understand the advantages of participating in this premier national scheme.
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 {schemeBenefits.map((item, index) => (
                    <Card key={index} className="flex flex-col items-center text-center p-6 bg-card/70 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="p-3 bg-secondary/10 rounded-full mb-4 text-secondary">
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
