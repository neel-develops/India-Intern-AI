import { useState, useEffect } from 'react';
import { useInternships } from '@/hooks/use-internships';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Pencil, Trash2, Users, Briefcase, MapPin, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Application } from '@/lib/types';
import { subscribeToRecruiterApplications } from '@/lib/firebase-db';

export default function RecruiterInternshipsPage() {
  const { internships, deleteInternship, isLoading } = useInternships();
  const { user, userType, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [allApps, setAllApps] = useState<Application[]>([]);

  useEffect(() => {
    if (!loading && (!user || userType !== 'industry')) navigate('/login', { replace: true });
  }, [user, userType, loading, navigate]);

  // Real-time subscription to applications for all the recruiter's internships
  useEffect(() => {
    if (!internships.length) { setAllApps([]); return; }
    const ids = internships.map(i => i.id);
    const unsub = subscribeToRecruiterApplications(ids, setAllApps);
    return () => unsub();
  }, [internships]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || userType !== 'industry') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <ShieldAlert className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Recruiter Access Required</h2>
        <p className="text-muted-foreground">Please log in as a Recruiter to view postings.</p>
        <Button asChild><Link to="/login">Sign In</Link></Button>
      </div>
    );
  }

  const handleDelete = async (id: string, title: string) => {
    await deleteInternship(id);
    toast({ title: 'Posting deleted', description: `"${title}" has been removed.` });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Postings</h1>
          <p className="text-muted-foreground mt-1">{internships.length} active internship listing{internships.length !== 1 ? 's' : ''}</p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/recruiter/internships/new">
            <PlusCircle className="mr-2 h-4 w-4" />New Posting
          </Link>
        </Button>
      </div>

      {internships.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/30 rounded-2xl">
          <Briefcase className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No internships posted yet</h3>
          <p className="text-sm text-muted-foreground">Create your first posting to attract candidates.</p>
          <Button asChild>
            <Link to="/recruiter/internships/new"><PlusCircle className="mr-2 h-4 w-4" />Post Internship</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {internships.map(internship => {
            const appCount = allApps.filter(a => a.internshipId === internship.id).length;
            const shortlisted = allApps.filter(a =>
              a.internshipId === internship.id && (a.status === 'Interview' || a.status === 'Offered')
            ).length;
            return (
              <Card key={internship.id} className="bg-card/70 backdrop-blur-sm hover:shadow-lg transition-all">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{internship.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{internship.location}</span>
                            <span>·</span>
                            <span>{internship.domain}</span>
                            {internship.stipend && <span>· ₹{internship.stipend.toLocaleString()}/mo</span>}
                          </div>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-green-400 border-green-400/30">Active</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {internship.skills.slice(0, 5).map(s => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="font-bold text-2xl leading-tight">{appCount}</p>
                        <p className="text-xs text-muted-foreground">applicants</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-2xl leading-tight text-violet-400">{shortlisted}</p>
                        <p className="text-xs text-muted-foreground">shortlisted</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="default" size="sm" asChild>
                          <Link to={`/recruiter/internships/${internship.id}/applicants`}>
                            <Users className="mr-1.5 h-3.5 w-3.5" />View Applicants
                          </Link>
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link to={`/recruiter/internships/${internship.id}/edit`}>
                              <Pencil className="mr-1.5 h-3.5 w-3.5" />Edit
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Posting</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{internship.title}"? This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDelete(internship.id, internship.title)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
