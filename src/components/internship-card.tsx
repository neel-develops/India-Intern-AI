
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Internship } from '@/lib/types';
import { Briefcase, MapPin, Tag, Cpu, BarChart3 } from 'lucide-react';

interface InternshipCardProps {
  internship: Internship;
  matchReason?: string;
  onSelect?: (internship: Internship) => void;
  isSelected?: boolean;
}

export function InternshipCard({ internship, matchReason, onSelect, isSelected }: InternshipCardProps) {
  const cardContent = (
    <>
      <div className="relative h-48 w-full">
        <Image
          src={internship.image}
          alt={internship.title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={`${internship.domain} ${internship.company}`}
        />
      </div>
      <CardHeader>
        <CardTitle>{internship.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> {internship.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
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
            <Badge key={skill} variant="outline">{skill}</Badge>
          ))}
        </div>
        {matchReason && (
            <div className="p-3 bg-accent/50 border border-dashed border-accent-foreground/30 rounded-lg">
                <p className="text-sm font-medium text-accent-foreground">
                    <span className="font-semibold">Match Reason:</span> {matchReason}
                </p>
            </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="pt-6">
        <Button asChild className="w-full">
            <Link href={`/internships/${internship.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </>
  )

  if (onSelect) {
    return (
        <div onClick={() => onSelect(internship)} className="cursor-pointer">
            <Card className={`flex flex-col h-full overflow-hidden transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                {cardContent}
            </Card>
        </div>
    )
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
        {cardContent}
    </Card>
  );
}
