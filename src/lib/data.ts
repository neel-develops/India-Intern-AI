
import type { Internship, StudentProfile, Company, Application, Notification } from './types';

export const companies: Company[] = [
    {
        id: '1',
        name: 'Bharat Electronics Limited',
        logo: 'https://logo.clearbit.com/bel-india.in',
        website: 'https://bel-india.in',
        description: 'A Navratna PSU and India’s foremost defence electronics company. BEL is a pioneer in the design, development, and manufacture of a wide range of strategic electronic products.'
    },
    {
        id: '2',
        name: 'Apollo Hospitals',
        logo: 'https://logo.clearbit.com/apollohospitals.com',
        website: 'https://apollohospitals.com',
        description: 'A leading integrated healthcare services provider in Asia. It has a robust presence across the healthcare ecosystem, including hospitals, pharmacies, primary care & diagnostic clinics.'
    },
    {
        id: '3',
        name: 'Larsen & Toubro',
        logo: 'https://logo.clearbit.com/larsentoubro.com',
        website: 'https://larsentoubro.com',
        description: 'A major Indian multinational engaged in EPC projects, hi-tech manufacturing and services. It operates in over 30 countries worldwide.'
    },
    {
        id: '4',
        name: 'National Payments Corporation of India',
        logo: 'https://logo.clearbit.com/npci.org.in',
        website: 'https://npci.org.in',
        description: 'An umbrella organization for operating retail payments and settlement systems in India. It is an initiative of RBI and IBA under the provisions of the Payment and Settlement Systems Act, 2007.'
    },
    {
        id: '5',
        name: 'ITC Limited',
        logo: 'https://logo.clearbit.com/itcportal.com',
        website: 'https://itcportal.com',
        description: 'An Indian conglomerate with diversified business in FMCG, hotels, software, packaging, paperboards, specialty papers and agri-business.'
    },
    {
        id: '6',
        name: 'Sun Pharmaceutical Industries',
        logo: 'https://logo.clearbit.com/sunpharma.com',
        website: 'https://sunpharma.com',
        description: 'An Indian multinational pharmaceutical company that manufactures and sells pharmaceutical formulations and active pharmaceutical ingredients (APIs) in more than 100 countries.'
    }
];

