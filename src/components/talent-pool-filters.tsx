
'use client';

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X, Search } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export interface TalentFilters {
  skills: string;
  location: string;
  university: string;
}

interface TalentPoolFiltersProps {
  onFilterChange: (filters: TalentFilters) => void;
}

export function TalentPoolFilters({ onFilterChange }: TalentPoolFiltersProps) {
  const [filters, setFilters] = useState<TalentFilters>({
    skills: '',
    location: '',
    university: '',
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange(filters);
    }, 300); // Debounce input to avoid excessive re-renders
    return () => clearTimeout(handler);
  }, [filters, onFilterChange]);

  const handleReset = () => {
    setFilters({
      skills: '',
      location: '',
      university: '',
    });
  };

  const isFiltered = filters.skills !== '' || filters.location !== '' || filters.university !== '';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">Skills (comma-separated)</label>
                <Input
                    placeholder="e.g. React, Python"
                    value={filters.skills}
                    onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                />
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                    placeholder="e.g. Mumbai"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">University</label>
                <Input
                    placeholder="e.g. IIT Bombay"
                    value={filters.university}
                    onChange={(e) => setFilters(prev => ({ ...prev, university: e.target.value }))}
                />
            </div>
            {isFiltered && (
                <div className="flex items-end">
                    <Button variant="ghost" onClick={handleReset} className="w-full">
                        <X className="mr-2 h-4 w-4" />
                        Reset Filters
                    </Button>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
