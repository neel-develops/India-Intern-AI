import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Building2, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChooseRole() {
  const { user, userType, setUserType, waitForRole } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'student' | 'industry' | null>(null);
  const [busy, setBusy] = useState(false);

  const handleChoose = async (role: 'student' | 'industry') => {
    if (!user) return;
    setBusy(true);

    try {
      await setUserType(role);
      await waitForRole(user.uid, role);

      const destination = role === 'industry' ? '/recruiter' : '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg bg-card/60 backdrop-blur-lg border-2">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">Who are you on IndiaIntern.ai?</CardTitle>
          <CardDescription>This helps us show you the right dashboard and tools.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedRole('student')}
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
                <p className="font-semibold text-foreground">Student</p>
                <p className="text-xs text-muted-foreground mt-1">I'm looking for internship opportunities</p>
              </div>
              {selectedRole === 'student' && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-violet-500" />
              )}
            </button>

            <button
              onClick={() => setSelectedRole('industry')}
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
                <p className="font-semibold text-foreground">Recruiter</p>
                <p className="text-xs text-muted-foreground mt-1">I'm hiring interns for my company</p>
              </div>
              {selectedRole === 'industry' && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-blue-500" />
              )}
            </button>
          </div>

          <Button 
            className="w-full h-12 rounded-full text-lg font-medium transition-all"
            disabled={!selectedRole || busy}
            onClick={() => selectedRole && handleChoose(selectedRole)}
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Setting up your workspace...
              </>
            ) : (
              'Continue to Dashboard'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
