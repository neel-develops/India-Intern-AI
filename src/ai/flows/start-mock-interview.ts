'use server';

/**
 * @fileOverview A Genkit flow that simulates a mock interview for a student.
 *
 * It exports:
 * - `startMockInterview`: An async function that handles the conversation flow of a mock interview.
 */

import { ai } from '@/ai/genkit';
import { StartMockInterviewInputSchema, StartMockInterviewOutputSchema } from './start-mock-interview-types';
import type { StartMockInterviewInput, StartMockInterviewOutput } from './start-mock-interview-types';

const prompt = ai.definePrompt({
  name: 'mockInterviewPrompt',
  input: { schema: StartMockInterviewInputSchema },
  output: { schema: StartMockInterviewOutputSchema },
  prompt: `You are an AI Interviewer conducting a mock interview for a student. Your persona is professional, encouraging, but also challenging.

  **Interview Context:**
  - Role: {{{internshipTitle}}}
  - Candidate's Skills: {{#if userSkills}}{{#each userSkills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}No skills provided.{{/if}}

  **Your Task:**
  - Engage in a realistic interview conversation.
  - Ask a mix of behavioral, situational, and technical questions relevant to the role and the candidate's skills.
  - After the candidate answers a question (i.e., when the history has at least one 'user' entry), provide brief, constructive feedback on their response before asking the next question.
  - Keep the interview flowing for about 4-5 questions.
  - After the last question, conclude the interview professionally and set 'isInterviewOver' to true.

  **Conversation History:**
  {{#if history}}
  {{#each history}}
  {{#if (eq this.role 'user')}}Candidate: {{this.content}}{{/if}}
  {{#if (eq this.role 'model')}}Interviewer: {{this.content}}{{/if}}
  {{/each}}
  {{/if}}

  Based on the history, continue the interview. If the history is empty, start with a greeting and the first question.
  `,
});

const startMockInterviewFlow = ai.defineFlow(
  {
    name: 'startMockInterviewFlow',
    inputSchema: StartMockInterviewInputSchema,
    outputSchema: StartMockInterviewOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function startMockInterview(input: StartMockInterviewInput): Promise<StartMockInterviewOutput> {
  return startMockInterviewFlow(input);
}
