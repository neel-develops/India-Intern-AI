'use client';

import { useInternships } from '@/hooks/use-internships';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Edit, Trash, Users, Briefcase, IndianRupee, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ManageInternshipsPage() {
  const { internships, deleteInternship, isLoading } = useInternships();

  if (isLoading) {
    return <div>Loading your internships...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Manage Internships</h1>
          <p className="text-muted-foreground">
            Here you can create, edit, and view applicants for your internship postings.
          </p>
        </div>
        <Button asChild>
          <Link href="/recruiter/internships/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Internship
          </Link>
        </Button>
      </div>

      {internships.length > 0 ? (
        <div className="space-y-6">
          {internships.map(internship => (
            <Card key={internship.id}>
              <CardHeader>
                <CardTitle>{internship.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4"/>{internship.location}</span>
                    <span className="capitalize flex items-center gap-2"><Badge variant="outline">{internship.domain}</Badge></span>
                    {internship.stipend && <span className="flex items-center gap-2"><IndianRupee className="h-4 w-4"/> {internship.stipend.toLocaleString()}/month</span>}
                    {internship.duration && <span className="flex items-center gap-2"><Calendar className="h-4 w-4"/> {internship.duration}</span>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{internship.description}</p>
                <div className="flex flex-wrap gap-2">
                    {internship.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/recruiter/internships/${internship.id}/applicants`}>
                        <Users className="mr-2 h-4 w-4" />
                        View Applicants
                    </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/recruiter/internships/edit/${internship.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteInternship(internship.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Internships Posted</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Click the button above to post your first internship.
            </p>
        </div>
      )}
    </div>
  );
}
