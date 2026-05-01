import { useParams, Link } from 'react-router-dom';
import { companies } from '@/lib/data';
import { useInternships } from '@/hooks/use-internships';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MapPin, Cpu, Check, FileText, Bookmark, BookmarkCheck, Clock, IndianRupee } from 'lucide-react';
import { useApplications } from '@/hooks/use-applications';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/hooks/use-auth';
import { useSavedInternships } from '@/hooks/use-saved-internships';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function InternshipDetailsPage() {
  const { id } = useParams();
  const { user, userType } = useAuth();
  const { internships, isLoading } = useInternships();
  const { profile } = useStudentProfile();
  const { applications, addApplication } = useApplications();
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const { isSaved, toggleSave } = useSavedInternships();
  const [applying, setApplying] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const internship = internships.find((i) => i.id === id);
  const company = companies.find((c) => c.name === internship?.company);

  if (!internship) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <h2 className="text-xl font-semibold">Internship not found</h2>
        <Button asChild><Link to="/internships">Back to Internships</Link></Button>
      </div>
    );
  }

  const isApplied = applications.some(app => app.internshipId === internship.id);
  const saved = isSaved(internship.id);
  const isRecruiter = userType === 'industry';

  const handleApply = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Sign in required', description: 'Please log in to apply.' });
      return;
    }
    if (isRecruiter) {
      toast({ variant: 'destructive', title: 'Recruiter account', description: 'Switch to a student account to apply.' });
      return;
    }
    if (!profile) {
      toast({ variant: 'destructive', title: 'Profile required', description: 'Please complete your profile before applying.' });
      return;
    }
    setApplying(true);
    try {
      await addApplication({
        internshipId: internship.id,
        internshipTitle: internship.title,
        companyName: internship.company,
        studentEmail: user.email ?? user.uid,
        studentName: profile?.personalInfo?.name || user.displayName || 'Student',
        status: 'Applied',
        appliedDate: new Date().toISOString(),
      });
      addNotification({
        message: `Your application for "${internship.title}" at ${internship.company} has been submitted.`,
        link: '/applications',
      });
      toast({ title: '🎉 Application Sent!', description: `You applied for ${internship.title}.` });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit application. Please try again.' });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-xl">
        <img src={internship.image} alt={internship.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl font-bold text-white">{internship.title}</h1>
          <p className="text-white/80 mt-1 flex items-center gap-2"><Briefcase className="h-4 w-4" />{internship.company}</p>
        </div>
        {user && !isRecruiter && (
          <button
            onClick={() => toggleSave(internship.id)}
            className={cn(
              'absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all duration-200',
              saved ? 'bg-violet-600/90 text-white' : 'bg-black/50 text-white hover:bg-black/70'
            )}
          >
            {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 text-sm">
              <MapPin className="h-4 w-4" /> {internship.location}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 text-sm">
              <Cpu className="h-4 w-4" /> {internship.domain}
            </Badge>
            {internship.stipend && (
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-400 border-emerald-400/40">
                <IndianRupee className="h-4 w-4" /> {internship.stipend.toLocaleString()} / month
              </Badge>
            )}
            {internship.duration && (
              <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 text-sm">
                <Clock className="h-4 w-4" /> {internship.duration}
              </Badge>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">About this role</h2>
            <p className="text-muted-foreground leading-relaxed">{internship.longDescription}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Responsibilities</h2>
            <ul className="space-y-2">
              {internship.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <Check className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" /><span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Qualifications</h2>
            <ul className="space-y-2">
              {internship.qualifications.map((qual, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <Check className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" /><span>{qual}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader><CardTitle className="text-base">Skills Required</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
              </div>
            </CardContent>
          </Card>

          {company && (
            <Card className="bg-card/70 backdrop-blur-sm">
              <CardHeader><CardTitle className="text-base">About {company.name}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">{company.description}</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={`/companies/${company.id}`}>View Company Profile</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-card/70 backdrop-blur-sm">
            <CardHeader><CardTitle className="text-base">Apply for this Role</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {!user ? (
                <>
                  <p className="text-sm text-muted-foreground">Sign in to apply for this internship.</p>
                  <Button asChild className="w-full"><Link to="/login">Sign In to Apply</Link></Button>
                </>
              ) : isRecruiter ? (
                <p className="text-sm text-muted-foreground">Recruiter accounts cannot apply for internships.</p>
              ) : (
                <>
                  <Button
                    size="lg"
                    className={cn('w-full', isApplied && 'opacity-80')}
                    onClick={handleApply}
                    disabled={isApplied || applying}
                  >
                    {applying ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Submitting…</>
                    ) : isApplied ? (
                      <><Check className="mr-2 h-4 w-4" />Application Submitted</>
                    ) : (
                      <><FileText className="mr-2 h-4 w-4" />Apply Now</>
                    )}
                  </Button>
                  {isApplied && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/applications">Track Application</Link>
                    </Button>
                  )}
                  {!profile && (
                    <p className="text-xs text-center text-amber-400">
                      ⚠️ <Link to="/profile" className="underline">Complete your profile</Link> before applying
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {user && !isRecruiter && (
            <Button
              variant="outline"
              className={cn('w-full gap-2', saved && 'border-violet-500 text-violet-400')}
              onClick={() => toggleSave(internship.id)}
            >
              {saved ? <><BookmarkCheck className="h-4 w-4" />Saved</> : <><Bookmark className="h-4 w-4" />Save for Later</>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
