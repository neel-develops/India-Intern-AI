
/**
 * @fileOverview This file defines a Genkit flow that suggests relevant internships to students based on their profile data.
 *
 * It exports:
 * - `suggestRelevantInternships`: An async function that takes student profile data as input and returns a list of suggested internships.
 */

import {ai} from '../genkit';
import { SuggestRelevantInternshipsInputSchema, SuggestRelevantInternshipsOutputSchema } from './suggest-relevant-internships-types';
import type { SuggestRelevantInternshipsInput, SuggestRelevantInternshipsOutput } from './suggest-relevant-internships-types';
import { googleAI } from '@genkit-ai/googleai';

// Define the prompt
const suggestRelevantInternshipsPrompt = ai.definePrompt({
  name: 'suggestRelevantInternshipsPrompt',
  input: {schema: SuggestRelevantInternshipsInputSchema},
  output: {schema: SuggestRelevantInternshipsOutputSchema},
  model: googleAI.model('gemini-1.5-pro-latest'),
  prompt: `You are an expert AI career counselor. Your task is to find the most relevant internships for a student from a list of available openings. You will analyze the student's profile against each internship and calculate a precise match score to rank the best options.

  **Your process must be as follows:**

  1.  **For each internship, analyze its description and required skills to determine the following:**
      a.  **Key Skills**: Identify the most important skills for the role.
      b.  **Skill Weight**: For each key skill, assign a weight from 1 (least important) to 10 (most important). Skills mentioned multiple times or under a "Requirements" section should have a higher weight.
      c.  **Required Proficiency**: For each key skill, estimate the required proficiency level on a scale of 1 (Beginner) to 5 (Expert).

  2.  **Compare Student Profile**: For each internship, compare the student's skills against the list of key skills you identified.
      - If the student has a required skill, note their proficiency.
      - If the student does not have a required skill, their proficiency is 0.

  3.  **Calculate the Match Percentage**: For each internship, calculate a weighted match score using the following logic:
      a.  For each key skill, calculate a skill score: \`(studentProficiency / requiredProficiency) * skillWeight\`. Clamp the ratio \`(studentProficiency / requiredProficiency)\` at a maximum of 1 (the student cannot be more proficient than required for scoring purposes).
      b.  Sum all the skill scores to get a \`totalScore\`.
      c.  Sum all the skill weights to get a \`maxScore\`.
      d.  The final \`matchPercentage\` is \`(totalScore / maxScore) * 100\`. Round it to the nearest whole number.

  4.  **Generate Match Reason**: For each match, write a concise \`matchReason\` that explains the score. Mention key strengths (e.g., "Strong in Python & Data Science") and potential gaps (e.g., "needs improvement in ML").

  5.  **Rank and Output**:
      - Rank the internships from highest to lowest \`matchPercentage\`.
      - Return a JSON array of the **top 3-5 matches**, strictly adhering to the output schema.
      - Your entire response must be a single, valid JSON array. Do not add any text before or after it.

  **Student Profile:**
  {{{json studentProfile}}}

  **Internship Listings:**
  {{{json internshipListings}}}
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
    // Sort results by match percentage descending
    const sortedOutput = output?.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return sortedOutput!;
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
  try {
    return await suggestRelevantInternshipsFlow(input);
  } catch (error: any) {
    console.error('Error in suggestRelevantInternships flow:', error);
    // Return mock data instead of throwing an error for demo purposes
    console.warn('AI failed or API key invalid. Returning fallback mock data.');
    if (input.internshipListings && input.internshipListings.length > 0) {
        return input.internshipListings.slice(0, 3).map((internship, index) => ({
            id: internship.id,
            matchPercentage: Math.max(10, 98 - (index * 12)),
            matchReason: `This internship matches your skills in ${internship.skills[0] || 'general areas'} (Mock response).`
        }));
    }
    return [];
  }
}
