

import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Users, Briefcase, FileText, Bell, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternships } from '@/hooks/use-internships';
import { InfoCard } from '@/components/info-card';
import { Separator } from '@/components/ui/separator';

export default function RecruiterDashboardPage() {
  const { user, userType, loading } = useAuth();
  const { internships, isLoading: internshipsLoading } = useInternships();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (userType !== 'industry' || !user)) {
      navigate('/login');
    }
  }, [user, userType, loading, navigate]);

  if (loading || internshipsLoading || userType !== 'industry' || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-lg">Loading Dashboard...</div>
      </div>
    );
  }

  const quickStats = {
    totalApplicants: 125, // Placeholder
    shortlisted: 25, // Placeholder
    hired: 5, // Placeholder
    newToday: 8, // Placeholder
  };

  const recentActivity = [
    { id: 1, text: 'You have 5 new applicants for the Frontend Developer Intern role.', time: '2 hours ago', icon: <FileText className="h-4 w-4" /> },
    { id: 2, text: 'An interview was scheduled with Rohan Verma.', time: '1 day ago', icon: <CheckCircle2 className="h-4 w-4" /> },
    { id: 3, text: 'Your new "Data Science Intern" post is now live.', time: '3 days ago', icon: <Briefcase className="h-4 w-4" /> },
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Recruiter Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                An overview of your internship postings and applicants.
                </p>
            </div>
            <div className="flex gap-2">
                <Button asChild size="lg">
                    <Link to="/recruiter/internships/new">
                        <PlusCircle className="mr-2" />
                        Post Internship
                    </Link>
                </Button>
            </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <InfoCard title="Total Applicants" value={quickStats.totalApplicants} icon={<Users />} description="Across all active internships." />
            <InfoCard title="Shortlisted" value={quickStats.shortlisted} icon={<CheckCircle2 />} description="Candidates moved to the next stage." />
            <InfoCard title="Hired" value="5" icon={<Briefcase />} description="Offers accepted this cycle." />
            <InfoCard title="New Today" value={quickStats.newToday} icon={<Bell />} description="New applications received today." />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Internships */}
            <div className="lg:col-span-2 space-y-6">
                 <h2 className="text-2xl font-bold tracking-tight">Active Internships</h2>
                 {internships.length > 0 ? (
                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {internships.slice(0, 4).map(internship => (
                                    <div key={internship.id} className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-semibold">{internship.title}</h3>
                                            <p className="text-sm text-muted-foreground">{internship.location} &bull; {internship.domain}</p>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="text-center">
                                                <p className="font-semibold text-lg">28</p>
                                                <p className="text-xs text-muted-foreground">Applicants</p>
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to="/recruiter/internships">View Applicants</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                         {internships.length > 4 && (
                            <div className="p-4 border-t text-center">
                                <Button variant="link" asChild>
                                    <Link to="/recruiter/internships">View All {internships.length} Internships</Link>
                                </Button>
                            </div>
                        )}
                    </Card>
                 ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No Active Internships</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Post a new internship to attract top talent.
                        </p>
                    </div>
                 )}
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {recentActivity.map(activity => (
                                <div key={activity.id} className="p-4 flex items-start gap-4">
                                    <div className="p-2 bg-muted rounded-full mt-1">
                                        {activity.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm">{activity.text}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
