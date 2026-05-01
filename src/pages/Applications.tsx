import { useMemo, useState } from 'react';
import { useApplications } from '@/hooks/use-applications';
import { internships as allInternships } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Application } from '@/lib/types';
import {
  Briefcase, Calendar, Info, FileText, Clock,
  CheckCircle2, Award, XCircle, ArrowRight, Video
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<Application['status'], { color: string; bgColor: string; borderColor: string; icon: React.ReactNode; label: string }> = {
  Applied:   { color: 'text-blue-400',   bgColor: 'bg-blue-500/15',   borderColor: 'border-blue-400/30',   icon: <Clock className="h-4 w-4" />,        label: 'Applied' },
  'In Review': { color: 'text-yellow-400', bgColor: 'bg-yellow-500/15', borderColor: 'border-yellow-400/30', icon: <Clock className="h-4 w-4" />,        label: 'In Review' },
  Interview: { color: 'text-purple-400', bgColor: 'bg-purple-500/15', borderColor: 'border-purple-400/30', icon: <CheckCircle2 className="h-4 w-4" />,  label: 'Interview' },
  Offered:   { color: 'text-green-400',  bgColor: 'bg-green-500/15',  borderColor: 'border-green-400/30',  icon: <Award className="h-4 w-4" />,        label: 'Offered 🎉' },
  Rejected:  { color: 'text-red-400',   bgColor: 'bg-red-500/15',    borderColor: 'border-red-400/30',    icon: <XCircle className="h-4 w-4" />,      label: 'Rejected' },
};

// Kanban-style columns
const COLUMNS: Application['status'][] = ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'];

type ViewMode = 'list' | 'board';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const { applications, isLoading } = useApplications();
  const [view, setView] = useState<ViewMode>('list');

  const enriched = useMemo(() =>
    applications
      .map(app => ({
        ...app,
        internship: allInternships.find(i => i.id === app.internshipId),
      }))
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()),
    [applications]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/30 rounded-2xl">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">Sign in to view your applications</h3>
        <Button asChild><Link to="/login">Sign In</Link></Button>
      </div>
    );
  }

  if (enriched.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="h-7 w-7 text-violet-400" />
            My Applications
          </h1>
          <p className="text-muted-foreground mt-1">Track the status of your internship applications here.</p>
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/30 rounded-2xl">
          <Info className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No Applications Yet</h3>
          <p className="text-sm text-muted-foreground">You haven't applied for any internships yet.</p>
          <Button asChild>
            <Link to="/internships">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Internships
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Summary counts
  const counts = COLUMNS.reduce((acc, s) => {
    acc[s] = enriched.filter(a => a.status === s).length;
    return acc;
  }, {} as Record<Application['status'], number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="h-7 w-7 text-violet-400" />
            My Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            {enriched.length} application{enriched.length !== 1 ? 's' : ''} submitted
          </p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-2 rounded-lg border p-1 bg-card/60">
          <button
            onClick={() => setView('list')}
            className={cn('px-3 py-1.5 rounded-md text-sm font-medium transition-colors', view === 'list' ? 'bg-violet-600 text-white' : 'text-muted-foreground hover:text-foreground')}
          >
            List
          </button>
          <button
            onClick={() => setView('board')}
            className={cn('px-3 py-1.5 rounded-md text-sm font-medium transition-colors', view === 'board' ? 'bg-violet-600 text-white' : 'text-muted-foreground hover:text-foreground')}
          >
            Board
          </button>
        </div>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2">
        {COLUMNS.map(s => {
          const cfg = STATUS_CONFIG[s];
          return counts[s] > 0 ? (
            <div key={s} className={cn('flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium', cfg.color, cfg.bgColor, cfg.borderColor)}>
              {cfg.icon}
              {counts[s]} {s}
            </div>
          ) : null;
        })}
      </div>

      {view === 'list' ? (
        /* ── List View ── */
        <div className="space-y-4">
          {enriched.map(({ id, status, appliedDate, internship, internshipId }) => {
            if (!internship) return null;
            const cfg = STATUS_CONFIG[status];
            return (
              <Card key={id} className={cn('bg-card/70 backdrop-blur-sm overflow-hidden transition-all hover:shadow-lg border-l-4', cfg.borderColor)}>
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-32 sm:h-auto sm:w-40 shrink-0">
                      <img
                        src={internship.image}
                        alt={internship.title}
                        className="w-full h-full object-cover"
                        data-ai-hint={`${internship.domain} ${internship.company}`}
                      />
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-base">{internship.title}</h3>
                          <Badge variant="outline" className={cn('text-xs shrink-0', cfg.color, cfg.borderColor, cfg.bgColor)}>
                            <span className="flex items-center gap-1">{cfg.icon}{cfg.label}</span>
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{internship.company}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Applied {new Date(appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/internships/${internshipId}`}>
                            View Listing <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        {status === 'Interview' && enriched.find(a => a.id === id)?.interviewLink && (
                          <Button size="sm" className="bg-violet-600 hover:bg-violet-700" asChild>
                            <a href={enriched.find(a => a.id === id)?.interviewLink} target="_blank" rel="noopener noreferrer">
                              <Video className="mr-1.5 h-3.5 w-3.5" />Join Interview
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* ── Board View ── */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => {
            const cfg = STATUS_CONFIG[col];
            const colApps = enriched.filter(a => a.status === col);
            return (
              <div key={col} className="min-w-[240px] w-60 shrink-0 space-y-3">
                <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold', cfg.bgColor, cfg.color)}>
                  {cfg.icon}
                  <span>{col}</span>
                  <span className="ml-auto bg-white/10 rounded-full px-2 py-0.5 text-xs">{colApps.length}</span>
                </div>
                {colApps.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-4 text-xs text-center text-muted-foreground">None</div>
                ) : (
                  colApps.map(({ id, appliedDate, internship, internshipId }) => {
                    if (!internship) return null;
                    return (
                      <Card key={id} className="bg-card/70 backdrop-blur-sm hover:shadow-md transition-all">
                        <CardContent className="p-3 space-y-2">
                          <img src={internship.image} alt={internship.title} className="w-full h-24 object-cover rounded-lg" />
                          <p className="text-sm font-semibold leading-tight">{internship.title}</p>
                          <p className="text-xs text-muted-foreground">{internship.company}</p>
                          <p className="text-xs text-muted-foreground">{new Date(appliedDate).toLocaleDateString()}</p>
                          <Button size="sm" variant="outline" className="w-full text-xs h-7" asChild>
                            <Link to={`/internships/${internshipId}`}>View</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
