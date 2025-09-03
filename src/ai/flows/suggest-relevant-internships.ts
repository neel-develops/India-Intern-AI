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
    }),
    resumeText: z.string().describe('The text content of the student resume.'),
  }).describe('The student profile data.'),
  internshipListings: z.array(z.object({
      title: z.string(),
      company: z.string(),
      description: z.string(),
      skills: z.array(z.string()),
      domain: z.string(),
      location: z.string(),
      // Other internship details
    })).describe('A list of available internship listings.'),
});

export type SuggestRelevantInternshipsInput = z.infer<
  typeof SuggestRelevantInternshipsInputSchema
>;

// Define the output schema for the flow
const SuggestRelevantInternshipsOutputSchema = z.array(z.object({
  title: z.string(),
  company: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
  domain: z.string(),
  location: z.string(),
  matchReason: z.string().describe('The reason why this internship is a good match for the student.'),
}));

export type SuggestRelevantInternshipsOutput = z.infer<
  typeof SuggestRelevantInternshipsOutputSchema
>;

// Define the prompt
const suggestRelevantInternshipsPrompt = ai.definePrompt({
  name: 'suggestRelevantInternshipsPrompt',
  input: {schema: SuggestRelevantInternshipsInputSchema},
  output: {schema: SuggestRelevantInternshipsOutputSchema},
  prompt: `You are an AI assistant that suggests relevant internships to students based on their profile data and a list of available internship listings.

      Analyze the student's profile, including their skills, preferences, and resume, and match them with the most suitable internships from the provided list.
      
      Consider the student's preferred domain, skills, and location when making your suggestions.

      Explain the reason why each suggested internship is a good match for the student in the matchReason field.

      Student Profile:
      {{studentProfile}}

      Internship Listings:
      {{internshipListings}}

      Output a JSON array of internship objects that best match the student's profile.
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
