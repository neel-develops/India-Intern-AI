
/**
 * @fileOverview A Genkit flow that analyzes a user's resume text and provides feedback.
 *
 * It exports:
 * - `analyzeResume`: An async function that takes resume text and returns a detailed analysis.
 */

import { ai } from '../genkit';
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
    // Return mock data instead of throwing an error
    console.warn('AI failed or API key invalid. Returning fallback mock data.');
    return {
        overallFeedback: "This is a mock analysis because the AI API key is invalid or quota exceeded. Your resume looks generally good but could use some refinement.",
        strengths: [
            { point: "Clear formatting", explanation: "The resume is easy to read." },
            { point: "Relevant skills", explanation: "You have listed relevant skills." }
        ],
        areasForImprovement: [
            { point: "Lack of metrics", suggestion: "Add quantifiable results to your experience." }
        ],
        actionableTips: ["Include a link to your portfolio.", "Proofread for typos."],
        resumeScore: 85,
        scoreRationale: "Good base, but needs more impact.",
        enhancedSummary: "A motivated professional with strong skills seeking to leverage experience in a dynamic environment."
    };
  }
}
