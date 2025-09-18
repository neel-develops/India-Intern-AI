
'use client';
import { InternshipForm } from '@/components/internship-form';
import { useInternships } from '@/hooks/use-internships';
import type { Internship } from '@/lib/types';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditInternshipPage() {
    const { internships, updateInternship, isLoading } = useInternships();
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { toast } = useToast();

    const internship = internships.find(i => i.id === id);

    const handleSave = (data: Omit<Internship, 'id' | 'image' | 'company'>) => {
        if (!internship) return;
        updateInternship({ ...internship, ...data });
        toast({
            title: 'Internship Updated!',
            description: 'Your internship listing has been successfully updated.'
        });
        router.push('/recruiter/internships');
    }

    if (isLoading) {
        return (
             <div className="container mx-auto max-w-4xl py-8 space-y-8">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-96 w-full" />
             </div>
        )
    }

    if (!internship) {
        return <div className="container mx-auto max-w-4xl py-8">Internship not found.</div>
    }

    return (
        <div className="container mx-auto max-w-4xl py-8">
            <div className="space-y-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Internship</h1>
                <p className="text-muted-foreground">
                    Update the details for your internship listing below.
                </p>
            </div>
            <InternshipForm onSave={handleSave} internship={internship} />
        </div>
    )
}
