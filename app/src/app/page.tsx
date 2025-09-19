
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LandingContent } from '@/components/landing-content';

export default function HomePage() {
    const { user, userType, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            if (userType === 'student') {
                router.replace('/dashboard');
            } else if (userType === 'industry') {
                router.replace('/recruiter');
            }
        }
    }, [user, userType, loading, router]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }
    
    // If there is a user, the effect will redirect.
    // If no user, show the landing content.
    if (user) {
        return (
             <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Redirecting...</div>
            </div>
        );
    }

    return <LandingContent />;
}
