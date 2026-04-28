import { internships as allInternships } from '@/lib/data';
import { InternshipCard } from '@/components/internship-card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Bookmark, Briefcase } from 'lucide-react';
import { useSavedInternships } from '@/hooks/use-saved-internships';
import { useAuth } from '@/hooks/use-auth';

export default function SavedInternshipsPage() {
  const { user } = useAuth();
  const { savedIds } = useSavedInternships();

  const savedInternships = allInternships.filter(i => savedIds.includes(i.id));

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <Bookmark className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Sign in to view saved internships</h2>
        <Button asChild><Link to="/login">Sign In</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bookmark className="h-7 w-7 text-violet-400" />
          Saved Internships
        </h1>
        <p className="text-muted-foreground">
          {savedInternships.length} internship{savedInternships.length !== 1 ? 's' : ''} bookmarked
        </p>
      </div>

      {savedInternships.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/30 rounded-2xl">
          <Bookmark className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No saved internships yet</h3>
          <p className="text-sm text-muted-foreground">Browse internships and hit the bookmark icon to save them here.</p>
          <Button asChild>
            <Link to="/internships">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Internships
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedInternships.map(internship => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      )}
    </div>
  );
}
