'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests relevant internships to students based on their profile data.
 *
 * It exports:
 * - `suggestRelevantInternships`: An async function that takes student profile data as input and returns a list of suggested internships.
 */

import {ai} from '@/ai/genkit';
import { SuggestRelevantInternshipsInputSchema, SuggestRelevantInternshipsOutputSchema } from './suggest-relevant-internships-types';
import type { SuggestRelevantInternshipsInput, SuggestRelevantInternshipsOutput } from './suggest-relevant-internships-types';
import { googleAI } from '@genkit-ai/googleai';

// Define the prompt
const suggestRelevantInternshipsPrompt = ai.definePrompt({
  name: 'suggestRelevantInternshipsPrompt',
  input: {schema: SuggestRelevantInternshipsInputSchema},
  output: {schema: SuggestRelevantInternshipsOutputSchema},
  model: googleAI.model('gemini-pro'),
  prompt: `You are an expert AI career counselor. Your task is to find the most relevant internships for a student from a list of available openings.

You MUST follow these rules strictly:
1.  **Skill-Based Matching is the #1 Priority**: The internships you suggest MUST require skills that the student possesses. The more skills that overlap, the better the match. Do NOT suggest internships where the student has zero matching skills.
2.  **Adhere to Domain Preference**: The student has specified a preferred domain. Your suggestions should fall within this domain. For example, if the student's domain is 'Data Science', do not suggest a 'Civil Engineering' internship.
3.  **Provide Clear Justification**: For each match, the 'matchReason' field is mandatory. It must clearly and concisely explain *why* the internship is a good fit, mentioning the specific skills the student has that are relevant to the role.

Student Profile:
{{{json studentProfile}}}

Internship Listings:
{{{json internshipListings}}}

Based on these rules, output a JSON array of the top 3-5 internship objects that are the best fit for the student. Ensure the original internship 'id' is included in your response.
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
