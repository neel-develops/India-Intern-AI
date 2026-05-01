
export interface Skill {
  name: string;
  proficiency: number;
  certificate?: string;
}

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
  stipend?: number;
  duration?: string;
  recruiterId?: string | null;
  createdAt?: any;
}

export interface StudentProfile {
  personalInfo: {
    name: string;
    age: number;
    email: string;
    location: string;
    linkedin?: string;
    university?: string;
    degree?: string;
    stream?: string;
    graduatingYear?: number;
  };
  skills: Skill[];
  preferences: {
    domain: string;
    internshipType: string;
    otherDomain?: string;
  };
  resumeSummary: string;
  resumeFilename?: string;
  certificates?: { name: string }[];
  eligibility?: {
    isNotEmployedFullTime?: boolean;
    isNotEnrolledFullTime?: boolean;
    familyIncome?: number;
    hasNoGovtJobFamily?: boolean;
    experienceMonths?: number;
    match?: boolean;
    reasons?: string[];
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
    studentName?: string;
    internshipTitle?: string;
    companyName?: string;
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

export interface IndustryProfile {
    uid?: string;
    name?: string;
    email?: string;
    companyName?: string;
    position?: string;
    website?: string;
    description?: string;
    createdAt?: string;
}

export interface UserDocument {
  userType?: 'student' | 'industry' | null;
  studentProfile?: StudentProfile | null;
  industryProfile?: IndustryProfile | null;
  savedInternships?: string[];
  updatedAt?: any;
}
