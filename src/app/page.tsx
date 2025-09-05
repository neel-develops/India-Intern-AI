
'use client';

import { useAuth } from '@/hooks/use-auth.tsx';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LandingContent } from '@/components/landing-content';
import DashboardPage from '@/app/(app)/dashboard/page';

export default function HomePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace('/dashboard');
        }
    }, [user, loading, router]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }
    
    // If there is a user, the effect will redirect to /dashboard.
    // If no user, show the landing content.
    if (user) {
        return (
             <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Redirecting to your dashboard...</div>
            </div>
        );
    }

    return <LandingContent />;
}
