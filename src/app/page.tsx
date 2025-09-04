
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { companies } from '@/lib/data';
import { BriefcaseBusiness, IndianRupee, PiggyBank, Search, CalendarDays, Briefcase, GraduationCap, Users } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth.tsx';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { SmartMatchInternships } from '@/components/smart-match-internships';


interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: string | ReactNode;
}

const InfoCard = ({ icon, title, description }: InfoCardProps) => (
  <Card className="text-center flex flex-col items-center p-6 bg-background/50 backdrop-blur-sm">
    <div className="mb-4 text-primary">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </Card>
);

const eligibilityCriteria = [
    { 
        icon: <CalendarDays className="h-12 w-12" />, 
        title: "Age", 
        description: "21-24 Years" 
    },
    { 
        icon: <Briefcase className="h-12 w-12" />, 
        title: "Job Status", 
        description: "Not Employed Full Time" 
    },
    { 
        icon: <GraduationCap className="h-12 w-12" />, 
        title: "Education", 
        description: "Not Enrolled Full Time" 
    },
    { 
        icon: <Users className="h-12 w-12" />, 
        title: "Family", 
        description: (
            <ul className="text-center list-none">
                <li>Not Earning &gt; ₹8 Lakhs PA</li>
                <li>No Govt. Job in Family</li>
            </ul>
        ) 
    },
];

const coreBenefits = [
    {
        icon: <BriefcaseBusiness className="h-12 w-12" />,
        title: "Experience",
        description: "12 months real-life experience in India's top companies"
    },
    {
        icon: <IndianRupee className="h-12 w-12" />,
        title: "Stipend",
        description: "Monthly assistance of ₹4500 by Government and ₹500 by industry"
    },
    {
        icon: <PiggyBank className="h-12 w-12" />,
        title: "Grant",
        description: "One-time Grant of ₹6000 for incidentals"
    },
    {
        icon: <Search className="h-12 w-12" />,
        title: "Opportunity",
        description: "Select from Various Sectors and from top Companies of India"
    }
];

function LoggedInDashboard() {
  const router = useRouter();
  useEffect(() => {
      router.replace('/dashboard');
  }, [router]);
  return <div>Loading dashboard...</div>;
}


export default function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) {
      return <div>Loading...</div> // Or a proper skeleton loader
  }

  if (user) {
    return <LoggedInDashboard />
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <main className="flex-1">
        <section 
          className="w-full py-20 md:py-32 lg:py-40 bg-cover bg-center"
          style={{ backgroundImage: "url('https://picsum.photos/1600/900?blur=5&random=42')"}}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center bg-background/50 backdrop-blur-sm p-8 rounded-lg">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Prime Minister's Internship Scheme
                </h1>
                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                  A transformative opportunity for young graduates to gain invaluable hands-on experience and contribute to India's growth story.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" asChild>
                  <Link href="/register">Login to Apply</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Core Benefits of PM Internship Scheme</h2>
              <p className="mt-4 text-lg text-muted-foreground">Unlock your potential with these key advantages.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {coreBenefits.map((item, index) => (
                    <InfoCard key={index} icon={item.icon} title={item.title} description={item.description} />
                ))}
            </div>
          </div>
        </section>

        <section id="eligibility" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Eligibility Criteria</h2>
               <p className="mt-4 text-lg text-muted-foreground">Check if you are eligible to apply for the scheme.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {eligibilityCriteria.map((item, index) => (
                    <InfoCard key={index} icon={item.icon} title={item.title} description={item.description} />
                ))}
            </div>
          </div>
        </section>

         <section id="institutes" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Our Training Institutes</h2>
              <p className="mt-4 text-lg text-muted-foreground">Partnering with India's leading companies.</p>
            </div>
            <Carousel opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {companies.map(company => (
                  <CarouselItem key={company.id} className="md:basis-1/4 lg:basis-1/6">
                     <div className="p-1">
                        <div className="flex aspect-square items-center justify-center p-6 bg-muted/30 rounded-lg">
                           <Image src={company.logo} alt={company.name} width={100} height={100} className="object-contain" data-ai-hint={`${company.name}`} />
                        </div>
                     </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
           <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">About the Scheme</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                The PM Internship Scheme is a gateway for dynamic and forward-thinking individuals to engage with the work of the Government of India. It aims to provide a unique platform for young talent to contribute to policy-making, project implementation, and research, while gaining invaluable experience in the public sector.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
