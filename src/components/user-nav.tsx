

import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useStudentProfile } from '@/hooks/use-student-profile';
import { useIndustryProfile } from '@/hooks/use-industry-profile';
import type { User } from 'firebase/auth';

interface UserNavProps {
  user: User | null;
}

function getInitials(name: string) {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export function UserNav({ user }: UserNavProps) {
  const { userType, signOut: logOut } = useAuth();
  const { profile: studentProfile } = useStudentProfile();
  const { profile: industryProfile } = useIndustryProfile();

  if (!user) {
    return null;
  }
  
  const userName = userType === 'industry' 
    ? (user.displayName || 'Recruiter')
    : (studentProfile?.personalInfo?.name || user.displayName || 'Student');
    
  const userEmail = user.email || 'No email';
  const userAvatar = user.photoURL;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} alt={userName} />
            <AvatarFallback>{getInitials(userName || '')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userType === 'industry' ? (
          <>
            <DropdownMenuItem asChild>
                <Link to="/recruiter">Recruiter Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link to="/profile">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link to="/recruiter/internships">My Postings</Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
                <Link to="/profile">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link to="/applications">My Applications</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem asChild>
            <Link to="/settings">Account Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logOut()} className="text-red-500 focus:text-red-500">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
