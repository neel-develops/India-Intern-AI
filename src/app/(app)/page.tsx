
import { SmartMatchInternships } from '@/components/smart-match-internships';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome to Internship Aligner
        </h1>
        <p className="text-lg text-muted-foreground">
          Your journey to the perfect internship starts here. Complete your profile to get AI-powered recommendations.
        </p>
      </div>

      <div className="mb-8">
        <Card>
            <CardHeader>
                <CardTitle>Project Context</CardTitle>
                <CardDescription>
                    This project is developed for the Ministry of Corporate Affairs (MoCA) under the &quot;Smart Automation&quot; theme.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Organization</p>
                        <p className="font-semibold">Ministry of Corporate Affairs</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Department</p>
                        <p className="font-semibold">Ministry of Corporate Affairs (MoCA)</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Category</p>
                        <Badge variant="secondary">Software</Badge>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Theme</p>
                        <Badge variant="secondary">Smart Automation</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <SmartMatchInternships />
    </div>
  );
}
