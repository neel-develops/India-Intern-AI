'use server';

/**
 * @fileOverview AI flow to generate a personalized learning roadmap for a student.
 *
 * It exports:
 * - `generatePersonalizedRoadmap`: An async function that creates a tailored roadmap based on student data.
 */

import { ai } from '@/ai/genkit';
import { PersonalizedRoadmapInputSchema, PersonalizedRoadmapOutputSchema } from './generate-personalized-roadmap-types';
import type { PersonalizedRoadmapInput, PersonalizedRoadmapOutput } from './generate-personalized-roadmap-types';

export async function generatePersonalizedRoadmap(
  input: PersonalizedRoadmapInput
): Promise<PersonalizedRoadmapOutput> {
  return generatePersonalizedRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedRoadmapPrompt',
  input: { schema: PersonalizedRoadmapInputSchema },
  output: { schema: PersonalizedRoadmapOutputSchema },
  prompt: `You are an AI career coach for students in India. Your task is to generate a personalized learning roadmap based on the student's profile. The plan should be realistic, actionable, and considerate of the student's location and resources.

  **Student Profile:**
  - User ID: {{{userId}}}
  - Location Type: {{{locationType}}}
  - Current Match Score: {{{matchScore}}}%
  - Skills:
    {{#each skills}}
    - {{{this.name}}}: {{{this.level}}}
    {{/each}}

  **Instructions:**
  1.  **Analyze the Profile**: Identify the key areas for improvement. Focus on skills that are 'not_started' or 'beginner'.
  2.  **Consider Location**: For 'rural' students, suggest resources that are low-data or available offline (like PDFs, community workshops). For 'urban' students, you can suggest more online-heavy resources like YouTube, LinkedIn Learning, and interactive platforms.
  3.  **Create Recommendations**: Provide a short, prioritized list of 3-4 immediate learning steps. These should be high-impact actions. Suggest specific, real, and accessible resources (e.g., "Start Digital Literacy (SWAYAM free course)", "Strengthen SQL (w3schools practice)").
  4.  **Develop a 3-Week Roadmap**: Create a practical, week-by-week plan. Each week should have 2-3 concrete actions. The goal is to show tangible progress over a short period.

  Generate the output in the specified JSON format.
  `,
});

const generatePersonalizedRoadmapFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedRoadmapFlow',
    inputSchema: PersonalizedRoadmapInputSchema,
    outputSchema: PersonalizedRoadmapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
