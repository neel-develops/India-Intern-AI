'use client';
import { InternshipForm } from '@/components/internship-form';
import { useInternships } from '@/hooks/use-internships';
import type { Internship } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function NewInternshipPage() {
    const { addInternship } = useInternships();
    const router = useRouter();
    const { toast } = useToast();

    const handleSave = (data: Omit<Internship, 'id' | 'image' | 'company'>) => {
        addInternship(data);
        toast({
            title: 'Internship Posted!',
            description: 'Your new internship is now live.'
        });
        router.push('/recruiter/internships');
    }

    return (
        <div className="container mx-auto max-w-4xl py-8">
            <div className="space-y-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Post a New Internship</h1>
                <p className="text-muted-foreground">
                    Fill out the details below to create your internship listing.
                </p>
            </div>
            <InternshipForm onSave={handleSave} />
        </div>
    )
}
