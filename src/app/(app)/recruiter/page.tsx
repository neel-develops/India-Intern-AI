import { SmartMatchCandidates } from '@/components/smart-match-candidates';
import { StudentCard } from '@/components/student-card';
import { studentProfiles } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

export default function RecruiterPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-12">
      <div>
        <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Recruiter Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
            Find the perfect match for your internship.
            </p>
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
                Browse all student profiles.
            </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studentProfiles.map((student) => (
                <StudentCard key={student.personalInfo.email} student={student} />
            ))}
        </div>
      </div>
    </div>
  );
}
