'use server';

/**
 * @fileOverview A Genkit flow that generates a learning plan for a given skill.
 *
 * It exports:
 * - `generateLearningPlan`: An async function that takes a skill name and returns a structured learning plan.
 * - `GenerateLearningPlanInput`: The TypeScript type definition for the input.
 * - `GenerateLearningPlanOutput`: The TypeScript type definition for the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLearningPlanInputSchema = z.object({
  skill: z.string().describe('The skill the user wants to learn.'),
});

export type GenerateLearningPlanInput = z.infer<
  typeof GenerateLearningPlanInputSchema
>;

const GenerateLearningPlanOutputSchema = z.object({
  learningPlan: z.array(z.object({
    step: z.string().describe('The title of the learning step.'),
    description: z.string().describe('A brief description of what to learn in this step.'),
    resources: z.array(z.string()).describe('A list of suggested online resources (articles, tutorials, videos).'),
  })).describe("The structured learning plan."),
  projectIdea: z.object({
      title: z.string().describe("A catchy title for a practical project."),
      description: z.string().describe("A brief description of a hands-on project to apply the new skill."),
  }).describe("A practical project idea to solidify the skill.")
});


export type GenerateLearningPlanOutput = z.infer<
  typeof GenerateLearningPlanOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'generateLearningPlanPrompt',
  input: {schema: GenerateLearningPlanInputSchema},
  output: {schema: GenerateLearningPlanOutputSchema},
  prompt: `You are a helpful career coach AI. A user wants to learn a new skill: {{{skill}}}.

  Your task is to generate a concise, actionable learning plan to help them get started. The plan should be broken down into 3-4 logical steps. For each step, provide a brief description and a few high-quality, real online resources (like tutorials, articles, or documentation).

  Also, suggest one simple but practical project idea that would help the user apply their new knowledge.

  Keep the descriptions clear and encouraging. The goal is to make learning a new skill feel approachable and exciting.
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
