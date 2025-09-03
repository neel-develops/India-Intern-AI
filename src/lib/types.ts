export interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  domain: string;
  location: string;
  image: string;
}

export interface StudentProfile {
  personalInfo: {
    name: string;
    age: number;
    email: string;
    location: string;
  };
  skills: string[];
  preferences: {
    domain: string;
    internshipType: string;
  };
  resumeSummary: string;
  resumeFilename?: string;
  eligibility: {
    isNotEmployedFullTime: boolean;
    isNotEnrolledFullTime: boolean;
    familyIncome: number;
    hasNoGovtJobFamily: boolean;
    experienceMonths: number;
  };
}
