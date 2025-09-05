
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { StudentProfileProvider } from '@/hooks/use-student-profile.tsx';
import { AuthProvider } from '@/hooks/use-auth.tsx';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700']
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
             poppins.variable
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
                        {children}
                    </AuthProvider>
                </StudentProfileProvider>
                <Toaster />
            </ThemeProvider>
        </body>
    </html>
  );
}
