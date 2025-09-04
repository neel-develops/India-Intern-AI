
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  Building2,
  FileText,
  Home,
  PanelLeft,
  User,
  HelpCircle,
  LogIn,
  UserPlus
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { StudentProfileProvider } from '@/hooks/use-student-profile.tsx';
import { AuthProvider, useAuth } from '@/hooks/use-auth.tsx';
import { UserNav } from '@/components/user-nav';
import { Footer } from '@/components/footer';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  const navItems = [
    { href: '/', icon: Home, label: 'Home', auth: 'any' },
    { href: '/internships', icon: Briefcase, label: 'Training Programs', auth: 'any' },
    { href: '/companies', icon: Building2, label: 'Institutes', auth: 'any' },
    { href: '/applications', icon: FileText, label: 'My Applications', auth: true },
    { href: '/profile', icon: User, label: 'My Profile', auth: true },
    { href: '/eligibility', icon: HelpCircle, label: 'Eligibility', auth: 'any'},
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <SheetHeader className="p-4 flex flex-row justify-between items-center border-b">
        <Link href="/" className="flex items-center gap-2 text-primary font-semibold">
          <Logo className="w-8 h-8" />
          <span className="text-lg font-bold">intern.ai</span>
        </Link>
      </SheetHeader>
      <nav className="flex-1 px-4 py-2 space-y-2">
        {navItems.map((item) => {
            if (item.auth === true && !user) return null;
            
            const href = (user && item.href === '/') ? '/dashboard' : item.href;

            return (
                <Link
                    key={item.href}
                    href={href}
                    className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-accent',
                    pathname === href && 'bg-accent text-primary font-medium'
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Link>
            )
        })}
      </nav>
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

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="fixed flex h-full max-h-screen flex-col gap-2 md:w-[220px] lg:w-[280px]">
            {sidebarContent}
            </div>
        </div>
        <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
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
                    {sidebarContent}
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1 flex justify-end items-center gap-4">
                {isClient && headerContent}
            </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 bg-muted/20">
                {children}
            </main>
            <Footer />
        </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
            rel="stylesheet"
            />
        </head>
        <body
            className={cn(
            'min-h-screen bg-background font-body antialiased'
            )}
        >
            <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
                <AuthProvider>
                  <StudentProfileProvider>
                    <AppLayoutContent>{children}</AppLayoutContent>
                  </StudentProfileProvider>
                </AuthProvider>
                <Toaster />
            </ThemeProvider>
        </body>
    </html>
  );
}
