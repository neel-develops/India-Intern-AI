import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-suitable-candidates.ts';
import '@/ai/flows/suggest-relevant-internships.ts';
import '@/ai/flows/generate-learning-plan.ts';
import '@/ai/flows/analyse-resume-text.ts';
import '@/ai/flows/generate-resume-summary.ts';
