import { useAuth } from '@/hooks/use-auth';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, Briefcase, FileText, CheckCircle2, TrendingUp, Clock, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useInternships } from '@/hooks/use-internships';
import { InfoCard } from '@/components/info-card';
import { cn } from '@/lib/utils';
import type { Application } from '@/lib/types';
import { subscribeToCompanyApplications } from '@/lib/firebase-db';
import { useIndustryProfile } from '@/hooks/use-industry-profile';

export default function RecruiterDashboardPage() {
  const { user, userType, loading: authLoading } = useAuth();
  const { profile: industryProfile, isLoading: profileLoading } = useIndustryProfile();
  const { internships, isLoading: internshipsLoading } = useInternships();
  const navigate = useNavigate();

  const [allApps, setAllApps] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (userType !== 'industry' || !user)) {
      navigate('/login');
    }
  }, [user, userType, authLoading, navigate]);

  // Real-time subscription to all applications for recruiter's company
  useEffect(() => {
    if (!industryProfile?.companyName) { 
      if (!profileLoading) {
        setAllApps([]); 
        setAppsLoading(false);
      }
      return; 
    }
    
    setAppsLoading(true);
    const unsub = subscribeToCompanyApplications(industryProfile.companyName, (data: Application[]) => {
      setAllApps(data);
      setAppsLoading(false);
    });
    return () => {
      if (unsub) unsub();
    };
  }, [industryProfile, profileLoading]);

  if (authLoading || internshipsLoading || profileLoading || userType !== 'industry' || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const shortlistedCount = allApps.filter(a => a.status === 'Interview' || a.status === 'Offered').length;
  const hiredCount = allApps.filter(a => a.status === 'Offered').length;
  const recentApps = [...allApps].slice(0, 5);

  const statusColors: Record<string, string> = {
    Applied: 'bg-blue-500/20 text-blue-400',
    'In Review': 'bg-yellow-500/20 text-yellow-400',
    Interview: 'bg-purple-500/20 text-purple-400',
    Offered: 'bg-green-500/20 text-green-400',
    Rejected: 'bg-red-500/20 text-red-400',
  };

  const hasNoCompany = !industryProfile?.companyName;

  return (
    <div className="space-y-8">
      {hasNoCompany && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-yellow-200/80">
              <span className="font-bold text-yellow-500">Profile Incomplete:</span> Set your company name in settings to link your postings and view applicants correctly.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full border-yellow-500/50 hover:bg-yellow-500/10">
            <Link to="/settings">Complete Profile</Link>
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {industryProfile?.companyName || 'Recruiter'} Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.displayName?.split(' ')[0] || 'Recruiter'}.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full">
          <Link to="/recruiter/internships/new">
            <PlusCircle className="mr-2 h-4 w-4" />Post Internship
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard title="Active Postings" value={internships.length} icon={<Briefcase className="h-4 w-4" />} description="Live internship listings." />
        <InfoCard title="Total Applicants" value={allApps.length} icon={<Users className="h-4 w-4" />} description="Across all postings." />
        <InfoCard title="Shortlisted" value={shortlistedCount} icon={<CheckCircle2 className="h-4 w-4" />} description="Interview / Offer." />
        <InfoCard title="Hired" value={hiredCount} icon={<TrendingUp className="h-4 w-4" />} description="Offers accepted." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Active Postings</h2>
            <Button variant="link" asChild className="text-sm"><Link to="/recruiter/internships">View all →</Link></Button>
          </div>
          {internships.length > 0 ? (
            <Card className="bg-card/70 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="divide-y">
                  {internships.slice(0, 5).map(internship => {
                    const appCount = allApps.filter(a => a.internshipId === internship.id).length;
                    return (
                      <div key={internship.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-accent/30 transition-colors">
                        <div>
                          <p className="font-semibold">{internship.title}</p>
                          <p className="text-sm text-muted-foreground">{internship.location} · {internship.domain}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-center">
                            <p className="font-bold text-lg leading-tight">{appCount}</p>
                            <p className="text-xs text-muted-foreground">applicants</p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/recruiter/internships/${internship.id}/applicants`}>Manage</Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-2xl space-y-4">
              <Briefcase className="h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium">No postings yet</h3>
              <Button asChild>
                <Link to="/recruiter/internships/new">
                  <PlusCircle className="mr-2 h-4 w-4" />Post your first internship
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Recent Applications</h2>
          <Card className="bg-card/70 backdrop-blur-sm">
            <CardContent className="p-0">
              {appsLoading ? (
                <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
              ) : recentApps.length > 0 ? (
                <div className="divide-y">
                  {recentApps.map(app => {
                    const internship = internships.find(i => i.id === app.internshipId);
                    return (
                      <div key={app.id} className="p-4 space-y-1">
                        <p className="text-sm font-medium truncate">{internship?.title ?? 'Unknown Role'}</p>
                        <p className="text-xs text-muted-foreground truncate">{app.studentEmail}</p>
                        <div className="flex items-center justify-between">
                          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusColors[app.status] ?? 'bg-muted text-muted-foreground')}>
                            {app.status}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />{new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No applications yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
