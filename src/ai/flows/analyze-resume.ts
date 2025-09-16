
'use server';
/**
 * @fileOverview A Genkit flow that analyzes a user's resume text and provides feedback.
 *
 * It exports:
 * - `analyzeResume`: An async function that takes resume text and returns a detailed analysis.
 */

import { ai } from '@/ai/genkit';
import { AnalyzeResumeInputSchema, AnalyzeResumeOutputSchema } from './analyze-resume-types';
import type { AnalyzeResumeInput, AnalyzeResumeOutput } from './analyze-resume-types';
import { googleAI } from '@genkit-ai/googleai';

const prompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: { schema: AnalyzeResumeInputSchema },
  output: { schema: AnalyzeResumeOutputSchema },
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an expert career coach and professional resume writer for the IndiaIntern.ai platform. Your task is to analyze the provided resume text and give constructive, actionable feedback.

  **Resume Text:**
  ---
  {{{resumeText}}}
  ---

  **Analysis Instructions:**

  1.  **Overall Feedback**: Start with a brief, encouraging summary of the resume's quality.
  2.  **Strengths**: Identify 2-3 key strengths of the resume. For each strength, explain *why* it is effective (e.g., "Quantifiable achievement using the STAR method").
  3.  **Areas for Improvement**: Identify 2-3 critical areas that need improvement. For each point, provide a specific, actionable suggestion for how to fix it (e.g., "Instead of saying 'Responsible for tasks,' start the bullet point with an action verb like 'Managed' or 'Developed'").
  4.  **Actionable Tips**: Provide a short list of 2-3 general, high-impact tips that the user can apply to make their resume stand out (e.g., "Tailor your resume for each job application by using keywords from the job description.").
  5.  **Resume Score**: Provide a score from 0-100 evaluating the resume's overall quality based on clarity, impact, use of action verbs, and structure.
  6.  **Score Rationale**: Briefly explain the reasoning behind the score.
  7.  **Enhanced Summary**: Rewrite the professional summary from the provided resume text into a more impactful and professional version. If no clear summary exists, create one based on the content of the resume.

  Your feedback should be professional, clear, and aimed at helping the student create a much stronger resume.
  `,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}
