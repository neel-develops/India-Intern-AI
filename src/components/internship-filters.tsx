
'use client';

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export interface Filters {
  domain: string;
  location: string;
  skills: string;
}

interface InternshipFiltersProps {
  onFilterChange: (filters: Filters) => void;
  uniqueDomains: string[];
  uniqueLocations: string[];
}

export function InternshipFilters({ onFilterChange, uniqueDomains, uniqueLocations }: InternshipFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    domain: 'all',
    location: 'all',
    skills: '',
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleReset = () => {
    setFilters({
      domain: 'all',
      location: 'all',
      skills: '',
    });
  };

  const isFiltered = filters.domain !== 'all' || filters.location !== 'all' || filters.skills !== '';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
                <label className="text-sm font-medium">Domain</label>
                <Select
                    value={filters.domain}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, domain: value }))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by domain" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Domains</SelectItem>
                        {uniqueDomains.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {uniqueLocations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">Skills (comma-separated)</label>
                <div className="flex gap-2">
                    <Input
                        placeholder="e.g. React, Python"
                        value={filters.skills}
                        onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                        className="flex-grow"
                    />
                    {isFiltered && (
                        <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Reset filters">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
