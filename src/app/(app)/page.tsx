'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Award, Briefcase, Building, CheckCircle, Search, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

const stats = [
  { title: "Training Programs", value: "1,200+", icon: <Briefcase className="w-8 h-8 text-primary" /> },
  { title: "Training Partners", value: "350+", icon: <Building className="w-8 h-8 text-primary" /> },
  { title: "Candidates Trained", value: "150,000+", icon: <Users className="w-8 h-8 text-primary" /> },
  { title: "Placed Candidates", value: "95,000+", icon: <Award className="w-8 h-8 text-primary" /> },
];

const features = [
    { title: "Free of Cost Training", description: "Quality training programs at no cost to the candidate." },
    { title: "Reputed Training Institutes", description: "Partnered with top institutes for best-in-class training." },
    { title: "Stipend for Attendance", description: "Financial support for candidates during their training period." },
    { title: "Placement Assistance", description: "Dedicated support to help you find a job after training." },
];

const eligibility = [
    "Unemployed youth",
    "School/college dropouts",
    "Specific target groups as per scheme",
    "Age group 18-45 years",
]

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
    <Card className="text-center p-6">
        <div className="flex justify-center mb-4">{icon}</div>
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
    </Card>
);

export default function DashboardPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-primary/10 rounded-lg p-8 md:p-12 min-h-[400px] flex items-center">
        <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                        PM-DAKSH Portal
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Empowering youth with skills for a brighter future. Find training programs and get certified.
                    </p>
                    <div className="flex w-full max-w-lg items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
                        <Input type="text" placeholder="Search for a training program..." className="border-0 focus-visible:ring-0" />
                        <Button type="submit">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>
                </div>
                <div className="relative h-64 w-full md:h-80">
                     <Image src="https://picsum.photos/600/400" layout="fill" objectFit="cover" className="rounded-lg" alt="Skilling India" data-ai-hint="students learning" />
                </div>
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="text-center p-6">
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-muted-foreground">{stat.title}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* About PM-DAKSH */}
      <section className="container mx-auto">
         <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">About PM-DAKSH</h2>
            <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">The PM-DAKSH (Pradhan Mantri Dakshta Aur Kushalta Sampann Hitgrahi) Yojana is a National Action Plan for skilling of marginalized persons.</p>
        </div>
        <Card className="p-8 bg-muted/30">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                    <Image src="https://picsum.photos/600/400?random=11" layout="fill" objectFit="cover" alt="PM-DAKSH" data-ai-hint="government building" />
                </div>
                <div className="space-y-4">
                    <p className="text-lg">The scheme aims to enhance the competency/skill levels of the target groups to make them employable both in self-employment and wage-employment for their socio-economic development. The age criterion of the scheme is between 18-45 years and the income criterion is that there is no income limit for SCs, Safai Karamcharis, Waste Pickers and Transgender Persons. For OBCs, the income criteria is annual family income should be below Rs. 3 lakh.</p>
                    <Button asChild>
                        <Link href="/about">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            </div>
        </Card>
      </section>

      {/* Key Features Section */}
      <section className="container mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Key Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
                <FeatureCard 
                    key={index}
                    icon={<Award className="w-12 h-12 text-secondary" />}
                    title={feature.title}
                    description={feature.description}
                />
            ))}
        </div>
      </section>
      
      {/* Eligibility Section */}
      <section className="container mx-auto">
         <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Eligibility Criteria</h2>
        </div>
        <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <ul className="space-y-4">
                    {eligibility.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                            <span className="text-lg">{item}</span>
                        </li>
                    ))}
                </ul>
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                     <Image src="https://picsum.photos/600/400?random=12" layout="fill" objectFit="cover" alt="Eligible candidates" data-ai-hint="happy students" />
                </div>
            </div>
        </Card>
      </section>
    </div>
  );
}
