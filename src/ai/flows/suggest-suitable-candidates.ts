'use server';

/**
 * @fileOverview AI flow to suggest suitable student candidates for an internship for the PM Internship Scheme.
 *
 * - suggestSuitableCandidates - A function that suggests suitable candidates for an internship.
 */

import {ai} from '@/ai/genkit';
import { SuggestSuitableCandidatesInputSchema, SuggestSuitableCandidatesOutputSchema } from './suggest-suitable-candidates-types';
import type { SuggestSuitableCandidatesInput, SuggestSuitableCandidatesOutput } from './suggest-suitable-candidates-types';
import { googleAI } from '@genkit-ai/googleai';


export async function suggestSuitableCandidates(
  input: SuggestSuitableCandidatesInput
): Promise<SuggestSuitableCandidatesOutput> {
  return suggestSuitableCandidatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSuitableCandidatesPrompt',
  input: {schema: SuggestSuitableCandidatesInputSchema},
  output: {schema: SuggestSuitableCandidatesOutputSchema},
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an AI recruiter for the PM Internship Scheme. Your task is to identify the best student candidates for a given internship, following specific allocation guidelines.

  Evaluate each student against the internship description. Your evaluation must be based on a combination of merit and affirmative action principles.

  **Evaluation Criteria:**
  1.  **Skills and Qualifications:** First, assess how well the student's skills, preferences, and resume summary align with the internship description.
  2.  **Affirmative Action:** After assessing merit, adjust the evaluation based on the following, in order of importance:
      *   Give significant preference to candidates from **aspirational districts**.
      *   Give preference to candidates from under-represented **social categories** (SC, ST, OBC, EWS).
      *   Give lower preference to candidates who have **participated in the scheme before**.

  **Output:**
  For each student, provide:
  - A matchScore (0-100) that reflects this comprehensive evaluation.
  - An array of reasons explaining the score. These reasons must clearly state how the student's profile matches the internship and explicitly mention any affirmative action criteria that influenced the decision (e.g., "Strong match due to Python skills and preference for candidates from aspirational districts.").

  **Internship Description:**
  {{internshipDescription}}

  **Student Profiles:**
  {{#each studentProfiles}}
  ---
  Student Name: {{this.personalInfo.name}}
  Location: {{this.personalInfo.location}}
  Skills: {{this.skills}}
  Preferences: {{this.preferences}}
  Resume Summary: {{this.resumeSummary}}
  Social Category: {{this.affirmativeAction.socialCategory}}
  From Aspirational District: {{this.affirmativeAction.isFromAspirationalDistrict}}
  Has Participated Before: {{this.affirmativeAction.hasParticipatedBefore}}
  {{/each}}

  Return your evaluation as a JSON array of candidate objects, ranked by their final match score.
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
