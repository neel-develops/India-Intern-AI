
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
  prompt: `You are an expert career coach AI. Your task is to analyze the provided resume text and provide the output in a structured JSON format.

  Resume Text:
  ---
  {{{resumeText}}}
  ---

  Your task is to analyze the resume and generate a JSON object that strictly adheres to the output schema. Based on the text, you must:

  1. Provide a brief, overall summary of the resume's quality.
  2. Identify 2-3 key strengths.
  3. Identify 2-3 areas for improvement with concrete suggestions.
  4. Provide 2-3 general, actionable tips.
  5. Score the resume from 0-100 based on clarity, impact, and structure.
  6. Provide a brief rationale for the score.
  7. Rewrite the professional summary from the resume into an enhanced, professional version. If no summary exists, create one based on the resume's content.

  Your entire response must be a single, valid JSON object matching the provided output schema. Do not add any text before or after the JSON object.
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

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput | null> {
  try {
    return await analyzeResumeFlow(input);
  } catch (error: any) {
    console.error('Error in analyzeResume flow:', error);
    if (error.message && error.message.includes('429')) {
      console.warn('AI quota limit reached for analyzeResume. Returning null.');
      return null;
    }
    // Re-throw other types of errors if they are not related to rate limiting
    throw new Error('An unexpected error occurred during resume analysis.');
  }
}
