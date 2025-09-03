import { SmartMatchInternships } from '@/components/smart-match-internships';

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

      <SmartMatchInternships />
    </div>
  );
}
