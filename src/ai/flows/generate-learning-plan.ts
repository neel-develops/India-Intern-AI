'use server';

/**
 * @fileOverview A Genkit flow that generates a learning plan for a given skill.
 *
 * It exports:
 * - `generateLearningPlan`: An async function that takes a skill name and returns a structured learning plan.
 */

import {ai} from '@/ai/genkit';
import type { GenerateLearningPlanInput, GenerateLearningPlanOutput } from './generate-learning-plan-types';
import { GenerateLearningPlanInputSchema, GenerateLearningPlanOutputSchema } from './generate-learning-plan-types';


const prompt = ai.definePrompt({
  name: 'generateLearningPlanPrompt',
  input: {schema: GenerateLearningPlanInputSchema},
  output: {schema: GenerateLearningPlanOutputSchema},
  prompt: `You are a helpful career coach AI. A user wants to learn a new skill: {{{skill}}}.

  Your task is to generate a concise, actionable learning plan to help them get started. The plan should be broken down into 3-4 logical steps. For each step, provide a brief description and include the following, ensuring all provided URLs are real, valid, and lead to high-quality content:
  1.  A few high-quality, real online resources (like official documentation, well-regarded tutorials, or insightful articles).
  2.  A list of the best and most relevant YouTube video tutorials or channels for that specific step.
  3.  A list of any available free certification courses related to the step. If no free courses are available, return an empty array.

  Also, suggest one simple but practical project idea that would help the user apply their new knowledge.

  Keep the descriptions clear and encouraging. The goal is to make learning a new skill feel approachable, exciting, and grounded in legitimate educational materials.
  `,
});

const generateLearningPlanFlow = ai.defineFlow(
  {
    name: 'generateLearningPlanFlow',
    inputSchema: GenerateLearningPlanInputSchema,
    outputSchema: GenerateLearningPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function generateLearningPlan(
  input: GenerateLearningPlanInput
): Promise<GenerateLearningPlanOutput> {
  return generateLearningPlanFlow(input);
}
