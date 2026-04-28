


import * as React from 'react';
import { Link } from 'react-router-dom';

import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  FileText,
  PanelLeft,
  User,
  HelpCircle,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Home,
  Bell,
  FileScan,
  Sparkles,
  MessageSquare,
  BarChart3,
  BrainCircuit,
  GraduationCap,
  PlusCircle,
  Users,
  Bookmark,
  ClipboardList,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import { UserNav } from '@/components/user-nav';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/use-notifications';

function useIsClient() {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])
 
  return isClient
}

export function AppShell() {
  const pathname = useLocation().pathname;
  const { user, userType, loading } = useAuth();
  const navigate = useNavigate();
  const isClient = useIsClient();
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  const publicNavItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/internships', icon: Briefcase, label: 'Internships' },
    { href: '/companies', icon: Building2, label: 'Institutes' },
    { href: '/eligibility', icon: HelpCircle, label: 'Eligibility'},
  ];

  const studentNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/internships', icon: Briefcase, label: 'Internships' },
    { href: '/saved', icon: Bookmark, label: 'Saved' },
    { href: '/applications', icon: FileText, label: 'My Applications' },
    { href: '/profile', icon: User, label: 'My Profile' },
  ];
  
  const studentAiTools = [
     { href: '/skill-gap-visualizer', icon: BarChart3, label: 'Skill Gap Visualizer' },
     { href: '/resume-analyser', icon: FileScan, label: 'Resume Analyser' },
     { href: '/mock-interview', icon: BrainCircuit, label: 'Mock Interviewer' },
     { href: '/career-coach', icon: GraduationCap, label: 'AI Career Coach' },
  ];

  const recruiterNavItems = [
    { href: '/recruiter', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/recruiter/internships', icon: Briefcase, label: 'My Postings' },
    { href: '/recruiter/candidates', icon: Users, label: 'All Candidates' },
    { href: '/recruiter/internships/new', icon: PlusCircle, label: 'Post New Job' },
  ];

  const recruiterAiTools = [
    { href: '/recruiter/candidates', icon: Sparkles, label: 'AI Candidate Rank' },
  ];

  const isRecruiter = user && userType === 'industry';

  const getNavItems = () => {
    if (!user) return publicNavItems.filter(item => item.href !== '/');
    if (isRecruiter) return recruiterNavItems;
    return studentNavItems;
  };

  const getAiTools = () => {
    if (!user) return [];
    if (isRecruiter) return recruiterAiTools;
    return studentAiTools;
  };
  
  const sidebarHeader = (
    <Link to="/" className="flex flex-col items-start gap-2">
      <img src="https://i.ibb.co/LdN7TD1j/image-removebg-preview.png" alt="IndiaIntern.ai Logo" width={150} height={33} />
      <p className="text-xs text-muted-foreground -mt-2">A project of Smart India Hackathon</p>
    </Link>
  );

  const roleChip = user && (
    <div className={cn(
      'mx-4 mb-2 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit',
      isRecruiter ? 'bg-blue-500/20 text-blue-400' : 'bg-violet-500/20 text-violet-400'
    )}>
      {isRecruiter ? <Building2 className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
      {isRecruiter ? 'Recruiter' : 'Student'}
    </div>
  );
  
  const sidebarNav = (
    <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
      {roleChip}
      <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main Menu</p>
      {getNavItems().map((item) => (
          <Link key={item.href} to={item.href}
              className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
              pathname === item.href && 'bg-accent text-primary font-medium'
              )}
          >
              <item.icon className="h-4 w-4" />
              {item.label}
          </Link>
      ))}
      {user && getAiTools().length > 0 && (
        <>
            <p className="px-3 pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Tools</p>
            {getAiTools().map((item) => (
                <Link key={item.href} to={item.href}
                    className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
                    pathname === item.href && 'bg-accent text-primary font-medium'
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Link>
            ))}
        </>
      )}
    </nav>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        {sidebarHeader}
      </div>
      {sidebarNav}
      {!user && (
        <div className="px-4 py-2 mt-auto border-t">
          <div className="space-y-2">
             <Button asChild className="w-full justify-start gap-3 rounded-lg px-3 py-2" variant="outline">
                <Link to="/login"><LogIn className="h-4 w-4" />Login</Link>
            </Button>
             <Button asChild className="w-full justify-start gap-3 rounded-lg px-3 py-2">
                <Link to="/register"><UserPlus className="h-4 w-4" />Register</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  
  const mobileSidebarContent = (
     <div className="flex flex-col h-full">
      <SheetHeader className="p-4 flex flex-row justify-between items-center border-b">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        {sidebarHeader}
      </SheetHeader>
      {sidebarNav}
      {!user && (
        <div className="px-4 py-2 mt-auto border-t">
          <div className="space-y-2">
             <Button asChild className="w-full justify-start gap-3 rounded-lg px-3 py-2" variant="outline">
                <Link to="/login"><LogIn className="h-4 w-4" />Login</Link>
            </Button>
             <Button asChild className="w-full justify-start gap-3 rounded-lg px-3 py-2">
                <Link to="/register"><UserPlus className="h-4 w-4" />Register</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const headerContent = (
    <>
      <ThemeToggle />
      {loading ? (
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
      ) : user ? (
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
                <Link to="/notifications" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadCount}
                    </span>
                )}
                </Link>
            </Button>
          <UserNav user={user} />
        </div>
      ) : (
        <div className="hidden md:flex gap-2">
            <Button variant="outline" asChild className="rounded-full">
                <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="rounded-full">
                <Link to="/register">Register</Link>
            </Button>
        </div>
      )}
    </>
  );

  const isPublicPage = ['/login', '/register', '/eligibility'].includes(pathname) || pathname.startsWith('/companies');
  const isLandingPage = pathname === '/';

  if ((!user && !loading) && (isLandingPage || isPublicPage)) {
    return (
        <div className="flex flex-col min-h-screen">
             <header className="flex h-20 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-lg px-4 lg:px-6 sticky top-0 z-30 py-4">
                <div className="flex flex-1 items-center gap-8">
                  <Link to="/" className="flex items-center gap-2">
                    <img src="https://i.ibb.co/LdN7TD1j/image-removebg-preview.png" alt="IndiaIntern.ai Logo" width={120} height={26} />
                  </Link>
                  <nav className="hidden md:flex gap-4">
                      {publicNavItems.map(item => (
                          <Link key={item.href} to={item.href} className="text-muted-foreground hover:text-primary">{item.label}</Link>
                      ))}
                  </nav>
                </div>
                <div className="flex flex-1 items-center justify-end gap-4">
                    {headerContent}
                </div>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="fixed flex h-full max-h-screen flex-col gap-2 md:w-[220px] lg:w-[280px]">
            {sidebarContent}
            </div>
        </div>
        <div className="flex flex-col">
            <header className="flex h-20 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 lg:px-6 sticky top-0 z-30 py-4">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0 w-[280px] md:hidden">
                    {mobileSidebarContent}
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1 flex justify-end items-center gap-4">
                {headerContent}
            </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 bg-muted/20">
                <Outlet />
            </main>
            <Footer />
        </div>
    </div>
  );
}
