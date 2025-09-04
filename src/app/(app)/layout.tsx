
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Briefcase,
  Building2,
  FileText,
  Home,
  PanelLeft,
  Info,
  User,
  Phone,
} from 'lucide-react';

import { cn } from '@/lib/utils';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/use-notifications';


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/internships', icon: Briefcase, label: 'Internships' },
    { href: '/companies', icon: Building2, label: 'Companies' },
    { href: '/applications', icon: FileText, label: 'My Applications' },
    { href: '/profile', icon: User, label: 'My Profile' },
    { href: '/recruiter', icon: Info, label: 'Recruiter View' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 flex justify-between items-center border-b">
        <Link href="/" className="flex items-center gap-2 text-primary font-semibold">
          <Logo className="w-8 h-8 text-secondary" />
          <span className="text-lg font-bold">intern.ai</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-2">
        {navItems.map((item) => (
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
        ))}
      </nav>
      <div className="mt-auto p-4">
        {/* ThemeToggle was here */}
      </div>
    </div>
  );

  const headerContent = (
    <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{unreadCount}</Badge>
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                    notifications.slice(0, 5).map(n => (
                         <DropdownMenuItem key={n.id} asChild>
                            <Link href={n.link || '/notifications'} className={cn(!n.read && 'font-bold')}>
                                {n.message}
                            </Link>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                   <Link href="/notifications">View all</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
         <Button>Login / Register</Button>
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
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
            <SheetContent side="left" className="flex flex-col p-0 md:hidden">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 flex justify-end items-center gap-4">
             {isClient && headerContent}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-background/95">
          {children}
        </main>
      </div>
    </div>
  );
}
