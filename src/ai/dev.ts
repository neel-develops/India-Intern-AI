
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-suitable-candidates.ts';
import '@/ai/flows/suggest-relevant-internships.ts';
import '@/ai/flows/generate-learning-plan.ts';
import '@/ai/flows/analyse-resume-text.ts';
import '@/ai/flows/generate-resume-summary.ts';
import '@/ai/flows/career-coach.ts';
import '@/ai/flows/start-mock-interview.ts';
import '@/ai/flows/analyze-skill-gap.ts';