export const internships: Internship[] = [
  {
    id: '1',
    title: 'Embedded Systems Intern',
    company: 'Bharat Electronics Limited',
    description: 'Work on the design and development of embedded systems for defense applications. Gain experience with microcontrollers, FPGAs, and real-time operating systems.',
    longDescription: 'This internship offers a unique opportunity to contribute to national security by working on advanced embedded systems. You will be part of a team of experienced engineers, contributing to live projects and gaining invaluable hands-on experience in a high-tech environment.',
    responsibilities: ['Firmware development for microcontrollers', 'VHDL/Verilog programming for FPGAs', 'Testing and debugging of embedded hardware', 'Documentation of design and development processes'],
    qualifications: ['Pursuing a degree in Electronics and Communication, Electrical Engineering, or a related field', 'Strong programming skills in C/C++', 'Understanding of computer architecture and digital logic design', 'Familiarity with lab equipment like oscilloscopes and logic analyzers'],
    skills: ['C++', 'VHDL', 'Embedded Systems', 'RTOS'],
    domain: 'Engineering',
    location: 'Bangalore',
    image: 'https://picsum.photos/600/400?random=1',
  },
  {
    id: '2',
    title: 'Healthcare Management Intern',
    company: 'Apollo Hospitals',
    description: 'Assist in hospital administration, patient care coordination, and quality improvement projects. A great opportunity for those interested in healthcare operations.',
    longDescription: 'As a Healthcare Management Intern, you will get a 360-degree view of hospital operations. You will rotate through different departments, from patient services to financial planning, and contribute to projects aimed at improving efficiency and patient satisfaction.',
    responsibilities: ['Shadowing hospital administrators', 'Collecting and analyzing data on patient flow', 'Assisting in the development of patient education materials', 'Participating in quality audits'],
    qualifications: ['Pursuing a degree in Hospital Administration, Public Health, or Business Administration', 'Excellent communication and interpersonal skills', 'Strong analytical and problem-solving abilities', 'A passion for healthcare'],
    skills: ['Healthcare Management', 'Data Analysis', 'Communication'],
    domain: 'Healthcare',
    location: 'Chennai',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    id: '3',
    title: 'Civil Engineering Intern',
    company: 'Larsen & Toubro',
    description: 'Join our infrastructure projects and gain hands-on experience in project planning, site supervision, and quality control for large-scale construction projects.',
    longDescription: 'This is a field-based internship where you will be part of a team building the nation\'s infrastructure. You will learn the practical aspects of civil engineering, from reading blueprints to managing resources and ensuring safety compliance on a live construction site.',
    responsibilities: ['Assisting project managers with daily tasks', 'Monitoring construction activities to ensure they meet specifications', 'Conducting quality checks on materials', 'Preparing project progress reports'],
    qualifications: ['Pursuing a degree in Civil Engineering', 'Knowledge of AutoCAD and other civil engineering software', 'Strong understanding of construction materials and methodologies', 'Willingness to work on-site'],
    skills: ['AutoCAD', 'Project Management', 'Quality Control'],
    domain: 'Engineering',
    location: 'Mumbai',
    image: 'https://picsum.photos/600/400?random=3',
  },
  {
    id: '4',
    title: 'Fintech Product Intern',
    company: 'National Payments Corporation of India',
    description: 'Work on the next generation of digital payment solutions in India. You will be involved in product research, feature definition, and competitor analysis for products like UPI.',
    longDescription: 'Be a part of the digital payments revolution in India. This internship will give you a unique insight into the world of fintech. You will work with product managers to define and launch new features that will be used by millions of people.',
    responsibilities: ['Conducting market and competitor research', 'Writing product requirements documents (PRDs)', 'Collaborating with engineering and design teams', 'Analyzing user data to identify trends and opportunities'],
    qualifications: ['Pursuing a degree in Business, Computer Science, or a related field', 'Strong interest in technology and payments', 'Excellent analytical and communication skills', 'Ability to work in a fast-paced environment'],
    skills: ['Product Management', 'Data Analysis', 'Market Research', 'UPI'],
    domain: 'Finance',
    location: 'Mumbai',
    image: 'https://picsum.photos/600/400?random=4',
  },
  {
    id: '5',
    title: 'Agri-Business Intern',
    company: 'ITC Limited',
    description: 'Join ITC\'s Agri-Business division and work on projects related to crop sourcing, supply chain management, and rural marketing. An ideal role for agriculture or business students.',
    longDescription: 'This internship provides a deep dive into India\'s agricultural sector. You will work on ITC\'s e-Choupal initiative, interacting with farmers, and contributing to a more efficient and transparent agricultural supply chain. It is a unique blend of fieldwork and corporate strategy.',
    responsibilities: ['Assisting in the procurement of agricultural commodities', 'Analyzing supply chain data to identify inefficiencies', 'Conducting market research in rural areas', 'Supporting the development of farmer training programs'],
    qualifications: ['Pursuing a degree in Agriculture, Agribusiness Management, or a related field', 'Strong analytical skills and proficiency in Excel', 'Good communication skills and willingness to travel to rural areas', 'Understanding of Indian agriculture'],
    skills: ['Supply Chain', 'Market Research', 'Data Analysis'],
    domain: 'Agriculture',
    location: 'Hyderabad',
    image: 'https://picsum.photos/600/400?random=5',
  },
  {
    id: '6',
    title: 'Pharmaceutical Research Intern',
    company: 'Sun Pharmaceutical Industries',
    description: 'Work in our R&D labs on drug formulation and development. This is a hands-on role for pharmacy or chemistry students to gain industry experience.',
    longDescription: 'This internship is an excellent opportunity for aspiring scientists to get real-world experience in a leading pharmaceutical company. You will work under the guidance of senior researchers, assisting with experiments, data analysis, and documentation in a state-of-the-art laboratory.',
    responsibilities: ['Assisting with laboratory experiments', 'Preparing chemical solutions and reagents', 'Operating and maintaining lab equipment', 'Recording and analyzing experimental data'],
    qualifications: ['Pursuing a degree in Pharmacy, Chemistry, or a related field', 'Good laboratory skills and understanding of safety protocols', 'Attention to detail and good record-keeping abilities', 'Eagerness to learn about the drug development process'],
    skills: ['Laboratory Skills', 'Chemistry', 'Data Recording'],
    domain: 'Healthcare',
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
    },
    affirmativeAction: {
        socialCategory: 'General',
        isFromAspirationalDistrict: false,
        hasParticipatedBefore: false,
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
    },
    affirmativeAction: {
        socialCategory: 'OBC',
        isFromAspirationalDistrict: true,
        hasParticipatedBefore: false,
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
    },
    affirmativeAction: {
        socialCategory: 'SC',
        isFromAspirationalDistrict: false,
        hasParticipatedBefore: true,
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
    },
    affirmativeAction: {
        socialCategory: 'General',
        isFromAspirationalDistrict: false,
        hasParticipatedBefore: false,
    }
  },
];
