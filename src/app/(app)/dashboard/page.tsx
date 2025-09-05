
'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SmartMatchInternships } from '@/components/smart-match-internships';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth.tsx';
import { useEffect } from 'react';


export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);


    if (loading || !user) {
        return (
             <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

  return (
    <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
                Welcome back! Here's where you can find your AI-powered internship matches.
            </p>
        </div>
        <Separator />
        <SmartMatchInternships />
    </div>
  );
}
