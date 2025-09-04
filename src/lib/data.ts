
import type { Internship, StudentProfile, Company, Application, Notification } from './types';

export const companies: Company[] = [
    {
        id: '1',
        name: 'Innovate Inc.',
        logo: 'https://logo.clearbit.com/innovateinc.com',
        website: 'https://innovateinc.com',
        description: 'Innovate Inc. is a leading tech company focused on creating cutting-edge solutions for the modern world. We value creativity, collaboration, and a passion for technology.'
    },
    {
        id: '2',
        name: 'DataDriven Co.',
        logo: 'https://logo.clearbit.com/datadriven.co',
        website: 'https://datadriven.co',
        description: 'DataDriven Co. harnesses the power of data to drive business success. Our team of experts works on challenging problems in machine learning and artificial intelligence.'
    },
    {
        id: '3',
        name: 'Creative Solutions',
        logo: 'https://logo.clearbit.com/creativesolutions.com',
        website: 'https://creativesolutions.com',
        description: 'Creative Solutions is a design-first company dedicated to building beautiful and intuitive user experiences. We believe that great design can change the world.'
    },
    {
        id: '4',
        name: 'ScaleFast',
        logo: 'https://logo.clearbit.com/scalefast.com',
        website: 'https://scalefast.com',
        description: 'ScaleFast provides robust and scalable backend solutions for high-growth startups. We specialize in cloud computing and microservices architecture.'
    },
    {
        id: '5',
        name: 'GrowthHackers',
        logo: 'https://logo.clearbit.com/growthhackers.com',
        website: 'https://growthhackers.com',
        description: 'GrowthHackers is a digital marketing agency that helps businesses acquire and retain customers through innovative strategies and data-driven campaigns.'
    },
    {
        id: '6',
        name: 'Appify',
        logo: 'https://logo.clearbit.com/appify.com',
        website: 'https://appify.com',
        description: 'Appify is a mobile development studio that builds high-quality apps for iOS and Android. We are experts in native and cross-platform development.'
    }
];

export const internships: Internship[] = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'Innovate Inc.',
    description: 'Work on our next-generation web platform using React and TypeScript. You will be part of a dynamic team building beautiful and performant user interfaces.',
    longDescription: 'This is a unique opportunity to work on a cutting-edge web platform. You will be contributing to a major product, working alongside senior developers and designers. You will gain hands-on experience with the latest frontend technologies and agile development methodologies.',
    responsibilities: ['Develop new user-facing features', 'Build reusable code and libraries for future use', 'Ensure the technical feasibility of UI/UX designs', 'Optimize application for maximum speed and scalability'],
    qualifications: ['Enrolled in a Computer Science program or related field', 'Strong understanding of JavaScript, HTML, and CSS', 'Familiarity with React is a plus', 'Eagerness to learn and grow'],
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
    longDescription: 'As a Data Science Intern at DataDriven Co., you will be at the heart of our data operations. You will clean, process, and analyze data to inform business decisions and build machine learning models that will be deployed to production.',
    responsibilities: ['Data wrangling and preprocessing', 'Exploratory data analysis', 'Building and evaluating machine learning models', 'Communicating findings to stakeholders'],
    qualifications: ['Experience with Python and its data science libraries (Pandas, NumPy, Scikit-learn)', 'Solid understanding of statistical concepts', 'Strong problem-solving skills'],
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
    longDescription: 'This internship is for aspiring designers who want to make a real impact. You will be involved in the entire design process, from user research and wireframing to creating high-fidelity prototypes and user testing.',
    responsibilities: ['Conduct user research and evaluate user feedback', 'Create user flows, wireframes, and prototypes', 'Collaborate with product managers and engineers', 'Maintain and contribute to our design system'],
    qualifications: ['A portfolio showcasing your design work', 'Proficiency in Figma or other design tools', 'Understanding of user-centered design principles'],
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
    longDescription: 'Join our backend team and work on the engine that powers our platform. You will learn about building scalable, resilient, and secure microservices. This is a hands-on role with a lot of opportunities for learning.',
    responsibilities: ['Design and implement RESTful APIs', 'Write clean, maintainable, and efficient code', 'Work with databases and caching layers', 'Deploy and monitor services in the cloud'],
    qualifications: ['Experience with Node.js and Express', 'Understanding of RESTful API design', 'Familiarity with databases (SQL or NoSQL)', 'Knowledge of Git and version control'],
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
    longDescription: 'Get hands-on experience in the fast-paced world of digital marketing. You will learn about SEO, content marketing, social media strategy, and campaign analysis. This is a great opportunity to start your marketing career.',
    responsibilities: ['Create content for social media and blogs', 'Assist with SEO keyword research and optimization', 'Help manage email marketing campaigns', 'Track and analyze campaign performance'],
    qualifications: ['Strong written and verbal communication skills', 'Familiarity with social media platforms', 'A creative and analytical mindset'],
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
    longDescription: 'Join a team of talented mobile developers and build beautiful and performant apps with Flutter. You will learn best practices for mobile development, state management, and working with native device features.',
    responsibilities: ['Develop and maintain Flutter applications', 'Write clean and readable code', 'Collaborate with the design team to implement UI', 'Fix bugs and improve application performance'],
    qualifications: ['Experience with Flutter and Dart', 'Understanding of mobile development concepts', 'A portfolio of personal projects is a plus'],
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
