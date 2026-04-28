import { useInternships } from '@/hooks/use-internships';
import { useAuth } from '@/hooks/use-auth';
import { InternshipForm } from '@/components/internship-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import type { Internship } from '@/lib/types';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function RecruiterPostNewPage() {
  const { internships, addInternship, updateInternship } = useInternships();
  const { user, userType, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();

  // Support editing: if `id` param is present, pre-fill from existing internship
  const editingInternship = params.id ? internships.find(i => i.id === params.id) : undefined;
  const isEditing = Boolean(editingInternship);

  useEffect(() => {
    if (!loading && (!user || userType !== 'industry')) {
      navigate('/login', { replace: true });
    }
  }, [user, userType, loading, navigate]);

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
        <p className="text-muted-foreground">Please log in as a Recruiter to post internships.</p>
        <Button asChild><Link to="/login">Sign In</Link></Button>
      </div>
    );
  }

  const handleSave = (data: Omit<Internship, 'id' | 'image' | 'company'>) => {
    if (isEditing && editingInternship) {
      updateInternship({ ...editingInternship, ...data });
      toast({ title: 'Posting Updated!', description: `"${data.title}" has been updated.` });
    } else {
      addInternship(data);
      toast({ title: 'Internship Posted!', description: `"${data.title}" is now live.` });
    }
    navigate('/recruiter/internships');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/recruiter/internships"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Posting' : 'Post a New Internship'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Update the details of this internship.' : 'Fill in the details below to attract top candidates.'}
          </p>
        </div>
      </div>

      <InternshipForm internship={editingInternship} onSave={handleSave} />
    </div>
  );
}
