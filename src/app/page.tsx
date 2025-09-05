
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
        // This effect can handle initial redirects if needed,
        // but AppShell now primarily controls visibility and routing logic.
    }, [user, loading, router]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (user) {
        return <DashboardPage />;
    }

    return <LandingContent />;
}
