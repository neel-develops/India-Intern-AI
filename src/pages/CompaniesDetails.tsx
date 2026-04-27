
import { useParams } from 'react-router-dom';

import { companies, internships } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InternshipCard } from '@/components/internship-card';
import { Card } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';


export default function CompanyDetailsPage() {
  const params = useParams();
  const { id } = params;

  const company = companies.find((c) => c.id === id);
  const companyInternships = internships.filter(i => i.company === company?.name);

  if (!company) {
    return <div>Institute not found</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 space-y-12">
        <Card className="overflow-hidden">
            <div className="bg-muted/30 p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    <img src={company.logo} alt={`${company.name} logo`} width={128} height={128} className="rounded-lg border-4 border-background shadow-lg" data-ai-hint={`${company.name}`} />
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">{company.name}</h1>
                        <Link to={company.website} target="_blank" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary">
                            <LinkIcon className="h-4 w-4" />
                            {company.website}
                        </Link>
                        <p className="text-lg text-muted-foreground pt-2">{company.description}</p>
                    </div>
                </div>
            </div>
        </Card>

        <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8">
                Internships at {company.name}
            </h2>

            {companyInternships.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {companyInternships.map((internship) => (
                        <InternshipCard key={internship.id} internship={internship} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium text-muted-foreground">No open internships</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {company.name} does not have any open internships at the moment. Please check back later.
                    </p>
                </div>
            )}
        </div>
    </div>
  );
}
