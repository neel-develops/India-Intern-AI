'use server';
/**
 * @fileOverview A Genkit flow that analyzes the gap between a user's skills and an internship's requirements.
 *
 * It exports:
 * - `analyzeSkillGap`: An async function that takes user skills and an internship description and returns a detailed analysis.
 */

import { ai } from '@/ai/genkit';
import { AnalyzeSkillGapInputSchema, AnalyzeSkillGapOutputSchema } from './analyze-skill-gap-types';
import type { AnalyzeSkillGapInput, AnalyzeSkillGapOutput } from './analyze-skill-gap-types';
import { googleAI } from '@genkit-ai/googleai';

const prompt = ai.definePrompt({
  name: 'analyzeSkillGapPrompt',
  input: { schema: AnalyzeSkillGapInputSchema },
  output: { schema: AnalyzeSkillGapOutputSchema },
  model: googleAI.model('gemini-1.5-pro'),
  prompt: `You are a career development AI. Your task is to analyze the gap between a user's skills and the requirements of an internship.

  {{#if userSkills}}
  User's Skills:
  - {{#each userSkills}}{{this.name}} (Proficiency: {{this.proficiency}}/5){{#unless @last}}, {{/unless}}{{/each}}
  {{else}}
  User has not listed any skills.
  {{/if}}

  Internship Description:
  ---
  {{{internshipDescription}}}
  ---

  Based on the provided information, perform the following analysis:
  1.  **Extract Required Skills**: Identify all the key skills mentioned in the internship description.
  2.  **Identify Matching Skills**: List the skills that the user possesses which are also required for the internship.
  3.  **Identify Missing Skills**: List the most critical skills required for the internship that the user is currently lacking. For each missing skill, provide a brief, insightful explanation of *why* it is important for this specific role, drawing context directly from the internship description.
  `,
});

const analyzeSkillGapFlow = ai.defineFlow(
  {
    name: 'analyzeSkillGapFlow',
    inputSchema: AnalyzeSkillGapInputSchema,
    outputSchema: AnalyzeSkillGapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function analyzeSkillGap(input: AnalyzeSkillGapInput): Promise<AnalyzeSkillGapOutput> {
  return analyzeSkillGapFlow(input);
}
