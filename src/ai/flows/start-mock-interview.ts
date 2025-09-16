
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
  prompt: `You are an experienced technical interviewer. Conduct a realistic mock interview with the candidate.

  **Interview Context:**
  - Skill: {{{skillToInterview}}}

  **Your Task:**
  - Ask 5-7 progressively challenging questions related to the selected skill. Mix theory, problem-solving, and real-world application questions.
  - After each candidate response, provide short, constructive feedback (mentioning strengths and areas for improvement).
  - Maintain a professional but friendly tone.
  - After the final question (around the 5th to 7th question), conclude the interview.
  - At the end of the interview, provide a final summary of the candidate's performance, a score out of 10, and specific, actionable tips to improve. Set 'isInterviewOver' to true ONLY at this final step.

  **Conversation History:**
  {{#if history}}
  {{#each history}}
  {{#if (eq this.role 'user')}}Candidate: {{this.content}}{{/if}}
  {{#if (eq this.role 'model')}}Interviewer: {{this.content}}{{/if}}
  {{/each}}

  Based on the history, continue the interview.
  - Provide feedback on the last user response and then ask the next question.
  - If you have asked enough questions (5-7), provide the final summary, score, and tips, and set isInterviewOver to true.
  {{else}}
  **No history yet.** Start the interview by briefly introducing yourself and asking the first question.
  {{/if}}
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
