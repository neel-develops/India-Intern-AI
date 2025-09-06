
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { StudentProfile } from '@/lib/types';
import { Mail, MapPin, Star, User, ShieldQuestion, GraduationCap, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StudentCardProps {
  student: StudentProfile & {
    matchScore?: number;
    reasons?: string[];
  };
}

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-start gap-4">
        <Avatar className="h-12 w-12">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.personalInfo.name}`} />
            <AvatarFallback>{getInitials(student.personalInfo.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
            <CardTitle>{student.personalInfo.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-xs">
                <MapPin className="h-3 w-3" /> {student.personalInfo.location}
            </CardDescription>
             {student.personalInfo.degree && student.personalInfo.stream && (
                <CardDescription className="flex items-center gap-2 text-xs mt-1">
                    <BookOpen className="h-3 w-3" /> {student.personalInfo.degree} in {student.personalInfo.stream}
                </CardDescription>
            )}
            {student.personalInfo.university && (
                <CardDescription className="flex items-center gap-2 text-xs mt-1">
                    <GraduationCap className="h-3 w-3" /> {student.personalInfo.university}
                </CardDescription>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        
        <p className="text-sm text-muted-foreground line-clamp-3">
            {student.resumeSummary}
        </p>
        <div className="flex flex-wrap gap-2">
          {student.skills.slice(0, 5).map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
        {student.matchScore !== undefined && student.reasons && (
            <div className="p-3 bg-accent/50 border border-dashed border-accent-foreground/30 rounded-lg space-y-2">
                <div className="flex items-center gap-2 font-semibold text-accent-foreground">
                    <Star className="h-5 w-5 text-primary" />
                    Match Score: {student.matchScore}/100
                </div>
                <ul className="list-disc list-inside text-sm text-accent-foreground space-y-1">
                    {student.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
                </ul>
            </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="pt-6">
        <Button className="w-full">
            <User className="mr-2 h-4 w-4" /> View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
