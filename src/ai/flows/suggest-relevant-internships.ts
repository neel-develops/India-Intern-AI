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
  model: googleAI.model('gemini-1.5-flash'),
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
