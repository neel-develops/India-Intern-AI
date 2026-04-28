import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

type Role = 'student' | 'industry' | null;

export default function RegisterPage() {
  const { user, signUpWithEmail, signInWithGoogle, setUserType, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step 1: choose role. Step 2: fill credentials.
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user ? (selectedRole === 'industry' ? '/recruiter' : '/dashboard') : '/dashboard');
    }
  }, [user, navigate, selectedRole]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Passwords do not match' });
      return;
    }
    if (password.length < 6) {
      toast({ variant: 'destructive', title: 'Password too short', description: 'Must be at least 6 characters.' });
      return;
    }
    try {
      await signUpWithEmail(email, password, name);
      if (selectedRole) setUserType(selectedRole);
      toast({ title: 'Account Created!', description: `Welcome to IndiaIntern.ai as a ${selectedRole === 'industry' ? 'Recruiter' : 'Student'}!` });
      navigate(selectedRole === 'industry' ? '/recruiter' : '/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message?.includes('email-already-in-use')
          ? 'This email is already registered. Please sign in instead.'
          : error.message || 'An unexpected error occurred.',
      });
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      if (selectedRole) setUserType(selectedRole);
      toast({ title: 'Account Created!', description: 'Welcome to IndiaIntern.ai!' });
      navigate(selectedRole === 'industry' ? '/recruiter' : '/dashboard');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Google Sign-Up Failed', description: error.message || 'Please try again.' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <Card className="w-full max-w-lg bg-card/60 backdrop-blur-lg">
        {step === 1 ? (
          <>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>Who are you joining as?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect('student')}
                  className={cn(
                    'group relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200',
                    'hover:border-violet-500 hover:bg-violet-500/10 hover:shadow-lg hover:shadow-violet-500/20',
                    selectedRole === 'student' ? 'border-violet-500 bg-violet-500/10' : 'border-border bg-card'
                  )}
                >
                  <div className="p-3 rounded-full bg-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">Student / Intern</p>
                    <p className="text-xs text-muted-foreground mt-1">Find and apply to internships, use AI career tools</p>
                  </div>
                  {selectedRole === 'student' && (
                    <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-violet-500" />
                  )}
                </button>

                <button
                  onClick={() => handleRoleSelect('industry')}
                  className={cn(
                    'group relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200',
                    'hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20',
                    selectedRole === 'industry' ? 'border-blue-500 bg-blue-500/10' : 'border-border bg-card'
                  )}
                >
                  <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">Recruiter / Company</p>
                    <p className="text-xs text-muted-foreground mt-1">Post internships, manage candidates, hire talent</p>
                  </div>
                  {selectedRole === 'industry' && (
                    <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-blue-500" />
                  )}
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-secondary hover:underline font-medium">Sign In</Link>
              </p>
            </CardFooter>
          </>
        ) : (
          <form onSubmit={handleSignUp}>
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
                <div className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  selectedRole === 'industry' ? 'bg-blue-500/20 text-blue-400' : 'bg-violet-500/20 text-violet-400'
                )}>
                  {selectedRole === 'industry' ? '🏢 Recruiter' : '🎓 Student'}
                </div>
              </div>
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>Join IndiaIntern.ai to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button" variant="outline" className="w-full flex items-center gap-3"
                onClick={handleGoogleSignUp} disabled={isGoogleLoading || loading}
              >
                {isGoogleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </Button>
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">OR</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input id="reg-name" type="text" placeholder={selectedRole === 'industry' ? 'Company Rep Name' : 'Ravi Kumar'}
                  value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" type="email" placeholder="m@example.com" required
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input id="reg-password" type={showPassword ? 'text' : 'password'} required minLength={6}
                    value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
                  <Button type="button" variant="ghost" size="icon"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input id="reg-confirm-password" type={showConfirmPassword ? 'text' : 'password'} required
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pr-10" />
                  <Button type="button" variant="ghost" size="icon"
                    className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full rounded-full" type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-secondary hover:underline font-medium">Sign In</Link>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
