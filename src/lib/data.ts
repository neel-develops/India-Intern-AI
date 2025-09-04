
import type { Internship, StudentProfile, Company, Application, Notification } from './types';

export const companies: Company[] = [
    {
        id: '1',
        name: 'RELIANCE INDUSTRIES LIMITED',
        logo: 'https://logo.clearbit.com/ril.com',
        website: 'https://www.ril.com',
        description: 'An Indian multinational conglomerate company, headquartered in Mumbai, India. Its diverse businesses include energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.'
    },
    {
        id: '2',
        name: 'TATA CONSULTANCY SERVICES LIMITED',
        logo: 'https://logo.clearbit.com/tcs.com',
        website: 'https://www.tcs.com',
        description: 'An Indian multinational information technology services and consulting company headquartered in Mumbai. It is a part of the Tata Group and operates in 150 locations across 46 countries.'
    },
    {
        id: '3',
        name: 'HDFC BANK LIMITED',
        logo: 'https://logo.clearbit.com/hdfcbank.com',
        website: 'https://www.hdfcbank.com',
        description: 'An Indian banking and financial services company headquartered in Mumbai. It is India\'s largest private sector bank by assets and by market capitalisation as of April 2021.'
    },
    {
        id: '4',
        name: 'OIL AND NATURAL GAS CORPORATION LIMITED',
        logo: 'https://logo.clearbit.com/ongcindia.com',
        website: 'https://www.ongcindia.com',
        description: 'An Indian public sector multinational crude oil and gas company. Its registered office is in New Delhi. It is under the ownership of Ministry of Petroleum and Natural Gas, Government of India.'
    },

    {
        id: '5',
        name: 'INFOSYS LIMITED',
        logo: 'https://logo.clearbit.com/infosys.com',
        website: 'https://www.infosys.com',
        description: 'An Indian multinational information technology company that provides business consulting, information technology and outsourcing services.'
    },
    {
        id: '6',
        name: 'NTPC LIMITED',
        logo: 'https://logo.clearbit.com/ntpc.co.in',
        website: 'https://www.ntpc.co.in',
        description: 'An Indian public sector undertaking, engaged in the business of generation of electricity and allied activities. It is a company incorporated under the Companies Act 1956 and is under the ownership of Ministry of Power, Government of India.'
    },
    {
        id: '7',
        name: 'TATA STEEL LIMITED',
        logo: 'https://logo.clearbit.com/tatasteel.com',
        website: 'https://www.tatasteel.com',
        description: 'An Indian multinational steel-making company, based in Jamshedpur, Jharkhand and headquartered in Mumbai, Maharashtra. It is a part of the Tata Group.'
    },
    {
        id: '8',
        name: 'ITC LIMITED',
        logo: 'https://logo.clearbit.com/itcportal.com',
        website: 'https://www.itcportal.com',
        description: 'An Indian conglomerate with diversified business in FMCG, hotels, software, packaging, paperboards, specialty papers and agri-business.'
    },
    {
        id: '9',
        name: 'INDIAN OIL CORPORATION LIMITED',
        logo: 'https://logo.clearbit.com/iocl.com',
        website: 'https://www.iocl.com',
        description: 'An Indian public sector oil and gas company headquartered in New Delhi. It is the largest commercial oil company in the country, with a net profit of ₹41,653 crore for the financial year 2020-21.'
    },
    {
        id: '10',
        name: 'ICICI BANK LIMITED',
        logo: 'https://logo.clearbit.com/icicibank.com',
        website: 'https://www.icicibank.com',
        description: 'An Indian multinational banking and financial services company with its registered office in Vadodara, Gujarat and corporate office in Mumbai, Maharashtra.'
    },
    {
        id: '11',
        name: 'POWER GRID CORPORATION OF INDIA LIMITED',
        logo: 'https://logo.clearbit.com/powergrid.in',
        website: 'https://www.powergrid.in',
        description: 'An Indian public sector undertaking engaged in transmission of bulk power across different states of India. It is headquartered in Gurugram.'
    },
    {
        id: '12',
        name: 'TATA SONS PRIVATE LIMITED',
        logo: 'https://logo.clearbit.com/tata.com',
        website: 'https://www.tata.com',
        description: 'The holding company of the Tata Group and holds the bulk of shareholding in these companies. It is a private limited company and is based in Mumbai.'
    },
    {
        id: '13',
        name: 'WIPRO LIMITED',
        logo: 'https://logo.clearbit.com/wipro.com',
        website: 'https://www.wipro.com',
        description: 'An Indian multinational corporation that provides information technology, consulting and business process services.'
    },
    {
        id: '14',
        name: 'HCL TECHNOLOGIES LIMITED',
        logo: 'https://logo.clearbit.com/hcltech.com',
        website: 'https://www.hcltech.com',
        description: 'An Indian multinational information technology services and consulting company, headquartered in Noida, Uttar Pradesh, India.'
    },
    {
        id: '15',
        name: 'HINDUSTAN ZINC LIMITED',
        logo: 'https://logo.clearbit.com/hzlindia.com',
        website: 'https://www.hzlindia.com',
        description: 'An Indian integrated mining and resources producer of zinc, lead, silver and cadmium.'
    },
    {
        id: '16',
        name: 'RELIANCE JIO INFOCOMM LIMITED',
        logo: 'https://logo.clearbit.com/jio.com',
        website: 'https://www.jio.com',
        description: 'An Indian telecommunications company and a subsidiary of Jio Platforms, headquartered in Mumbai, Maharashtra, India.'
    },
    {
        id: '17',
        name: 'MAHANADI COALFIELDS LIMITED',
        logo: 'https://logo.clearbit.com/mahanadicoal.in',
        website: 'https://www.mahanadicoal.in',
        description: 'One of the major coal producing companies of India. It is one of the eight subsidiaries of Coal India Limited.'
    },
    {
        id: '18',
        name: 'NMDC LIMITED',
        logo: 'https://logo.clearbit.com/nmdc.co.in',
        website: 'https://www.nmdc.co.in',
        description: 'An Indian public sector undertaking, it is under the ownership of Ministry of Steel, Government of India.'
    },
    {
        id: '19',
        name: 'HINDUSTAN UNILEVER LIMITED',
        logo: 'https://logo.clearbit.com/hul.co.in',
        website: 'https://www.hul.co.in',
        description: 'A British-Dutch manufacturing company headquartered in Mumbai, India. Its products include foods, beverages, cleaning agents, personal care products, water purifiers and consumer goods.'
    },
    {
        id: '20',
        name: 'REC LIMITED',
        logo: 'https://logo.clearbit.com/recindia.nic.in',
        website: 'https://www.recindia.nic.in',
        description: 'A Navratna company under the Ministry of Power, provides financial assistance to state electricity boards, state governments, central/state power utilities, independent power producers, rural electric cooperatives and private sector utilities.'
    },
    {
        id: '21',
        name: 'JSW STEEL LIMITED',
        logo: 'https://logo.clearbit.com/jsw.in',
        website: 'https://www.jsw.in/steel',
        description: 'An Indian multinational steel making company, based in Mumbai, Maharashtra. It is a subsidiary of JSW Group.'
    },
    {
        id: '22',
        name: 'GAIL (INDIA) LIMITED',
        logo: 'https://logo.clearbit.com/gailonline.com',
        website: 'https://www.gailonline.com',
        description: 'The largest state-owned natural gas processing and distribution company in India. It is under the ownership of Ministry of Petroleum and Natural Gas, Government of India.'
    },
    {
        id: '23',
        name: 'COGNIZANT TECHNOLOGY SOLUTIONS INDIA PRIVATE LIMITED',
        logo: 'https://logo.clearbit.com/cognizant.com',
        website: 'https://www.cognizant.com',
        description: 'An American multinational technology company that provides business consulting, information technology and outsourcing services.'
    },
    {
        id: '24',
        name: 'LARSEN AND TOUBRO LIMITED',
        logo: 'https://logo.clearbit.com/larsentoubro.com',
        website: 'https://www.larsentoubro.com',
        description: 'A major Indian multinational engaged in EPC projects, hi-tech manufacturing and services. It operates in over 30 countries worldwide.'
    },
    {
        id: '25',
        name: 'AXIS BANK LIMITED',
        logo: 'https://logo.clearbit.com/axisbank.com',
        website: 'https://www.axisbank.com',
        description: 'An Indian banking and financial services company headquartered in Mumbai, Maharashtra. It sells financial services to large and mid-size companies, SMEs and retail businesses.'
    },
    {
        id: '26',
        name: 'NORTHERN COALFIELDS LIMITED',
        logo: 'https://logo.clearbit.com/nclcil.in',
        website: 'https://www.nclcil.in',
        description: 'A subsidiary of Coal India Limited, which is a government of India undertaking. It is headquartered in Singrauli, Madhya Pradesh.'
    },
    {
        id: '27',
        name: 'OIL INDIA LIMITED',
        logo: 'https://logo.clearbit.com/oil-india.com',
        website: 'https://www.oil-india.com',
        description: 'The second largest hydrocarbon exploration and production Indian public sector company. It is under the ownership of Ministry of Petroleum and Natural Gas, Government of India.'
    },
    {
        id: '28',
        name: 'HINDUSTAN PETROLEUM CORPORATION LIMITED',
        logo: 'https://logo.clearbit.com/hindustanpetroleum.com',
        website: 'https://www.hindustanpetroleum.com',
        description: 'An Indian public sector oil and gas company. It is a subsidiary of ONGC with its headquarters in Mumbai, Maharashtra. It has a 25% market-share in India among public-sector companies.'
    },
    {
        id: '29',
        name: 'JINDAL STEEL & POWER LIMITED',
        logo: 'https://logo.clearbit.com/jindalsteelpower.com',
        website: 'https://www.jindalsteelpower.com',
        description: 'An Indian steel and energy company based in New Delhi. With turnover of approx. ₹40000 crore, JSPL is a part of about ₹130000 crore diversified O.P. Jindal Group conglomerate.'
    },
    {
        id: '30',
        name: 'RELIANCE RETAIL LIMITED',
        logo: 'https://logo.clearbit.com/relianceretail.com',
        website: 'https://www.relianceretail.com',
        description: 'An Indian retail company and a subsidiary of Reliance Industries Limited. Founded in 2006, it is the largest retailer in India in terms of revenue.'
    },
    {
        id: '31',
        name: 'NUCLEAR POWER CORPORATION OF INDIA LIMITED',
        logo: 'https://logo.clearbit.com/npcil.nic.in',
        website: 'https://www.npcil.nic.in',
        description: 'An Indian public sector undertaking based in Mumbai, Maharashtra. It is wholly owned by the Government of India and is responsible for the generation of nuclear power for electricity.'
    },
    {
        id: '32',
        name: 'TECH MAHINDRA LIMITED',
        logo: 'https://logo.clearbit.com/techmahindra.com',
        website: 'https://www.techmahindra.com',
        description: 'An Indian multinational information technology services and consulting company. A part of the Mahindra Group, the company is headquartered in Pune and has its registered office in Mumbai.'
    },
    {
        id: '33',
        name: 'POWER FINANCE CORPORATION LIMITED',
        logo: 'https://logo.clearbit.com/pfcindia.com',
        website: 'https://www.pfcindia.com',
        description: 'An Indian financial institution under the ownership of Ministry of Power, Government of India. Established in 1986, it is the financial back bone of Indian Power Sector.'
    },
    {
        id: '34',
        name: 'ULTRATECH CEMENT LIMITED',
        logo: 'https://logo.clearbit.com/ultratechcement.com',
        website: 'https://www.ultratechcement.com',
        description: 'An Indian cement company based in Mumbai. It is a part of the Aditya Birla Group. UltraTech is the largest manufacturer of grey cement, ready mix concrete and white cement in India.'
    },
    {
        id: '35',
        name: 'INDUSIND BANK LTD.',
        logo: 'https://logo.clearbit.com/indusind.com',
        website: 'https://www.indusind.com',
        description: 'A new-generation Indian bank headquartered in Pune. The bank offers commercial, transactional and electronic banking products and services.'
    },
    {
        id: '36',
        name: 'NHPC LIMITED',
        logo: 'https://logo.clearbit.com/nhpcindia.com',
        website: 'https://www.nhpcindia.com',
        description: 'An Indian government hydropower board under the ownership of Ministry of Power, Government of India that was incorporated in the year 1975 with an authorised capital of ₹2000 million.'
    },
    {
        id: '37',
        name: 'STEEL AUTHORITY OF INDIA LIMITED',
        logo: 'https://logo.clearbit.com/sail.co.in',
        website: 'https://www.sail.co.in',
        description: 'An Indian government-owned steel manufacturing enterprise based in New Delhi, India. It is under the ownership of Ministry of Steel, Government of India.'
    },
    {
        id: '38',
        name: 'MARUTI SUZUKI INDIA LIMITED',
        logo: 'https://logo.clearbit.com/marutisuzuki.com',
        website: 'https://www.marutisuzuki.com',
        description: 'A subsidiary of the Japanese automotive manufacturer Suzuki. It is the largest car manufacturer in India, with a market share of over 43%.'
    },
    {
        id: '39',
        name: 'VEDANTA LIMITED',
        logo: 'https://logo.clearbit.com/vedantalimited.com',
        website: 'https://www.vedantalimited.com',
        description: 'An Indian multinational mining company headquartered in Mumbai, India, with their main operations in iron ore, gold and aluminium mines in Goa, Karnataka, Rajasthan and Odisha.'
    },
    {
        id: '40',
        name: 'BHARAT PETROLEUM CORPORATION LIMITED',
        logo: 'https://logo.clearbit.com/bharatpetroleum.in',
        website: 'https://www.bharatpetroleum.in',
        description: 'An Indian government-owned oil and gas corporation. It is under the ownership of Ministry of Petroleum and Natural Gas, Government of India, headquartered in Mumbai, Maharashtra.'
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
    company: 'APOLLO HOSPITALS ENTERPRISE LIMITED',
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
    company: 'LARSEN AND TOUBRO LIMITED',
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
    company: 'NATIONAL PAYMENTS CORPORATION OF INDIA',
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
    company: 'ITC LIMITED',
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
    company: 'SUN PHARMACEUTICAL INDUSTRIES LIMITED',
    description: 'Work in our R&D labs on drug formulation and development. This is a hands-on role for pharmacy or chemistry students to gain industry experience.',
    longDescription: 'This internship is an excellent opportunity for aspiring scientists to get real-world experience in a leading pharmaceutical company. You will work under the guidance of senior researchers, assisting with experiments, data analysis, and documentation in a state-of-the-art laboratory.',
    responsibilities: ['Assisting with laboratory experiments', 'Preparing chemical solutions and reagents', 'Operating and maintaining lab equipment', 'Recording and analyzing experimental data'],
    qualifications: ['Pursuing a degree in Pharmacy, Chemistry, or a related field', 'Good laboratory skills and understanding of safety protocols', 'Attention to detail and good record-keeping abilities', 'Eagerness to learn about the drug development process'],
    skills: ['Laboratory Skills', 'Chemistry', 'Data Recording'],
    domain: 'Healthcare',
    location: 'Pune',
    image: 'https://picsum.photos/600/400?random=6',
  },
  {
    id: '7',
    title: 'Frontend Developer Intern',
    company: 'NATIONAL PAYMENTS CORPORATION OF INDIA',
    description: 'Help build and maintain user interfaces for our flagship payment products. You will work with React, TypeScript, and modern CSS frameworks to create accessible and performant UIs.',
    longDescription: 'As a Frontend Developer Intern, you will be a key member of our product team, translating designs into high-quality code. This role offers a chance to work on applications used by millions, focusing on UI/UX, performance, and accessibility.',
    responsibilities: ['Developing new user-facing features using React.js', 'Building reusable components and front-end libraries for future use', 'Translating designs and wireframes into high-quality code', 'Optimizing components for maximum performance across a vast array of web-capable devices and browsers'],
    qualifications: ['Pursuing a degree in Computer Science or related field', 'Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model', 'Thorough understanding of React.js and its core principles', 'Familiarity with modern front-end build pipelines and tools'],
    skills: ['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
    domain: 'Web Development',
    location: 'Bangalore',
    image: 'https://picsum.photos/600/400?random=7',
  },
  {
    id: '8',
    title: 'Data Science Intern',
    company: 'APOLLO HOSPITALS ENTERPRISE LIMITED',
    description: 'Apply your data science skills to real healthcare challenges. Work with large datasets to build predictive models and generate insights to improve patient outcomes.',
    longDescription: 'This internship will place you at the intersection of data science and healthcare. You will work with a team of clinicians and data scientists to analyze clinical data, build machine learning models, and contribute to research that can have a real impact on patient care.',
    responsibilities: ['Data cleaning and preprocessing of clinical datasets', 'Building and evaluating machine learning models', 'Visualizing data and communicating findings to stakeholders', 'Collaborating with clinical staff to understand data context'],
    qualifications: ['Pursuing a degree in Computer Science, Statistics, or a related quantitative field', 'Strong programming skills in Python and experience with libraries like Pandas, NumPy, and Scikit-learn', 'Understanding of machine learning algorithms', 'Experience with data visualization tools like Matplotlib or Seaborn'],
    skills: ['Python', 'Machine Learning', 'Pandas', 'Data Visualization'],
    domain: 'Data Science',
    location: 'Hyderabad',
    image: 'https://picsum.photos/600/400?random=8',
  },
  {
    id: '9',
    title: 'UI/UX Design Intern',
    company: 'ITC LIMITED',
    description: 'Join our digital marketing team and help design engaging and intuitive user experiences for our consumer-facing web and mobile applications.',
    longDescription: 'As a UI/UX Design Intern, you will be involved in the entire product development lifecycle, from user research and wireframing to creating high-fidelity mockups and interactive prototypes. This is a great opportunity to build your portfolio with work on major consumer brands.',
    responsibilities: ['Conducting user research and evaluating user feedback', 'Creating user flows, wireframes, prototypes, and mockups', 'Collaborating with product managers and engineers to implement designs', 'Maintaining and evolving our design system'],
    qualifications: ['Pursuing a degree in Design, Human-Computer Interaction, or a related field', 'A portfolio of design projects', 'Proficiency in design tools such as Figma, Sketch, or Adobe XD', 'Understanding of user-centered design principles'],
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
    domain: 'Design',
    location: 'Kolkata',
    image: 'https://picsum.photos/600/400?random=9',
  },
  {
    id: '10',
    title: 'Mobile App Development Intern',
    company: 'Bharat Electronics Limited',
    description: 'Develop and enhance secure mobile applications for internal and client use. Work with native or cross-platform frameworks to build robust and efficient apps.',
    longDescription: 'This internship focuses on building secure and reliable mobile applications. You will learn about mobile security best practices and gain experience in developing for both Android and iOS, working on projects that require a high degree of precision and quality.',
    responsibilities: ['Designing and building mobile applications for Android and iOS', 'Collaborating with cross-functional teams to define, design, and ship new features', 'Unit-testing code for robustness, including edge cases, usability, and general reliability', 'Improving application performance'],
    qualifications: ['Pursuing a degree in Computer Science or a related field', 'Experience with mobile development (either native Android/iOS or cross-platform with Flutter/React Native)', 'Strong understanding of mobile UI/UX principles', 'Familiarity with RESTful APIs'],
    skills: ['Android', 'iOS', 'Flutter', 'Java', 'Swift'],
    domain: 'Mobile Development',
    location: 'Ghaziabad',
    image: 'https://picsum.photos/600/400?random=10',
  }
];

export const studentProfiles: StudentProfile[] = [
  {
    personalInfo: {
      name: 'Priya Sharma',
      age: 22,
      email: 'priya.sharma@example.com',
      location: 'Mumbai',
      linkedin: 'https://linkedin.com/in/priya-sharma-example',
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
  },
  {
    personalInfo: {
      name: 'Rohan Verma',
      age: 21,
      email: 'rohan.verma@example.com',
      location: 'Remote',
      linkedin: 'https://linkedin.com/in/rohan-verma-example',
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
  },
  {
    personalInfo: {
      name: 'Anika Singh',
      age: 23,
      email: 'anika.singh@example.com',
      location: 'Bangalore',
      linkedin: 'https://linkedin.com/in/anika-singh-example',
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
  },
  {
    personalInfo: {
        name: 'Arjun Reddy',
        age: 24,
        email: 'arjun.reddy@example.com',
        location: 'Pune',
        linkedin: 'https://linkedin.com/in/arjun-reddy-example',
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
  },
   {
    personalInfo: {
      name: 'Sneha Gupta',
      age: 22,
      email: 'sneha.gupta@example.com',
      location: 'Delhi',
      linkedin: 'https://linkedin.com/in/sneha-gupta-example',
    },
    skills: ['Financial Modeling', 'Excel', 'Valuation', 'Accounting'],
    preferences: {
      domain: 'Finance',
      internshipType: 'Full-time',
    },
    resumeSummary: 'Detail-oriented finance student with a strong understanding of financial principles and a knack for quantitative analysis. Seeking to apply my knowledge in a corporate finance setting.',
    eligibility: {
      isNotEmployedFullTime: true,
      isNotEnrolledFullTime: true,
      familyIncome: 780000,
      hasNoGovtJobFamily: false,
      experienceMonths: 15,
    },
  },
  {
    personalInfo: {
      name: 'Vikram Singh',
      age: 23,
      email: 'vikram.singh@example.com',
      location: 'Pune',
      linkedin: 'https://linkedin.com/in/vikram-singh-example',
    },
    skills: ['SEO', 'Content Marketing', 'Google Analytics', 'Social Media'],
    preferences: {
      domain: 'Marketing',
      internshipType: 'Remote',
    },
    resumeSummary: 'A results-driven marketing student with experience in creating and executing digital marketing campaigns. Proven ability to increase brand awareness and engagement.',
     eligibility: {
      isNotEmployedFullTime: true,
      isNotEnrolledFullTime: true,
      familyIncome: 450000,
      hasNoGovtJobFamily: true,
      experienceMonths: 13,
    },
  },
  {
    personalInfo: {
      name: 'Pooja Desai',
      age: 22,
      email: 'pooja.desai@example.com',
      location: 'Mumbai',
      linkedin: 'https://linkedin.com/in/pooja-desai-example',
    },
    skills: ['AutoCAD', 'Structural Analysis', 'STAAD Pro', 'Project Management'],
    preferences: {
      domain: 'Engineering',
      internshipType: 'Full-time',
    },
    resumeSummary: 'A dedicated civil engineering student with a strong grasp of structural design principles and project management. Eager to contribute to challenging infrastructure projects.',
     eligibility: {
      isNotEmployedFullTime: true,
      isNotEnrolledFullTime: true,
      familyIncome: 650000,
      hasNoGovtJobFamily: true,
      experienceMonths: 20,
    },
  },
  {
    personalInfo: {
      name: 'Rajesh Kumar',
      age: 21,
      email: 'rajesh.kumar@example.com',
      location: 'Hyderabad',
      linkedin: 'https://linkedin.com/in/rajesh-kumar-example',
    },
    skills: ['Agronomy', 'Supply Chain Management', 'Rural Marketing', 'Data Collection'],
    preferences: {
      domain: 'Agriculture',
      internshipType: 'Full-time',
    },
    resumeSummary: 'An agriculture student passionate about sustainable farming and improving agricultural supply chains. Experienced in fieldwork and engaging with farming communities.',
     eligibility: {
      isNotEmployedFullTime: true,
      isNotEnrolledFullTime: true,
      familyIncome: 300000,
      hasNoGovtJobFamily: true,
      experienceMonths: 16,
    },
  },
];
