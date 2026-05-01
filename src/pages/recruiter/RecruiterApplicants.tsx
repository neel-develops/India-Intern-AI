import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInternships } from '@/hooks/use-internships';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, User, Mail, Calendar, CheckCircle2, 
  XCircle, Award, Search, Video, Send 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Application } from '@/lib/types';
import {
  subscribeToInternshipApplications,
  fsUpdateApplicationStatus,
  fsUpdateApplication,
  fsAddNotificationByEmail,
} from '@/lib/firebase-db';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const { toast } = useToast();

  const [applications, setApplications] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Interview Dialog State
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [meetLink, setMeetLink] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  // Real-time subscription for this internship's applications
  useEffect(() => {
    if (!id) return;
    setAppsLoading(true);
    const unsub = subscribeToInternshipApplications(id, data => {
      setApplications(data);
      setAppsLoading(false);
    });
    return () => unsub();
  }, [id]);

  const internship = internships.find(i => i.id === id);

  const filtered = useMemo(() => {
    return applications.filter(app => {
      const matchSearch = search === '' || app.studentEmail.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [applications, search, statusFilter]);

  const handleStatusChange = async (app: Application, newStatus: Application['status']) => {
    try {
      await fsUpdateApplicationStatus(app.id, newStatus);
      toast({ title: 'Status Updated', description: `${app.studentEmail} → ${newStatus}` });
      
      // If status changed to Interview, we could automatically open the dialog, but let's keep it manual
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status.' });
    }
  };

  const handleScheduleInterview = async () => {
    if (!selectedApp || !meetLink) return;
    setIsScheduling(true);
    try {
      await fsUpdateApplication(selectedApp.id, { 
        status: 'Interview',
        interviewLink: meetLink 
      });
      
      // Notify student
      await fsAddNotificationByEmail(selectedApp.studentEmail, {
        message: `Interview Scheduled for ${internship?.title}. Link: ${meetLink}`,
        date: new Date().toISOString(),
        read: false,
        link: '/applications'
      });

      toast({ title: 'Interview Scheduled', description: 'Google Meet link has been shared with the candidate.' });
      setSelectedApp(null);
      setMeetLink('');
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to schedule interview.' });
    } finally {
      setIsScheduling(false);
    }
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
          <p className="text-muted-foreground">
            {appsLoading ? 'Loading…' : `${applications.length} applicant${applications.length !== 1 ? 's' : ''}`}
          </p>
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

      {/* Stats */}
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

      {/* List */}
      {appsLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
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
                      <p className="font-semibold">{app.studentName || app.studentEmail.split('@')[0]}</p>
                      <Badge variant="outline" className={cn('text-xs', STATUS_COLORS[app.status])}>
                        {app.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground ml-10">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{app.studentEmail}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                      {app.interviewLink && (
                        <span className="flex items-center gap-1 text-purple-400 font-medium">
                          <Video className="h-3 w-3" />Interview Scheduled
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:ml-auto">
                    <Button size="sm" variant="outline" className="text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/10"
                      onClick={() => handleStatusChange(app, 'In Review')} disabled={app.status === 'In Review'}>
                      Review
                    </Button>
                    <Button size="sm" variant="outline" className="text-purple-400 border-purple-400/30 hover:bg-purple-400/10"
                      onClick={() => setSelectedApp(app)}>
                      <Video className="mr-1.5 h-3.5 w-3.5" />Schedule
                    </Button>
                    <Button size="sm" variant="outline" className="text-green-400 border-green-400/30 hover:bg-green-400/10"
                      onClick={() => handleStatusChange(app, 'Offered')} disabled={app.status === 'Offered'}>
                      <Award className="mr-1.5 h-3.5 w-3.5" />Hire
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                      onClick={() => handleStatusChange(app, 'Rejected')} disabled={app.status === 'Rejected'}>
                      <XCircle className="mr-1.5 h-3.5 w-3.5" />Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Enter the Google Meet or Zoom link for the candidate. This will notify them immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Candidate: <span className="text-violet-400">{selectedApp?.studentEmail}</span></p>
              <div className="relative">
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={meetLink}
                  onChange={e => setMeetLink(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedApp(null)}>Cancel</Button>
            <Button 
              className="bg-violet-600 hover:bg-violet-700" 
              onClick={handleScheduleInterview}
              disabled={!meetLink || isScheduling}
            >
              {isScheduling ? 'Sending...' : <><Send className="mr-2 h-4 w-4" />Share Link</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
