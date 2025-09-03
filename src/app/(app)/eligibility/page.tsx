import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const eligibilityCriteria = [
    { text: "Must not be currently employed full-time." },
    { text: "Must not be currently enrolled full-time in an educational institution." },
    { text: "Annual family income must be less than 8 Lakhs PA." },
    { text: "No member of the immediate family should hold a government job." },
    { text: "Must have at least 12 months of professional experience." },
    { text: "Must be between 21 and 24 years of age." },
];

export default function EligibilityPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
        <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Scheme Eligibility</h1>
            <p className="text-lg text-muted-foreground">
                Understand the requirements to be eligible for the internship program.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
                <CardDescription>
                    To be considered for the internships listed on this platform, you must meet all of the following criteria. Please ensure your profile reflects this information accurately.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ul className="space-y-3">
                    {eligibilityCriteria.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <span className="text-foreground">{item.text}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}
