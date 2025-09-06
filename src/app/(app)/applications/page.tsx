
'use client';
import { useApplications } from '@/hooks/use-applications';
import { useStudentProfile } from '@/hooks/use-student-profile.tsx';
import { internships } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Application } from '@/lib/types';
import { Briefcase, Calendar, Info } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const { profile } = useStudentProfile();
  const { applications, updateApplicationStatus, isLoading } = useApplications();

  if (isLoading) {
    return <div>Loading applications...</div>
  }
  
  if (!user || !profile) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>View Your Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Please create or log into your profile to view your applications.</p>
                <Button asChild><Link href="/profile">Go to Profile</Link></Button>
            </CardContent>
        </Card>
    )
  }

  if (applications.length === 0) {
    return (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Info className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Applications Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                You haven't applied for any internships.
            </p>
            <Button asChild className="mt-6">
                <Link href="/internships">Browse Internships</Link>
            </Button>
        </div>
    );
  }

  const handleStatusChange = (applicationId: string, newStatus: Application['status']) => {
    updateApplicationStatus(applicationId, newStatus);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          My Applications
        </h1>
        <p className="text-lg text-muted-foreground">
          Track the status of your internship applications here.
        </p>
      </div>
      <div className="space-y-6">
        {applications.map((app) => {
          const internship = internships.find(i => i.id === app.internshipId);
          if (!internship) return null;

          const getStatusColor = (status: Application['status']) => {
            switch(status) {
                case 'Applied': return 'bg-blue-500';
                case 'In Review': return 'bg-yellow-500';
                case 'Interview': return 'bg-purple-500';
                case 'Offered': return 'bg-green-500';
                case 'Rejected': return 'bg-red-500';
                default: return 'bg-gray-500';
            }
          }

          return (
            <Card key={app.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-48 sm:h-auto sm:w-48 shrink-0">
                    <Image src={internship.image} alt={internship.title} layout="fill" objectFit="cover" data-ai-hint={`${internship.domain} ${internship.company}`}/>
                </div>
                <div className="p-6 flex-grow">
                    <CardTitle className="mb-1">{internship.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mb-4">
                        <Briefcase className="h-4 w-4" /> {internship.company}
                    </CardDescription>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4" /> Applied on {new Date(app.appliedDate).toLocaleDateString()}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-medium">Status:</span>
                            <Badge className={`${getStatusColor(app.status)} text-white`}>{app.status}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Update Status:</span>
                            <Select onValueChange={(value) => handleStatusChange(app.id, value as Application['status'])} defaultValue={app.status}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Applied">Applied</SelectItem>
                                    <SelectItem value="In Review">In Review</SelectItem>
                                    <SelectItem value="Interview">Interview</SelectItem>
                                    <SelectItem value="Offered">Offered</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                </div>
                 <div className="p-6 border-t sm:border-t-0 sm:border-l flex items-center">
                    <Button asChild><Link href={`/internships/${internship.id}`}>View Details</Link></Button>
                 </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
