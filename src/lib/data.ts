import type { Internship, StudentProfile } from './types';

export const internships: Internship[] = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'Innovate Inc.',
    description: 'Work on our next-generation web platform using React and TypeScript. You will be part of a dynamic team building beautiful and performant user interfaces.',
    skills: ['React', 'TypeScript', 'CSS', 'HTML'],
    domain: 'Web Development',
    location: 'Remote',
    image: 'https://picsum.photos/600/400?random=1',
  },
  {
    id: '2',
    title: 'Data Science Intern',
    company: 'DataDriven Co.',
    description: 'Analyze large datasets to extract meaningful insights. You will use Python, Pandas, and Scikit-learn to build predictive models.',
    skills: ['Python', 'Pandas', 'Machine Learning'],
    domain: 'Data Science',
    location: 'Mumbai',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    id: '3',
    title: 'UX/UI Design Intern',
    company: 'Creative Solutions',
    description: 'Join our design team to create intuitive and engaging user experiences for our mobile and web applications. Proficiency in Figma is a must.',
    skills: ['Figma', 'UX Research', 'Prototyping'],
    domain: 'Design',
    location: 'Bangalore',
    image: 'https://picsum.photos/600/400?random=3',
  },
  {
    id: '4',
    title: 'Backend Developer Intern (Node.js)',
    company: 'ScaleFast',
    description: 'Help build and maintain our scalable microservices architecture using Node.js, Express, and Docker. Experience with cloud platforms is a plus.',
    skills: ['Node.js', 'Express', 'Docker', 'AWS'],
    domain: 'Web Development',
    location: 'Remote',
    image: 'https://picsum.photos/600/400?random=4',
  },
  {
    id: '5',
    title: 'Digital Marketing Intern',
    company: 'GrowthHackers',
    description: 'Assist in planning and executing our digital marketing campaigns across various channels including social media, email, and SEO.',
    skills: ['SEO', 'Social Media Marketing', 'Content Creation'],
    domain: 'Marketing',
    location: 'Delhi',
    image: 'https://picsum.photos/600/400?random=5',
  },
  {
    id: '6',
    title: 'Mobile App Dev Intern (Flutter)',
    company: 'Appify',
    description: 'Develop cross-platform mobile applications using Flutter. You will be involved in the entire app development lifecycle from concept to deployment.',
    skills: ['Flutter', 'Dart', 'Firebase'],
    domain: 'Mobile Development',
    location: 'Pune',
    image: 'https://picsum.photos/600/400?random=6',
  },
];

export const studentProfiles: StudentProfile[] = [
  {
    personalInfo: {
      name: 'Priya Sharma',
      age: 22,
      email: 'priya.sharma@example.com',
      location: 'Mumbai',
    },
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'Pandas'],
    preferences: {
      domain: 'Data Science',
      internshipType: 'Full-time',
    },
    resumeSummary: 'A highly motivated data science enthusiast with experience in building machine learning models for classification and regression tasks. Eager to apply my skills to solve real-world problems.',
    eligibility: {
      isNotEmployedFullTime: true,
      isNotEnrolledFullTime: true,
      familyIncome: 600000,
      hasNoGovtJobFamily: true,
      experienceMonths: 12,
    }
  },
  {
    personalInfo: {
      name: 'Rohan Verma',
      age: 21,
      email: 'rohan.verma@example.com',
      location: 'Remote',
    },
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    preferences: {
      domain: 'Web Development',
      internshipType: 'Remote',
    },
    resumeSummary: 'A passionate full-stack developer with a strong foundation in the MERN stack. I enjoy building responsive and user-friendly web applications.',
    eligibility: {
      isNotEmployedFullTime: true,
      isNotEnrolledFullTime: true,
      familyIncome: 750000,
      hasNoGovtJobFamily: true,
      experienceMonths: 14,
    }
  },
  {
    personalInfo: {
      name: 'Anika Singh',
      age: 23,
      email: 'anika.singh@example.com',
      location: 'Bangalore',
    },
    skills: ['Figma', 'UI Design', 'UX Research', 'Adobe XD'],
    preferences: {
      domain: 'Design',
      internshipType: 'Full-time',
    },
    resumeSummary: 'A creative UX/UI designer with a keen eye for detail and a user-centered approach. Skilled in creating wireframes, prototypes, and high-fidelity mockups.',
    eligibility: {
      isNotEmployedFullTime: true,
      isNotEnrolledFullTime: true,
      familyIncome: 500000,
      hasNoGovtJobFamily: true,
      experienceMonths: 18,
    }
  },
  {
    personalInfo: {
        name: 'Arjun Reddy',
        age: 24,
        email: 'arjun.reddy@example.com',
        location: 'Pune',
    },
    skills: ['Flutter', 'Dart', 'Firebase', 'GetX'],
    preferences: {
        domain: 'Mobile Development',
        internshipType: 'Full-time',
    },
    resumeSummary: 'A skilled Flutter developer with experience in building and publishing mobile apps on both Android and iOS. Proficient in state management and integrating REST APIs.',
    eligibility: {
      isNotEmployedFullTime: true,
      isNotEnrolledFullTime: true,
      familyIncome: 700000,
      hasNoGovtJobFamily: true,
      experienceMonths: 24,
    }
  },
];
