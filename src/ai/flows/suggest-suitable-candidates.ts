'use server';

/**
 * @fileOverview AI flow to suggest suitable student candidates for an internship.
 *
 * - suggestSuitableCandidates - A function that suggests suitable candidates for an internship.
 * - SuggestSuitableCandidatesInput - The input type for the suggestSuitableCandidates function.
 * - SuggestSuitableCandidatesOutput - The return type for the suggestSuitableCandidates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSuitableCandidatesInputSchema = z.object({
  internshipDescription: z
    .string()
    .describe('Detailed description of the internship requirements and responsibilities.'),
  studentProfiles: z.array(
    z.object({
      personalInfo: z.object({
        name: z.string(),
        age: z.number(),
        email: z.string().email(),
      }),
      skills: z.array(z.string()),
      preferences: z.array(z.string()),
      resumeSummary: z
        .string()
        .describe('A summary of the student resume highlighting relevant experience.'),
    })
  ).describe('An array of student profiles to evaluate for suitability.'),
});

export type SuggestSuitableCandidatesInput = z.infer<
  typeof SuggestSuitableCandidatesInputSchema
>;

const SuggestSuitableCandidatesOutputSchema = z.array(
  z.object({
    studentName: z.string().describe('Name of the student.'),
    matchScore: z
      .number()
      .describe('A numerical score indicating the suitability of the student (0-100).'),
    reasons: z
      .array(z.string())
      .describe('Reasons why the student is a good match for the internship.'),
  })
);

export type SuggestSuitableCandidatesOutput = z.infer<
  typeof SuggestSuitableCandidatesOutputSchema
>;

export async function suggestSuitableCandidates(
  input: SuggestSuitableCandidatesInput
): Promise<SuggestSuitableCandidatesOutput> {
  return suggestSuitableCandidatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSuitableCandidatesPrompt',
  input: {schema: SuggestSuitableCandidatesInputSchema},
  output: {schema: SuggestSuitableCandidatesOutputSchema},
  prompt: `You are an AI recruiter tasked with identifying the best student candidates for a given internship.

  Given the following internship description:
  {{internshipDescription}}

  And the following student profiles:
  {{#each studentProfiles}}
  Student Name: {{this.personalInfo.name}}
  Skills: {{this.skills}}
  Preferences: {{this.preferences}}
  Resume Summary: {{this.resumeSummary}}
  ---
  {{/each}}

  Evaluate each student profile against the internship description and determine their suitability.
  Provide a match score (0-100) and specific reasons for each student's suitability.
  Return your evaluation in a JSON array.
  `,
});

const suggestSuitableCandidatesFlow = ai.defineFlow(
  {
    name: 'suggestSuitableCandidatesFlow',
    inputSchema: SuggestSuitableCandidatesInputSchema,
    outputSchema: SuggestSuitableCandidatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
