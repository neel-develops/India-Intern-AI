
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
  Home
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
import { useAuth } from '@/hooks/use-auth.tsx';
import { UserNav } from '@/components/user-nav';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navItems = [
    { href: '/', icon: Home, label: 'Home', auth: 'any' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', auth: true },
    { href: '/internships', icon: Briefcase, label: 'Training Programs', auth: 'any' },
    { href: '/companies', icon: Building2, label: 'Institutes', auth: 'any' },
    { href: '/applications', icon: FileText, label: 'My Applications', auth: true },
    { href: '/profile', icon: User, label: 'My Profile', auth: true },
    { href: '/eligibility', icon: HelpCircle, label: 'Eligibility', auth: 'any'},
  ];
  
  const sidebarHeader = (
    <Link href="/" className="flex flex-col items-start gap-2">
      <Image src="https://i.ibb.co/LdN7TD1j/image-removebg-preview.png" alt="IndiaIntern.ai Logo" width={180} height={40} />
      <p className="text-xs text-muted-foreground -mt-2">A project of Smart India Hackathon</p>
    </Link>
  );
  
  const sidebarNav = (
    <nav className="flex-1 px-4 py-2 space-y-2">
      {navItems.map((item) => {
          if (item.auth === true && !user) return null;
          if (item.href === '/' && user) return null; // Hide home link for logged in users in sidebar
          if (item.href === '/dashboard' && !user) return null;
          
          return (
              <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
                  pathname === item.href && 'bg-accent text-primary font-medium'
                  )}
              >
                  <item.icon className="h-4 w-4" />
                  {item.label}
              </Link>
          )
      })}
    </nav>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        {sidebarHeader}
      </div>
      {sidebarNav}
      {!user && isClient && (
        <div className="px-4 py-2 mt-auto border-t">
          <div className="space-y-2">
             <Button asChild className="w-full justify-start gap-3 rounded-lg px-3 py-2" variant="outline">
                <Link href="/login"><LogIn className="h-4 w-4" />Login</Link>
            </Button>
             <Button asChild className="w-full justify-start gap-3 rounded-lg px-3 py-2">
                <Link href="/register"><UserPlus className="h-4 w-4" />Register</Link>
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
      {!user && isClient && (
        <div className="px-4 py-2 mt-auto border-t">
          <div className="space-y-2">
             <Button asChild className="w-full justify-start gap-3 rounded-lg px-3 py-2" variant="outline">
                <Link href="/login"><LogIn className="h-4 w-4" />Login</Link>
            </Button>
             <Button asChild className="w-full justify-start gap-3 rounded-lg px-3 py-2">
                <Link href="/register"><UserPlus className="h-4 w-4" />Register</Link>
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
        <UserNav user={user} />
      ) : (
        <div className="hidden md:flex gap-2">
            <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/register">Register</Link>
            </Button>
        </div>
      )}
    </>
  );

  const isPublicPage = ['/login', '/register', '/eligibility'].includes(pathname) || pathname.startsWith('/companies');
  const isLandingPage = pathname === '/';

  // If user is not logged in and on a public page, or on landing page, show a simpler layout
  if (!user && (isLandingPage || isPublicPage)) {
    return (
        <div className="flex flex-col min-h-screen">
             <header className="flex h-16 items-center gap-4 border-b bg-gray-100 dark:bg-gray-800 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
                <Link href="/" className="flex items-center gap-2 mr-auto">
                  <Image src="https://i.ibb.co/LdN7TD1j/image-removebg-preview.png" alt="IndiaIntern.ai Logo" width={180} height={40} />
                </Link>
                <nav className="hidden md:flex gap-4">
                     <Link href="/internships" className="text-muted-foreground hover:text-primary">Training Programs</Link>
                     <Link href="/companies" className="text-muted-foreground hover:text-primary">Institutes</Link>
                     <Link href="/eligibility" className="text-muted-foreground hover:text-primary">Eligibility</Link>
                </nav>
                <div className="flex items-center gap-4 ml-auto">
                    {isClient && headerContent}
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
  }


  // Main application layout for authenticated users
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 md:block">
            <div className="fixed flex h-full max-h-screen flex-col gap-2 md:w-[220px] lg:w-[280px]">
            {sidebarContent}
            </div>
        </div>
        <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-gray-100 dark:bg-gray-800 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <Sheet>
                <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0 w-[280px] md:hidden">
                    {mobileSidebarContent}
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1 flex justify-end items-center gap-4">
                {isClient && headerContent}
            </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 bg-background">
                {children}
            </main>
            <Footer />
        </div>
    </div>
  );
}
