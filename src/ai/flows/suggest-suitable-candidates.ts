
'use server';

/**
 * @fileOverview AI flow to suggest suitable student candidates for an internship for the PM Internship Scheme.
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
        location: z.string(),
      }),
      skills: z.array(z.string()),
      preferences: z.array(z.string()),
      resumeSummary: z
        .string()
        .describe('A summary of the student resume highlighting relevant experience.'),
      affirmativeAction: z.object({
        socialCategory: z.string().describe("The student's social category (e.g., General, OBC, SC, ST, EWS)."),
        isFromAspirationalDistrict: z.boolean().describe("Whether the student is from an aspirational district."),
        hasParticipatedBefore: z.boolean().describe("Whether the student has participated in this scheme before."),
      }).describe('Information for affirmative action considerations.'),
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
      .describe('A numerical score (0-100) indicating the suitability of the student. This score should holistically reflect skills, qualifications, and affirmative action criteria.'),
    reasons: z
      .array(z.string())
      .describe('Specific reasons why the student is a good match, mentioning skills, experience, and any applicable affirmative action points.'),
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
  - A `matchScore` (0-100) that reflects this comprehensive evaluation.
  - An array of `reasons` explaining the score. These reasons must clearly state how the student's profile matches the internship and explicitly mention any affirmative action criteria that influenced the decision (e.g., "Strong match due to Python skills and preference for candidates from aspirational districts.").

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
