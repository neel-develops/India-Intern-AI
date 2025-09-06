
// src/ai/flows/suggest-relevant-internships.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests relevant internships to students based on their profile data.
 *
 * It exports:
 * - `suggestRelevantInternships`: An async function that takes student profile data as input and returns a list of suggested internships.
 * - `SuggestRelevantInternshipsInput`: The TypeScript type definition for the input to the `suggestRelevantInternships` function.
 * - `SuggestRelevantInternshipsOutput`: The TypeScript type definition for the output of the `suggestRelevantInternships` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Internship } from '@/lib/types';


// Define the input schema for the flow
const SuggestRelevantInternshipsInputSchema = z.object({
  studentProfile: z.object({
    personalInfo: z.object({
      name: z.string().describe('The name of the student.'),
      age: z.number().describe('The age of the student.'),
      location: z.string().describe('The location of the student.'),
    }),
    skills: z.array(z.string()).describe('A list of the student s skills.'),
    preferences: z.object({
      domain: z.string().describe('The preferred domain of the student.'),
      internshipType: z
        .string()      
        .describe('The preferred type of internship.'),
      otherDomain: z.string().optional().describe('A custom domain if the preferred domain is "Other".'),
    }),
    resumeText: z.string().describe('The text content of the student resume.'),
  }).describe('The student profile data.'),
  internshipListings: z.array(z.object({
      id: z.string(),
      title: z.string(),
      company: z.string(),
      description: z.string(),
      skills: z.array(z.string()),
      domain: z.string(),
      location: z.string(),
    })).describe('A list of available internship listings.'),
});

export type SuggestRelevantInternshipsInput = z.infer<
  typeof SuggestRelevantInternshipsInputSchema
>;

// Define the output schema for the flow
const SuggestRelevantInternshipsOutputSchema = z.array(z.object({
  id: z.string().describe('The unique ID of the internship listing.'),
  title: z.string(),
  company: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
  domain: z.string(),
  location: z.string(),
  matchReason: z.string().describe('The reason why this internship is a good match for the student.'),
}));

// This is a workaround to make the AI output compatible with our Internship type
export type SuggestRelevantInternshipsOutput = (Omit<Internship, 'longDescription' | 'responsibilities' | 'qualifications' | 'image'> & { matchReason: string })[];


// Define the prompt
const suggestRelevantInternshipsPrompt = ai.definePrompt({
  name: 'suggestRelevantInternshipsPrompt',
  input: {schema: SuggestRelevantInternshipsInputSchema},
  output: {schema: SuggestRelevantInternshipsOutputSchema},
  prompt: `You are an AI assistant tasked with suggesting relevant internships to students.

Your goal is to provide the most suitable matches based on the student's profile and the available internship listings.

You must consider the following factors:
*   Match the student's skills with the skills required for the internship.
*   Match the student's preferred domain and internship type. If the domain is 'Other', use the 'otherDomain' field as their preference.
*   Consider the student's location preferences.

For each suggested internship, you must provide a clear 'matchReason' that explains why it's a good fit, referencing the student's skills and preferences.

Student Profile:
{{{json studentProfile}}}

Internship Listings:
{{{json internshipListings}}}

Output a JSON array of internship objects that best match the student's profile based on the criteria above. Include the original internship 'id' in your response. Only return the top 3-5 matches.
      `,
});

// Define the flow
const suggestRelevantInternshipsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantInternshipsFlow',
    inputSchema: SuggestRelevantInternshipsInputSchema,
    outputSchema: SuggestRelevantInternshipsOutputSchema,
  },
  async input => {
    const {output} = await suggestRelevantInternshipsPrompt(input);
    return output!;
  }
);

/**
 * Suggests relevant internships to a student based on their profile.
 * @param input The input containing the student profile and internship listings.
 * @returns A list of suggested internships.
 */
export async function suggestRelevantInternships(
  input: SuggestRelevantInternshipsInput
): Promise<SuggestRelevantInternshipsOutput> {
  return suggestRelevantInternshipsFlow(input);
}
