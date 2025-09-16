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
import { googleAI } from '@genkit-ai/googleai';

const prompt = ai.definePrompt({
  name: 'mockInterviewPrompt',
  input: { schema: StartMockInterviewInputSchema },
  output: { schema: StartMockInterviewOutputSchema },
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an experienced technical interviewer conducting a mock interview.

**Interview Topic:** {{{skillToInterview}}}

**Your Instructions:**

1.  **Analyze the Conversation History:** Look at the 'history' provided. The last message is always from the candidate.
2.  **Determine Your Action:**
    *   **If the history is empty:** This is the beginning of the interview. Your task is to introduce yourself briefly and ask the first question related to {{{skillToInterview}}}. Do not provide any feedback yet.
    *   **If the history is NOT empty:** The candidate has just answered a question. Your task is to first provide brief, constructive feedback on their last answer. Then, ask the next progressively challenging question.
3.  **Conduct the Interview:**
    *   Ask a total of 5-7 questions.
    *   Mix theory, problem-solving, and real-world application questions.
    *   Maintain a professional but friendly tone.
4.  **Conclude the Interview:**
    *   After the 5th to 7th question has been answered, you must conclude the interview.
    *   Provide a final summary of the candidate's performance.
    *   Give a score out of 10.
    *   Offer specific, actionable tips for improvement.
    *   Set 'isInterviewOver' to true ONLY in this final message.

**Conversation History:**
{{#if history}}
  {{#each history}}
    {{#if (eq this.role 'user')}}Candidate: {{this.content}}{{/if}}
    {{#if (eq this.role 'model')}}Interviewer: {{this.content}}{{/if}}
  {{/each}}
{{else}}
  No history yet. This is the start of the interview.
{{/if}}

Please proceed with your next response based on these instructions.
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
