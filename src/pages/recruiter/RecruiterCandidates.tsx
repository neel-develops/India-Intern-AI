import { useMemo, useState } from 'react';
import { useInternships } from '@/hooks/use-internships';
import { useApplications } from '@/hooks/use-applications';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users, User, Mail, Briefcase, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Application } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  Applied: 'bg-blue-500/20 text-blue-400',
  'In Review': 'bg-yellow-500/20 text-yellow-400',
  Interview: 'bg-purple-500/20 text-purple-400',
  Offered: 'bg-green-500/20 text-green-400',
  Rejected: 'bg-red-500/20 text-red-400',
};

export default function RecruiterCandidatesPage() {
  const { internships } = useInternships();
  const { getAllApplications, updateApplicationStatus } = useApplications();
  const { user, userType, loading } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!loading && (!user || userType !== 'industry')) navigate('/login');
  }, [user, userType, loading, navigate]);

  const myInternshipIds = internships.map(i => i.id);
  const allApps = getAllApplications().filter(a => myInternshipIds.includes(a.internshipId));

  const enriched = useMemo(() => {
    return allApps.map(app => ({
      ...app,
      internshipTitle: internships.find(i => i.id === app.internshipId)?.title ?? 'Unknown',
    }));
  }, [allApps, internships]);

  const filtered = useMemo(() => {
    return enriched.filter(app => {
      const matchSearch = search === '' || app.studentEmail.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [enriched, search, statusFilter]);

  // Group by studentEmail to de-duplicate
  const byStudent = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const app of filtered) {
      if (!map.has(app.studentEmail)) map.set(app.studentEmail, []);
      map.get(app.studentEmail)!.push(app);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const statuses: Application['status'][] = ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Users className="h-7 w-7 text-violet-400" />
          All Candidates
        </h1>
        <p className="text-muted-foreground">
          {byStudent.length} unique candidate{byStudent.length !== 1 ? 's' : ''} across {internships.length} posting{internships.length !== 1 ? 's' : ''}
        </p>
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

      {byStudent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/30 rounded-2xl">
          <Users className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No candidates yet</h3>
          <p className="text-sm text-muted-foreground">Candidates who apply to your postings will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {byStudent.map(([email, apps]) => (
            <Card key={email} className="bg-card/70 backdrop-blur-sm hover:shadow-lg transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">{email[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{email.split('@')[0]}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />{email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {apps.map(app => (
                    <div key={app.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/40">
                      <div className="flex items-center gap-2 min-w-0">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs truncate">{app.internshipTitle}</span>
                      </div>
                      <Badge variant="outline" className={cn('text-xs shrink-0 ml-2', STATUS_COLORS[app.status])}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
