'use client';

import { useState, useMemo, useCallback } from 'react';
import { InternshipCard } from '@/components/internship-card';
import { InternshipFilters, type Filters } from '@/components/internship-filters';
import { internships as allInternships } from '@/lib/data';
import type { Internship } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Briefcase } from 'lucide-react';

export default function InternshipsPage() {
  const [filters, setFilters] = useState<Filters>({ domain: 'all', location: 'all', skills: '' });

  const uniqueDomains = useMemo(() => [...new Set(allInternships.map(i => i.domain))], []);
  const uniqueLocations = useMemo(() => [...new Set(allInternships.map(i => i.location))], []);

  const filteredInternships = useMemo(() => {
    return allInternships.filter((internship) => {
      const domainMatch = filters.domain === 'all' || internship.domain === filters.domain;
      const locationMatch = filters.location === 'all' || internship.location === filters.location;
      const skillsMatch = filters.skills.trim() === '' || 
        filters.skills.toLowerCase().split(',').every(skill => 
          internship.skills.some(is => is.toLowerCase().includes(skill.trim()))
        );
      return domainMatch && locationMatch && skillsMatch;
    });
  }, [filters]);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Find Your Next Opportunity
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse and filter through our curated list of internships.
        </p>
      </div>

      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm -mx-6 px-6 py-4 mb-8">
        <InternshipFilters onFilterChange={handleFilterChange} uniqueDomains={uniqueDomains} uniqueLocations={uniqueLocations} />
      </div>

      {filteredInternships.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInternships.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      ) : (
        <Alert>
            <Briefcase className="h-4 w-4" />
            <AlertTitle>No Internships Found</AlertTitle>
            <AlertDescription>
                No internships match your current filter criteria. Try adjusting your filters.
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
