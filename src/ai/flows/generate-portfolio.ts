'use server';

/**
 * @fileOverview A Genkit flow that generates professional portfolio content for a student.
 *
 * It exports:
 * - `generatePortfolio`: An async function that takes student profile data and returns structured portfolio content.
 */

import { ai } from '@/ai/genkit';
import { GeneratePortfolioInputSchema, GeneratePortfolioOutputSchema } from './generate-portfolio-types';
import type { GeneratePortfolioInput, GeneratePortfolioOutput } from './generate-portfolio-types';

const prompt = ai.definePrompt({
  name: 'generatePortfolioPrompt',
  input: { schema: GeneratePortfolioInputSchema },
  output: { schema: GeneratePortfolioOutputSchema },
  prompt: `You are an expert career coach and portfolio builder for students. Your task is to generate professional and compelling content for a student's portfolio based on their profile information.

  Student's Profile:
  - Name: {{{name}}}
  - Summary: {{{resumeSummary}}}
  - Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Based on this, generate the following portfolio content:
  1.  **Professional Title**: Create a concise and impactful professional title for the student.
  2.  **About Me**: Rewrite the student's resume summary into a more engaging, first-person "About Me" section for a portfolio.
  3.  **Project Ideas**: Suggest 2-3 practical and impressive project ideas that the student could create to showcase their skills. For each project, provide a title, a brief description, and list the key skills it would demonstrate.
  4.  **Skill Highlights**: Select 3-4 of the student's most important skills and, for each one, write a single sentence describing a practical application or a way to showcase that skill.
  `,
});

const generatePortfolioFlow = ai.defineFlow(
  {
    name: 'generatePortfolioFlow',
    inputSchema: GeneratePortfolioInputSchema,
    outputSchema: GeneratePortfolioOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generatePortfolio(input: GeneratePortfolioInput): Promise<GeneratePortfolioOutput> {
  return generatePortfolioFlow(input);
}
