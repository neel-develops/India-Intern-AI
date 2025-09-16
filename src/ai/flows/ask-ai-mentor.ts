'use server';

/**
 * @fileOverview A Genkit flow that acts as an AI career mentor.
 *
 * It exports:
 * - `askAiMentor`: An async function that takes a user's question and returns advice.
 */

import { ai } from '@/ai/genkit';
import { AskAiMentorInputSchema, AskAiMentorOutputSchema } from './ask-ai-mentor-types';
import type { AskAiMentorInput, AskAiMentorOutput } from './ask-ai-mentor-types';

const prompt = ai.definePrompt({
  name: 'askAiMentorPrompt',
  input: { schema: AskAiMentorInputSchema },
  output: { schema: AskAiMentorOutputSchema },
  prompt: `You are an expert AI Career Mentor for students in India. Your name is 'MentorAI'. Your goal is to provide supportive, insightful, and actionable advice to help students navigate their internship journey and career development.

  Your advice should be:
  - **Contextual**: Relevant to the Indian job market and the challenges students face.
  - **Actionable**: Provide clear, practical steps the user can take.
  - **Encouraging**: Maintain a positive and motivating tone.
  - **Concise**: Get straight to the point without unnecessary fluff.

  {{#if history}}
  Conversation History:
  {{#each history}}
  {{#if (eq this.role 'user')}}User: {{this.content}}{{/if}}
  {{#if (eq this.role 'model')}}MentorAI: {{this.content}}{{/if}}
  {{/each}}
  {{/if}}

  User's Question: {{{question}}}

  Your Answer:
  `,
});

const askAiMentorFlow = ai.defineFlow(
  {
    name: 'askAiMentorFlow',
    inputSchema: AskAiMentorInputSchema,
    outputSchema: AskAiMentorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function askAiMentor(input: AskAiMentorInput): Promise<AskAiMentorOutput> {
  return askAiMentorFlow(input);
}
