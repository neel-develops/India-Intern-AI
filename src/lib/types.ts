
export interface Internship {
  id: string;
  title: string;
  company: string;
  description: string;
  longDescription: string;
  responsibilities: string[];
  qualifications: string[];
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
    linkedin?: string;
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

export interface Company {
    id: string;
    name: string;
    logo: string;
    website: string;
    description: string;
}

export interface Application {
    id: string;
    internshipId: string;
    studentEmail: string;
    status: 'Applied' | 'In Review' | 'Interview' | 'Offered' | 'Rejected';
    appliedDate: string;
}

export interface Notification {
    id: string;
    message: string;
    date: string;
    read: boolean;
    link?: string;
}
