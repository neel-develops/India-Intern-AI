
import Image from 'next/image';
import Link from 'next/link';
import { companies } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function CompaniesPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Our Partner Companies
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore the innovative companies offering exciting internship opportunities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Card key={company.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4">
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={64}
                height={64}
                className="rounded-lg border"
                data-ai-hint={`${company.name}`}
              />
              <div>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription>
                    <Link href={company.website} target="_blank" className="inline-flex items-center gap-1 hover:underline">
                        {company.website} <ExternalLink className="h-3 w-3" />
                    </Link>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-4">
                {company.description}
              </p>
            </CardContent>
            <div className="p-6 pt-0">
                <Button asChild className="w-full">
                    <Link href={`/companies/${company.id}`}>View Profile & Internships</Link>
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
