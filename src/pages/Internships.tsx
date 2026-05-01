import { useState, useMemo, useCallback, useEffect } from 'react';
import { InternshipCard } from '@/components/internship-card';
import { InternshipFilters, type Filters } from '@/components/internship-filters';
import { useInternships } from '@/hooks/use-internships';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Briefcase, Search, X } from 'lucide-react';
import { SmartMatchInternships } from '@/components/smart-match-internships';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function InternshipsPage() {
  // Use the hook — includes static AND recruiter-posted internships from Firestore
  const { internships: allInternships, isLoading } = useInternships();
  const [filters, setFilters] = useState<Filters>({ domain: 'all', location: 'all', skills: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const uniqueDomains = useMemo(() => [...new Set(allInternships.map(i => i.domain))], [allInternships]);
  const uniqueLocations = useMemo(() => [...new Set(allInternships.map(i => i.location))], [allInternships]);

  const filteredInternships = useMemo(() => {
    return allInternships.filter((internship) => {
      const domainMatch = filters.domain === 'all' || internship.domain === filters.domain;
      const locationMatch = filters.location === 'all' || 
        internship.location.toLowerCase().includes(filters.location.toLowerCase());
      const skillsMatch = filters.skills.trim() === '' ||
        filters.skills.toLowerCase().split(',').every(skill =>
          internship.skills.some(is => is.toLowerCase().includes(skill.trim()))
        );
      const searchMatch = debouncedSearch.trim() === '' ||
        internship.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        internship.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        internship.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        internship.skills.some(s => s.toLowerCase().includes(debouncedSearch.toLowerCase()));
      return domainMatch && locationMatch && skillsMatch && searchMatch;
    });
  }, [allInternships, filters, debouncedSearch]);

  const handleFilterChange = useCallback((newFilters: Filters) => setFilters(newFilters), []);
  const hasActiveFilters = filters.domain !== 'all' || filters.location !== 'all' || filters.skills !== '' || searchQuery !== '';
  const clearAll = () => { setFilters({ domain: 'all', location: 'all', skills: '' }); setSearchQuery(''); };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Find Your Internship
        </h1>
        <p className="text-lg text-muted-foreground">
          Use our AI-powered matchmaking or browse and filter through our curated list of internships.
        </p>
      </div>

      <SmartMatchInternships />
      <Separator />

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="internship-search"
            placeholder="Search by title, company, or skill..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-11 text-base"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearAll} className="shrink-0 gap-1.5 h-11">
            <X className="h-3.5 w-3.5" /> Clear all
          </Button>
        )}
      </div>

      <div>
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm -mx-6 px-6 py-4 mb-8">
          <InternshipFilters onFilterChange={handleFilterChange} uniqueDomains={uniqueDomains} uniqueLocations={uniqueLocations} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Loading internships…' : (
              <>
                {filteredInternships.length} internship{filteredInternships.length !== 1 ? 's' : ''} found
                {debouncedSearch && <span className="font-medium"> for "<span className="text-foreground">{debouncedSearch}</span>"</span>}
              </>
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredInternships.length > 0 ? (
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
              No internships match your current filters.{' '}
              <button onClick={clearAll} className="underline text-primary">Clear all filters</button> to see all listings.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
