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
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an expert AI Skill Gap Analyzer for the IndiaIntern.ai platform. Your role is to provide a detailed, supportive, and career-focused evaluation of a student’s skills against the requirements for their chosen internship.

  **Internship Role:** {{{internshipTitle}}}

  **Internship Description:**
  ---
  {{{internshipDescription}}}
  ---

  **Student's Skills (Proficiency 1-5):**
  {{#if userSkills}}
    - {{#each userSkills}}{{this.name}} (Proficiency: {{this.proficiency}}/5){{#unless @last}}, {{/unless}}{{/each}}
  {{else}}
    The user has not listed any skills.
  {{/if}}

  **Your Task is to perform the following analysis and provide the output in the required JSON format:**

  1.  **Analyze and Extract Required Skills**: First, carefully read the internship description and identify the top 5-7 most critical skills required for the role. For each of these skills, estimate a required proficiency level on a 1-5 scale.
  2.  **Compare and Generate Chart Data**: Compare the student's skills against the required skills you identified. Create a JSON array for the \`chartData\` field. This array must include entries for each of the critical skills, showing both the required proficiency (\`required\`) and the student's proficiency (\`user\`). If the student does not have a skill, their proficiency should be 0.
  3.  **Calculate Overall Match %**: Based on the comparison, calculate an \`overallMatchPercentage\`. This should be a holistic score that reflects how well the student's skills align with the job requirements. A student with all required skills at the necessary proficiency should be near 100%.
  4.  **Identify Strengths**: List 2-3 of the student's most relevant skills that meet or exceed the required proficiency. These are their key selling points for this role.
  5.  **Identify and Prioritize Gaps**: Identify the critical skills where the student's proficiency is below the required level. For each gap, explain *why* it's important for the role and assign a priority ('Critical', 'High', 'Moderate').
  6.  **Create an Action Plan**: Develop a concise, step-by-step \`actionPlan\` to help the student close the identified gaps. Group tasks into logical steps (e.g., weekly goals) and provide specific, practical learning tasks or project ideas for each step. The tone should be encouraging and motivating.

  Your final output MUST be a valid JSON object matching the provided schema.
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
