
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
    "AI-Powered Matchmaking for perfect internships",
    "Access to top-tier training institutes",
    "Streamlined application tracking",
    "Comprehensive eligibility checker",
];

const testimonials = [
    { name: 'Aarav Sharma', quote: 'IndiaIntern.ai made finding a relevant internship incredibly easy. The AI recommendations were spot on!', role: 'Student, Delhi Technological University' },
    { name: 'Priya Singh', quote: 'A fantastic platform that connects students with meaningful opportunities. The process was seamless and efficient.', role: 'Student, IIT Bombay' },
];

export function LandingContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full pt-20 md:pt-32 pb-12 md:pb-24 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                  Your Gateway to Premier Internships in India
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Leverage the power of AI to find the perfect training program with India's top companies. Built for the PM Internship Scheme.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/register">Get Started <ArrowRight className="ml-2" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/eligibility">Check Eligibility</Link>
                  </Button>
                </div>
              </div>
              <div className="w-full max-w-md mx-auto">
                <Card className="shadow-2xl">
                    <CardHeader>
                        <CardTitle>AI Smart Matching</CardTitle>
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

         <section id="features" className="w-full py-12 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-10">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose IndiaIntern.ai?</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                We provide a comprehensive platform to bridge the gap between talented students and India's leading companies.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards Here */}
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 md:text-4xl">
              Success Stories
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
                {testimonials.map((t, i) => (
                    <Card key={i} className="p-6">
                        <blockquote className="text-lg font-semibold leading-snug">
                            “{t.quote}”
                        </blockquote>
                        <div className="mt-4">
                            <p className="font-semibold">{t.name}</p>
                            <p className="text-sm text-muted-foreground">{t.role}</p>
                        </div>
                    </Card>
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
