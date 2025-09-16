
'use server';
/**
 * @fileOverview A Genkit flow that acts as a professional career advisor for students.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { CareerCoachInputSchema, CareerCoachOutputSchema } from './career-coach-types';
import type { CareerCoachInput, CareerCoachOutput } from './career-coach-types';

const prompt = ai.definePrompt({
  name: 'careerCoachPrompt',
  input: {schema: CareerCoachInputSchema},
  output: {schema: CareerCoachOutputSchema},
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are a professional career advisor AI for the IndiaIntern.ai platform. Your goal is to provide friendly, encouraging, and practical advice to students to help them achieve their career goals.

  The user has provided their profile information. Based on this, you must perform a comprehensive analysis and provide the following:

  User Profile:
  - Name: {{{studentProfile.personalInfo.name}}}
  - Education: {{{studentProfile.personalInfo.degree}}} in {{{studentProfile.personalInfo.stream}}}
  - Skills: {{#each studentProfile.skills}}{{this.name}} (Proficiency: {{this.proficiency}}/5){{#unless @last}}, {{/unless}}{{/each}}
  - Career Interests: Domain of {{{studentProfile.preferences.domain}}}

  Your Tasks:
  1.  **Skill Analysis**: Analyze the user's current skills. Identify their strengths and pinpoint any critical skill gaps they might have for their stated career interests.
  2.  **Suggest Career Paths**: Suggest 2-3 specific and realistic career paths, internships, or entry-level jobs that are a good match for their current profile. For each suggestion, explain *why* it's a good fit.
  3.  **Create a Learning Plan**: Provide a step-by-step plan to close the identified skill gaps. For each major gap, suggest concrete actions like specific types of projects to build, topics to study, or tasks to practice.
  4.  **Provide Resources**: For each step in the learning plan, include a list of accessible resources. Prioritize online courses, free workshops, or low-data options suitable for all users, including those in rural areas (e.g., freeCodeCamp, NPTEL, Coursera's free courses).
  5.  **Professional Development Tips**: Give actionable tips on:
      -   **Resume Building**: How can they tailor their resume to highlight their strengths for their desired roles?
      -   **Interview Prep**: What are some key things they should prepare for when interviewing for jobs in their domain?
      -   **Networking**: How can a student start networking effectively?

  Keep your advice friendly, encouraging, and practical. Ensure all generated URLs are valid.
  `,
});


const careerCoachFlow = ai.defineFlow(
  {
    name: 'careerCoachFlow',
    inputSchema: CareerCoachInputSchema,
    outputSchema: CareerCoachOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function getCareerAdvice(
  input: CareerCoachInput
): Promise<CareerCoachOutput> {
  return careerCoachFlow(input);
}
