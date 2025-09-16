
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { StudentProfileProvider } from '@/hooks/use-student-profile.tsx';
import { AuthProvider } from '@/hooks/use-auth.tsx';
import { Inter } from 'next/font/google';
import { AppShell } from '@/components/app-shell';
import { ClientOnly } from '@/components/client-only';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body
            className={cn(
            'min-h-screen bg-background font-body antialiased',
             inter.variable
            )}
        >
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <StudentProfileProvider>
                    <AuthProvider>
                        <AppShell>
                            {children}
                        </AppShell>
                        <ClientOnly>
                            <Toaster />
                        </ClientOnly>
                    </AuthProvider>
                </StudentProfileProvider>
            </ThemeProvider>
        </body>
    </html>
  );
}
