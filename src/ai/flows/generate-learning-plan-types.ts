/**
 * @fileOverview Types and Zod schemas for the learning plan generation flow.
 */

import {z} from 'zod';

export const GenerateLearningPlanInputSchema = z.object({
  skill: z.string().describe('The skill the user wants to learn.'),
});

export type GenerateLearningPlanInput = z.infer<
  typeof GenerateLearningPlanInputSchema
>;

export const GenerateLearningPlanOutputSchema = z.object({
  learningPlan: z.array(z.object({
    step: z.string().describe('The title of the learning step.'),
    description: z.string().describe('A brief description of what to learn in this step.'),
    resources: z.array(z.string()).describe('A list of suggested online resources (articles, tutorials, videos).'),
    youtubeResources: z.array(z.string()).describe('A list of suggested YouTube video tutorials or channels.'),
    freeCertifications: z.array(z.string()).describe('A list of free certification courses available online.'),
  })).describe("The structured learning plan."),
  projectIdea: z.object({
      title: z.string().describe("A catchy title for a practical project."),
      description: z.string().describe("A brief description of a hands-on project to apply the new skill."),
  }).describe("A practical project idea to solidify the skill.")
});


export type GenerateLearningPlanOutput = z.infer<
  typeof GenerateLearningPlanOutputSchema
>;
