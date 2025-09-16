
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, Briefcase, IndianRupee, Search, Award, Users, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const features = [
    "AI-Powered Matchmaking for perfect internships",
    "Access to top-tier training institutes",
    "Streamlined application tracking",
    "Comprehensive eligibility checker",
];

const schemeBenefits = [
    { 
        icon: <Award className="h-10 w-10 text-secondary" />, 
        title: "Gain Real-World Experience", 
        description: "Get 12 months of invaluable hands-on experience working in India's leading companies and institutions." 
    },
    { 
        icon: <IndianRupee className="h-10 w-10 text-secondary" />, 
        title: "Receive Financial Support", 
        description: "Benefit from a monthly stipend of ₹4500 from the government and ₹500 from the industry, plus a one-time grant of ₹6000." 
    },
    { 
        icon: <Search className="h-10 w-10 text-secondary" />, 
        title: "Explore Diverse Opportunities", 
        description: "Choose from a wide variety of sectors and roles in top-tier organizations across the nation." 
    },
    { 
        icon: <GraduationCap className="h-10 w-10 text-secondary" />, 
        title: "Enhance Your Skills", 
        description: "Develop critical professional skills and significantly improve your employability for a successful career start." 
    },
];

export function LandingContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full pt-20 md:pt-32 pb-12 md:pb-24 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900/50 dark:via-background dark:to-violet-900/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                  Your Gateway to Premier Internships in India
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Leverage the power of AI to find the perfect training program with India's top companies. Built for the PM Internship Scheme.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/register">Get Started <ArrowRight className="ml-2" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full">
                    <Link href="/eligibility">Check Eligibility</Link>
                  </Button>
                </div>
              </div>
              <div className="w-full max-w-md mx-auto">
                <Card className="shadow-2xl bg-white/60 dark:bg-card/60 backdrop-blur-lg border-white/20">
                    <CardHeader>
                        <CardTitle className="text-secondary">AI Smart Matching</CardTitle>
                        <CardDescription>Our AI analyzes your profile to find the best internship matches for you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 mt-1" />
                                <p className="text-muted-foreground flex-1">{feature}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

         <section id="features" className="w-full py-12 md:py-24 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-10">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">About the PM Internship Scheme</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                A national initiative to bridge the gap between talented youth and India's leading companies, fostering skill development and employability.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {schemeBenefits.map((benefit, i) => (
                  <Card key={i} className="text-center p-6 flex flex-col items-center bg-card/50 backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-2">
                    <div className="mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
