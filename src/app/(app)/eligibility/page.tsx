import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeHelp, Briefcase, CalendarDays, GraduationCap, IndianRupee, Landmark, Users, Wand, Award, BriefcaseBusiness, PiggyBank, Search } from "lucide-react";
import { ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: string | ReactNode;
  className?: string;
}

const InfoCard = ({ icon, title, description, className }: InfoCardProps) => (
  <Card className={`text-center flex flex-col items-center justify-center p-6 ${className}`}>
    <div className="mb-4 text-primary">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <div className="text-muted-foreground">{description}</div>
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
            <ul className="text-left list-disc list-inside">
                <li>No one is Earning more than ₹8 Lakhs PA</li>
                <li>No Member has a Govt. Job</li>
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


export default function EligibilityPage() {
  return (
    <div className="container mx-auto max-w-6xl py-8 space-y-12">
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Are you Eligible?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {eligibilityCriteria.map((item, index) => (
                    <InfoCard key={index} icon={item.icon} title={item.title} description={item.description} />
                ))}
            </div>
        </div>

        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Core Benefits for PM Internship Scheme</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {coreBenefits.map((item, index) => (
                    <InfoCard key={index} icon={item.icon} title={item.title} description={item.description} />
                ))}
            </div>
        </div>
    </div>
  );
}
