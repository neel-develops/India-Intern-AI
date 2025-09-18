
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
import { Eye, EyeOff, Building } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const industryRegisterSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  companyName: z.string().min(2, 'Company name is required.'),
  position: z.string().min(2, 'Your position is required.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type IndustryRegisterFormValues = z.infer<typeof industryRegisterSchema>;

export default function IndustryRegisterPage() {
  const { user, userType, signUpIndustryUser, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<IndustryRegisterFormValues>({
    resolver: zodResolver(industryRegisterSchema),
    defaultValues: {
        name: '',
        email: '',
        companyName: '',
        position: '',
        password: '',
        confirmPassword: '',
    }
  });


  useEffect(() => {
    if (user && userType === 'industry') {
      router.push('/recruiter');
    }
  }, [user, userType, router]);

  const handleSignUp = async (data: IndustryRegisterFormValues) => {
    try {
      await signUpIndustryUser(data);
      toast({
        title: 'Registration Successful!',
        description: 'Redirecting to your dashboard...'
      });
      // The useEffect will handle the redirect
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-lg bg-card/60 backdrop-blur-lg">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)}>
            <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Building /> Join as an Industry Partner
                </CardTitle>
                <CardDescription>Register your company to post internships and discover top talent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Work Email</FormLabel><FormControl><Input type="email" placeholder="your@company.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                        <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Your Company" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="position" render={({ field }) => (
                        <FormItem><FormLabel>Your Position</FormLabel><FormControl><Input placeholder="e.g. HR Manager" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input type={showPassword ? 'text' : 'password'} className="pr-10" {...field} />
                                <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </FormControl>
                    <FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem><FormLabel>Confirm Password</FormLabel>
                         <FormControl>
                            <div className="relative">
                                <Input type={showConfirmPassword ? 'text' : 'password'} className="pr-10" {...field} />
                                <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </FormControl>
                    <FormMessage /></FormItem>
                )} />

            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full rounded-full" type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register Company'}
                </Button>
                <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/industry/login" className="text-secondary hover:underline">
                        Sign In
                    </Link>
                </p>
            </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}
