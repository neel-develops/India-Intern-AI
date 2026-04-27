

/**
 * @fileOverview AI flow to suggest suitable student candidates for an internship for the PM Internship Scheme.
 *
 * - suggestSuitableCandidates - A function that suggests suitable candidates for an internship.
 */

import {ai} from '../genkit';
import { SuggestSuitableCandidatesInputSchema, SuggestSuitableCandidatesOutputSchema } from './suggest-suitable-candidates-types';
import type { SuggestSuitableCandidatesInput, SuggestSuitableCandidatesOutput } from './suggest-suitable-candidates-types';
import { googleAI } from '@genkit-ai/googleai';

const prompt = ai.definePrompt({
  name: 'suggestSuitableCandidatesPrompt',
  input: {schema: SuggestSuitableCandidatesInputSchema},
  output: {schema: SuggestSuitableCandidatesOutputSchema},
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an AI recruiter for the PM Internship Scheme. Your task is to identify the best student candidates for a given internship based on merit and affirmative action principles.

  **Internship Description:**
  {{{internshipDescription}}}

  **Student Profiles:**
  {{#each studentProfiles}}
  ---
  Student Name: {{this.personalInfo.name}}
  Skills: {{#each this.skills}}{{this.name}} (Proficiency: {{this.proficiency}}/5){{#unless @last}}, {{/unless}}{{/each}}
  Resume Summary: {{this.resumeSummary}}
  Social Category: {{this.affirmativeAction.socialCategory}}
  From Aspirational District: {{this.affirmativeAction.isFromAspirationalDistrict}}
  Has Participated Before: {{this.affirmativeAction.hasParticipatedBefore}}
  {{/each}}

  **Your Task:**
  Evaluate each student against the internship description and provide the output as a single, valid JSON array of candidate objects, ranked by their final match score.

  For each student, provide:
  - A \`matchScore\` (0-100) reflecting a holistic evaluation of skills, qualifications, and affirmative action criteria.
  - An array of \`reasons\` explaining the score. These reasons must clearly state how the student's profile matches and explicitly mention any affirmative action criteria that influenced the decision.

  **Affirmative Action Weighting (in order of importance):**
  1.  Give significant preference to candidates from **aspirational districts**.
  2.  Give preference to candidates from under-represented **social categories** (SC, ST, OBC, EWS).
  3.  Give lower preference to candidates who have **participated in the scheme before**.

  Your entire response must be a single, valid JSON array. Do not add any text before or after the JSON.
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


export async function suggestSuitableCandidates(
  input: SuggestSuitableCandidatesInput
): Promise<SuggestSuitableCandidatesOutput> {
    try {
        return await suggestSuitableCandidatesFlow(input);
    } catch (error: any) {
        console.error('Error in suggestSuitableCandidates flow:', error);
        // Return fallback mock data instead of throwing an error for demo purposes
        console.warn('AI failed or API key invalid. Returning fallback mock data.');
        if (input.studentProfiles && input.studentProfiles.length > 0) {
            return input.studentProfiles.map((p, index) => ({
                studentName: p.personalInfo.name,
                matchScore: Math.max(10, 95 - (index * 15)),
                reasons: ["Strong matching skills (Mock generated).", "Meets basic criteria."]
            })).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
        }
        return [];
    }
}
