
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Eye, EyeOff, Building, GraduationCap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  const { user, userType, signInWithEmail, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'student' | 'industry'>('student');

  useEffect(() => {
    if (user) {
      if (userType === 'student') {
        router.push('/dashboard');
      } else if (userType === 'industry') {
        router.push('/recruiter');
      }
    }
  }, [user, userType, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password, loginType);
      toast({
        title: 'Sign In Successful',
        description: 'Redirecting to your dashboard...',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: 'Feature Coming Soon',
      description: `${provider} sign-in is not yet available in this prototype.`,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Tabs value={loginType} onValueChange={(value) => setLoginType(value as 'student' | 'industry')} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">
            <GraduationCap className="mr-2 h-4 w-4" />
            Student
          </TabsTrigger>
          <TabsTrigger value="industry">
            <Building className="mr-2 h-4 w-4" />
            Industry
          </TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <Card className="bg-card/60 backdrop-blur-lg">
            <form onSubmit={handleSignIn}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Student Login</CardTitle>
                <CardDescription>Sign in to find your perfect internship.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="student-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full rounded-full" type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In as Student'}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-secondary hover:underline">
                    Sign Up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="industry">
           <Card className="bg-card/60 backdrop-blur-lg">
            <form onSubmit={handleSignIn}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Industry Login</CardTitle>
                <CardDescription>Sign in to find top talent.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="industry-email">Work Email</Label>
                  <Input
                    id="industry-email"
                    type="email"
                    placeholder="hr@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="industry-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                     <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full rounded-full" type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In as Industry'}
                </Button>
                 <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/industry/register" className="text-secondary hover:underline">
                     Register your company
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
