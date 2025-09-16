
'use server';

/**
 * @fileOverview A Genkit flow that acts as an AI career coach, capable of providing advice and generating learning plans.
 *
 * It exports:
 * - `careerCoach`: An async function that takes a user's question and conversation history.
 */

import { ai } from '@/ai/genkit';
import { CareerCoachInputSchema, CareerCoachOutputSchema } from './career-coach-types';
import type { CareerCoachInput, CareerCoachOutput } from './career-coach-types';
import { generateLearningPlan as generateLearningPlanFlow } from './generate-learning-plan';
import { GenerateLearningPlanInputSchema, GenerateLearningPlanOutputSchema } from './generate-learning-plan-types';
import { z } from 'zod';

const generateLearningPlanTool = ai.defineTool(
    {
        name: 'generateLearningPlan',
        description: 'Generates a detailed learning plan for a specific skill. Use this when the user explicitly asks to learn something or wants a roadmap.',
        inputSchema: GenerateLearningPlanInputSchema,
        outputSchema: GenerateLearningPlanOutputSchema,
    },
    async (input) => generateLearningPlanFlow(input)
);


const prompt = ai.definePrompt({
  name: 'careerCoachPrompt',
  input: { schema: CareerCoachInputSchema },
  output: { schema: z.object({ answer: z.string() }) }, // The direct text answer
  tools: [generateLearningPlanTool],
  prompt: `You are an expert AI Career Coach for students in India. Your name is 'CoachAI'. Your goal is to provide supportive, insightful, and actionable advice to help students navigate their internship journey and career development.

  Your advice should be:
  - **Contextual**: Relevant to the Indian job market and the challenges students face.
  - **Actionable**: Provide clear, practical steps the user can take.
  - **Encouraging**: Maintain a positive and motivating tone.
  - **Concise**: Get straight to the point without unnecessary fluff.

  **IMPORTANT**: Analyze the user's question.
  - If the user is asking a general question (e.g., "How do I prepare for an interview?", "What are good skills to learn?"), provide a direct, helpful answer.
  - If the user explicitly asks to learn a specific skill, for a "roadmap", or "how to learn X", you **MUST** use the \`generateLearningPlan\` tool. When you use the tool, your text answer should be a brief, encouraging message introducing the plan, like "Of course! Here is a learning plan for..."

  {{#if history}}
  Conversation History:
  {{#each history}}
  {{#if (this.role == 'user')}}User: {{this.content}}{{/if}}
  {{#if (this.role == 'model')}}CoachAI: {{this.content}}{{/if}}
  {{/each}}
  {{/if}}

  User's Question: {{{question}}}

  Your Answer:
  `,
});

const careerCoachFlow = ai.defineFlow(
  {
    name: 'careerCoachFlow',
    inputSchema: CareerCoachInputSchema,
    outputSchema: CareerCoachOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    const toolCalls = response.toolCalls('generateLearningPlan');
    
    let learningPlan: CareerCoachOutput['learningPlan'] = null;
    if (toolCalls.length > 0) {
        const toolOutput = await toolCalls[0].run();
        learningPlan = toolOutput;
    }
    
    return {
        answer: response.output!.answer,
        learningPlan: learningPlan
    }
  }
);

export async function careerCoach(input: CareerCoachInput): Promise<CareerCoachOutput> {
  return careerCoachFlow(input);
}
