import type { Internship } from '@/lib/types';

export interface SmartMatchInternshipsProps {
    onInternshipSelect?: (internship: Internship) => void;
    selectedInternshipId?: string;
}

export type EnrichedInternship = Internship & { 
    matchReason: string;
    matchPercentage: number;
};
