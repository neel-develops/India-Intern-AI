
'use client';

import { SmartMatchCandidates } from '@/components/smart-match-candidates';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { TalentPoolFilters, type TalentFilters } from '@/components/talent-pool-filters';
import { studentProfiles } from '@/lib/data';
import { StudentCard } from '@/components/student-card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function RecruiterPage() {
  const { user, userType, loading } = useAuth();
  const router = useRouter();
  const [filters, setFilters] = useState<TalentFilters>({ skills: '', location: '', university: '' });

  useEffect(() => {
    if (!loading && (userType !== 'industry' || !user)) {
      router.replace('/login');
    }
  }, [user, userType, loading, router]);
  
  const handleFilterChange = useCallback((newFilters: TalentFilters) => {
    setFilters(newFilters);
  }, []);

  const filteredStudents = useMemo(() => {
    return studentProfiles.filter(student => {
        const locationMatch = !filters.location || student.personalInfo.location?.toLowerCase().includes(filters.location.toLowerCase());
        const universityMatch = !filters.university || student.personalInfo.university?.toLowerCase().includes(filters.university.toLowerCase());
        
        const skillsMatch = filters.skills.trim() === '' || 
            filters.skills.toLowerCase().split(',').every(skill => 
                student.skills.some(s => s.name.toLowerCase().includes(skill.trim()))
            );
            
        return locationMatch && universityMatch && skillsMatch;
    });
  }, [filters]);


  if (loading || userType !== 'industry' || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-12">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Recruiter Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
              Find the perfect match for your internship using our AI-powered tools.
              </p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="lg">
                <Link href="/recruiter/internships">
                    <PlusCircle className="mr-2" />
                    Manage Internships
                </Link>
            </Button>
          </div>
        </div>
        <SmartMatchCandidates />
      </div>

      <Separator />
      
       <div>
        <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Talent Pool
            </h2>
            <p className="text-lg text-muted-foreground">
                Browse all student profiles or use the filters to find specific candidates.
            </p>
        </div>

        <div className="mb-8">
            <TalentPoolFilters onFilterChange={handleFilterChange} />
        </div>

        {filteredStudents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.map((student) => (
                    <StudentCard key={student.personalInfo.email} student={student} />
                ))}
            </div>
        ) : (
             <Alert>
                <Users className="h-4 w-4" />
                <AlertTitle>No Students Found</AlertTitle>
                <AlertDescription>
                    No students match your current filter criteria. Try adjusting your filters.
                </AlertDescription>
            </Alert>
        )}
      </div>

    </div>
  );
}
