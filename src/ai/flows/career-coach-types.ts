
/**
 * @fileOverview Types and Zod schemas for the AI Career Coach flow.
 */
import { z } from 'zod';
import { GenerateLearningPlanOutputSchema } from './generate-learning-plan-types';
import type { GenerateLearningPlanOutput } from './generate-learning-plan-types';


export const CareerCoachInputSchema = z.object({
  question: z.string().describe("The user's question for the AI coach."),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
  })).optional().describe("The conversation history."),
});
export type CareerCoachInput = z.infer<typeof CareerCoachInputSchema>;

export const CareerCoachOutputSchema = z.object({
  answer: z.string().describe("The AI coach's response to the user's question."),
  learningPlan: GenerateLearningPlanOutputSchema.nullable().describe("A structured learning plan, if one was generated."),
});
export type CareerCoachOutput = {
    answer: string;
    learningPlan: GenerateLearningPlanOutput | null;
};
