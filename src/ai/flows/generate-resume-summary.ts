'use server';

/**
 * @fileOverview A Genkit flow that generates an improved resume summary.
 */

import {ai} from '@/ai/genkit';
import type { GenerateResumeSummaryInput, GenerateResumeSummaryOutput } from './generate-resume-summary-types';
import { GenerateResumeSummaryInputSchema, GenerateResumeSummaryOutputSchema } from './generate-resume-summary-types';
import { googleAI } from '@genkit-ai/googleai';

const prompt = ai.definePrompt({
  name: 'generateResumeSummaryPrompt',
  input: {schema: GenerateResumeSummaryInputSchema},
  output: {schema: GenerateResumeSummaryOutputSchema},
  model: googleAI.model('gemini-1.5-pro'),
  prompt: `You are an expert resume writer and career coach.
  Based on the user's original resume text and the list of their key skills, please rewrite the resume summary.

  The new summary should be:
  - Professional and concise (around 150 words).
  - Written in the first-person (e.g., "I am a motivated...").
  - Action-oriented, using strong verbs.
  - Highlight the provided key skills effectively.
  - Tailored to sound like an impactful professional summary.

  Original Resume Text:
  ---
  {{{resumeText}}}
  ---

  Key skills to emphasize:
  - {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Generate the improved summary.
  `,
});


const generateResumeSummaryFlow = ai.defineFlow(
  {
    name: 'generateResumeSummaryFlow',
    inputSchema: GenerateResumeSummaryInputSchema,
    outputSchema: GenerateResumeSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function generateResumeSummary(
  input: GenerateResumeSummaryInput
): Promise<GenerateResumeSummaryOutput> {
  return generateResumeSummaryFlow(input);
}
