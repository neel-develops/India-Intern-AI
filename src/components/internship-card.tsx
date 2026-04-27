

import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Internship } from '@/lib/types';
import { Briefcase, MapPin, Tag, Cpu, BarChart3, Wand2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

interface InternshipCardProps {
  internship: Internship;
  matchReason?: string;
  matchPercentage?: number;
  onSelect?: (internship: Internship) => void;
  isSelected?: boolean;
}

export function InternshipCard({ internship, matchReason, matchPercentage, onSelect, isSelected }: InternshipCardProps) {
  const cardContent = (
    <>
      <div className="relative h-48 w-full">
        <img
          src={internship.image}
          alt={internship.title}
          
          
          className="rounded-t-lg"
          data-ai-hint={`${internship.domain} ${internship.company}`}
        />
         {matchPercentage !== undefined && (
            <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white py-1 px-3 rounded-full text-sm font-semibold">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>{matchPercentage}% Match</span>
            </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{internship.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> {internship.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {internship.location}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
                <Cpu className="h-3 w-3" /> {internship.domain}
            </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
            {internship.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {internship.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
        {matchReason && (
            <div className="p-3 bg-secondary/10 border border-dashed border-secondary/30 rounded-lg">
                <p className="text-sm font-medium text-secondary flex items-start gap-2">
                    <Wand2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="flex-1"><span className="font-semibold">AI Match Reason:</span> {matchReason}</span>
                </p>
            </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="pt-6">
        <Button asChild className="w-full">
            <Link to={`/internships/${internship.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </>
  )

  if (onSelect) {
    return (
        <div onClick={() => onSelect(internship)} className="cursor-pointer">
            <Card className={cn('flex flex-col h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 bg-card/70 backdrop-blur-sm', isSelected ? 'ring-2 ring-secondary' : '')}>
                {cardContent}
            </Card>
        </div>
    )
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 bg-card/70 backdrop-blur-sm">
        {cardContent}
    </Card>
  );
}
