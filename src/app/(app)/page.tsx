
'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SmartMatchInternships } from '@/components/smart-match-internships';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">intern.ai</h1>
            <p className="text-muted-foreground">
                Powered by Smart India Hackathon
            </p>
        </div>
        <Separator />
        <SmartMatchInternships />
    </div>
  );
}
