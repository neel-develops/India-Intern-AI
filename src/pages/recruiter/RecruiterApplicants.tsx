import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInternships } from '@/hooks/use-internships';
import { useApplications } from '@/hooks/use-applications';
import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, Mail, Calendar, CheckCircle2, XCircle, Award, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Application } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  Applied: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
  'In Review': 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
  Interview: 'bg-purple-500/20 text-purple-400 border-purple-400/30',
  Offered: 'bg-green-500/20 text-green-400 border-green-400/30',
  Rejected: 'bg-red-500/20 text-red-400 border-red-400/30',
};

export default function RecruiterApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const { internships } = useInternships();
  const { getApplicationsByInternship, updateApplicationStatus } = useApplications();
  const { addNotification } = useNotifications();
  const { user, userType } = useAuth();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const internship = internships.find(i => i.id === id);
  const applications = id ? getApplicationsByInternship(id) : [];

  const filtered = useMemo(() => {
    return applications.filter(app => {
      const matchSearch = search === '' || app.studentEmail.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [applications, search, statusFilter]);

  const handleStatusChange = (app: Application, newStatus: Application['status']) => {
    updateApplicationStatus(app.id, newStatus);
    // Notify the student
    addNotification({
      id: `recruiter-${app.id}-${newStatus}`,
      message: `Your application for ${internship?.title ?? 'an internship'} has been updated to: ${newStatus}`,
      link: '/applications',
    });
    toast({
      title: 'Status Updated',
      description: `${app.studentEmail} → ${newStatus}`,
    });
  };

  if (!internship) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Internship not found.</p>
        <Button asChild className="mt-4"><Link to="/recruiter/internships">Back to Postings</Link></Button>
      </div>
    );
  }

  const statuses: Application['status'][] = ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/recruiter/internships"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{internship.title}</h1>
          <p className="text-muted-foreground">{applications.length} applicant{applications.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...statuses].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                statusFilter === s
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'border-border text-muted-foreground hover:border-violet-500 hover:text-foreground'
              )}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statuses.map(s => {
          const count = applications.filter(a => a.status === s).length;
          return (
            <div key={s} className={cn('rounded-xl p-3 text-center border', STATUS_COLORS[s])}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs opacity-80">{s}</p>
            </div>
          );
        })}
      </div>

      {/* Applicants list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-muted/30 rounded-2xl">
          <User className="h-10 w-10 text-muted-foreground" />
          <p className="font-medium">No applicants found</p>
          <p className="text-sm text-muted-foreground">
            {applications.length === 0 ? 'No one has applied yet.' : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <Card key={app.id} className="bg-card/70 backdrop-blur-sm hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-violet-400" />
                      </div>
                      <p className="font-semibold">{app.studentEmail.split('@')[0]}</p>
                      <Badge variant="outline" className={cn('text-xs', STATUS_COLORS[app.status])}>
                        {app.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground ml-10">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{app.studentEmail}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:ml-auto">
                    <Button
                      size="sm" variant="outline"
                      className="text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/10"
                      onClick={() => handleStatusChange(app, 'In Review')}
                      disabled={app.status === 'In Review'}
                    >
                      Review
                    </Button>
                    <Button
                      size="sm" variant="outline"
                      className="text-purple-400 border-purple-400/30 hover:bg-purple-400/10"
                      onClick={() => handleStatusChange(app, 'Interview')}
                      disabled={app.status === 'Interview'}
                    >
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      Shortlist
                    </Button>
                    <Button
                      size="sm" variant="outline"
                      className="text-green-400 border-green-400/30 hover:bg-green-400/10"
                      onClick={() => handleStatusChange(app, 'Offered')}
                      disabled={app.status === 'Offered'}
                    >
                      <Award className="mr-1.5 h-3.5 w-3.5" />
                      Hire
                    </Button>
                    <Button
                      size="sm" variant="outline"
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                      onClick={() => handleStatusChange(app, 'Rejected')}
                      disabled={app.status === 'Rejected'}
                    >
                      <XCircle className="mr-1.5 h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
