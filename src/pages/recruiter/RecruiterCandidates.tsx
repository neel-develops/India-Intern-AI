import { useMemo, useState, useEffect } from 'react';
import { useInternships } from '@/hooks/use-internships';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, Users, Mail, Briefcase, ExternalLink, 
  UserCircle, MapPin, GraduationCap 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Application } from '@/lib/types';
import { subscribeToCompanyApplications } from '@/lib/firebase-db';
import { useIndustryProfile } from '@/hooks/use-industry-profile';

const STATUS_COLORS: Record<string, string> = {
  Applied: 'bg-blue-500/20 text-blue-400',
  'In Review': 'bg-yellow-500/20 text-yellow-400',
  Interview: 'bg-purple-500/20 text-purple-400',
  Offered: 'bg-green-500/20 text-green-400',
  Rejected: 'bg-red-500/20 text-red-400',
};

export default function RecruiterCandidatesPage() {
  const { internships } = useInternships();
  const { user, userType, loading } = useAuth();
  const { profile: industryProfile } = useIndustryProfile();
  const navigate = useNavigate();

  const [allApps, setAllApps] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!loading && (!user || userType !== 'industry')) navigate('/login');
  }, [user, userType, loading, navigate]);

  useEffect(() => {
    if (!industryProfile?.companyName) return;
    const unsub = subscribeToCompanyApplications(industryProfile.companyName, setAllApps);
    return () => unsub();
  }, [industryProfile?.companyName]);

  const statuses: Application['status'][] = ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'];

  const enriched = useMemo(() =>
    allApps.map(app => ({
      ...app,
      internshipTitle: internships.find(i => i.id === app.internshipId)?.title ?? 'Unknown',
    }))
  , [allApps, internships]);

  const filtered = useMemo(() =>
    enriched.filter(app => {
      const matchSearch = search === '' || 
        app.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
        (app.studentName && app.studentName.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchSearch && matchStatus;
    })
  , [enriched, search, statusFilter]);

  const byStudent = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const app of filtered) {
      if (!map.has(app.studentEmail)) map.set(app.studentEmail, []);
      map.get(app.studentEmail)!.push(app);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-7 w-7 text-violet-400" />Candidate Pool
          </h1>
          <p className="text-muted-foreground">
            Manage and track all unique candidates who have applied to your company.
          </p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="px-3 py-1 bg-violet-500/10 text-violet-400 border-violet-400/20">
             {byStudent.length} Total Candidates
           </Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or email..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-9 bg-card/50" 
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
              {s === 'all' ? 'All Status' : s}
            </button>
          ))}
        </div>
      </div>

      {byStudent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/30 rounded-2xl border border-dashed border-border/50">
          <Users className="h-12 w-12 text-muted-foreground/50" />
          <div className="space-y-1">
            <h3 className="text-lg font-medium">No candidates matching your criteria</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {allApps.length === 0 
                ? "You haven't received any applications yet. Make sure your internships are posted and visible." 
                : "Try adjusting your search or status filters."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {byStudent.map(([email, apps]) => (
            <Card key={email} className="bg-card/70 backdrop-blur-sm hover:shadow-xl transition-all border-border/50 overflow-hidden group">
              <CardHeader className="p-5 pb-3 border-b border-border/30 bg-muted/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-xl">{email[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate group-hover:text-violet-400 transition-colors">
                        {apps[0]?.studentName || email.split('@')[0]}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{email}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 hover:bg-violet-500/10 hover:text-violet-400" asChild>
                    <a href={`mailto:${email}`}><Mail className="h-4 w-4" /></a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Applied Positions</p>
                  <div className="space-y-2">
                    {apps.map(app => (
                      <div key={app.id} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors border border-border/30">
                        <div className="flex items-center gap-2 min-w-0">
                          <Briefcase className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                          <div className="min-w-0">
                             <p className="text-xs font-medium truncate">{app.internshipTitle}</p>
                             <p className="text-[10px] text-muted-foreground">Applied {new Date(app.appliedDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={cn('text-[10px] py-0 px-2 shrink-0 border-none', STATUS_COLORS[app.status])}>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-end pt-2">
                  <Button size="sm" variant="ghost" className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 text-xs gap-1.5" asChild>
                    <Link to={`/recruiter/internships/${apps[0].internshipId}`}>
                      Manage Applications <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
