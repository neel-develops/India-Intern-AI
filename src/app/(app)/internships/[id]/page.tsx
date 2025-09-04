
'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { internships, companies } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, MapPin, Cpu, Check, FileText } from 'lucide-react';
import Link from 'next/link';
import { useApplications } from '@/hooks/use-applications';
import { useStudentProfile } from '@/hooks/use-student-profile.tsx';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/use-notifications';

export default function InternshipDetailsPage() {
  const params = useParams();
  const { id } = params;
  const { profile } = useStudentProfile();
  const { applications, addApplication } = useApplications();
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  const internship = internships.find((i) => i.id === id);
  const company = companies.find((c) => c.name === internship?.company);

  if (!internship || !company) {
    return <div>Internship not found</div>;
  }

  const isApplied = applications.some(app => app.internshipId === internship.id);

  const handleApply = () => {
    if (profile) {
      addApplication({
        internshipId: internship.id,
        studentEmail: profile.personalInfo.email,
        status: 'Applied',
        appliedDate: new Date().toISOString(),
      });
      addNotification({
        id: crypto.randomUUID(),
        message: `You applied for the ${internship.title} internship.`,
        date: new Date().toISOString(),
        read: false,
        link: `/applications`,
      });
      toast({
        title: 'Application Sent!',
        description: `You have successfully applied for the ${internship.title} position.`,
      });
    } else {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must create a profile before applying.',
      });
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      <div className="relative h-64 w-full rounded-lg overflow-hidden">
        <Image src={internship.image} alt={internship.title} layout="fill" objectFit="cover" data-ai-hint={`${internship.domain} ${internship.company}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{internship.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mt-2">
              <div className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> {internship.company}</div>
              <div className="flex items-center gap-2"><MapPin className="h-5 w-5" /> {internship.location}</div>
              <div className="flex items-center gap-2"><Cpu className="h-5 w-5" /> {internship.domain}</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground">{internship.longDescription}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Responsibilities</h2>
            <ul className="space-y-2 text-muted-foreground">
              {internship.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-1 shrink-0" /> 
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Qualifications</h2>
            <ul className="space-y-2 text-muted-foreground">
              {internship.qualifications.map((qual, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span>{qual}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Skills Required</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {internship.skills.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {company && (
                <Card>
                    <CardHeader>
                        <CardTitle>About {company.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm">{company.description}</p>
                        <Button variant="outline" asChild>
                            <Link href={`/companies/${company.id}`}>View Company Profile</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Apply Now</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button size="lg" className="w-full" onClick={handleApply} disabled={isApplied}>
                        {isApplied ? 'Applied' : 'Apply for this Internship'}
                    </Button>
                     {isApplied && <p className="text-sm text-center mt-2 text-muted-foreground">You have already applied for this position.</p>}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
