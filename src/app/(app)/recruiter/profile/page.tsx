
'use client';

import { CompanyProfileForm } from '@/components/company-profile-form';
import { useAuth } from '@/hooks/use-auth';
import { useIndustryProfile } from '@/hooks/use-industry-profile';
import type { IndustryProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function CompanyProfilePage() {
    const { user, loading: authLoading, userType } = useAuth();
    const { profile, saveProfile, isLoading: profileLoading } = useIndustryProfile();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && (!user || userType !== 'industry')) {
            router.replace('/login');
        }
    }, [user, userType, authLoading, router]);
    
    const handleSave = (data: IndustryProfile) => {
        if (user) {
            saveProfile(user.uid, data);
        }
    };
    
    if (authLoading || profileLoading || !user) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-10 w-1/3" />
                <div className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto max-w-4xl py-8">
            <div className="space-y-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
                <p className="text-muted-foreground">
                    Manage your company's information and how it appears to students.
                </p>
            </div>
            <CompanyProfileForm profile={profile} onSave={handleSave} />
        </div>
    );
}
