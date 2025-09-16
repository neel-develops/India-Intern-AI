'use server';

/**
 * @fileOverview A Genkit flow that provides feedback on a student's resume.
 *
 * It exports:
 * - `analyseResumeText`: An async function that takes resume text and returns a structured analysis.
 */

import {ai} from '@/ai/genkit';
import type { AnalyseResumeInput, AnalyseResumeOutput } from './analyse-resume-text-types';
import { AnalyseResumeInputSchema, AnalyseResumeOutputSchema } from './analyse-resume-text-types';
import { googleAI } from '@genkit-ai/googleai';

const prompt = ai.definePrompt({
  name: 'analyseResumePrompt',
  input: {schema: AnalyseResumeInputSchema},
  output: {schema: AnalyseResumeOutputSchema},
  model: googleAI.model('gemini-1.5-pro'),
  prompt: `You are an expert career coach AI specializing in helping students create impactful resumes for internships.
  A student has provided their resume text. Your task is to analyze it and provide constructive feedback.

  Analyze the following resume text:
  ---
  {{{resumeText}}}
  ---

  Based on your analysis, provide the following:
  1.  **Strengths**: Write a brief paragraph highlighting the strong points of the resume. Mention specific aspects like clear project descriptions, quantifiable achievements, or well-defined skills.
  2.  **Suggestions**: Provide a concise, actionable paragraph with suggestions for improvement. Focus on areas like using stronger action verbs, quantifying results, improving formatting for readability, or tailoring the content for specific roles.
  3.  **Impact Score**: Give an overall score from 0 to 100 that reflects the resume's potential impact on a recruiter. A score of 100 means the resume is perfect, while a score of 0 means it needs a complete overhaul.
  4.  **Detected Skills**: Extract and list the key technical and soft skills mentioned in the resume.
  `,
});

const analyseResumeFlow = ai.defineFlow(
  {
    name: 'analyseResumeFlow',
    inputSchema: AnalyseResumeInputSchema,
    outputSchema: AnalyseResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function analyseResumeText(
  input: AnalyseResumeInput
): Promise<AnalyseResumeOutput> {
  return analyseResumeFlow(input);
}
