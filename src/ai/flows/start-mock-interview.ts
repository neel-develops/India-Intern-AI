
'use server';
/**
 * @fileOverview A Genkit flow that conducts a mock interview with a student.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { StartMockInterviewInputSchema, StartMockInterviewOutputSchema } from './start-mock-interview-types';
import type { StartMockInterviewInput, StartMockInterviewOutput } from './start-mock-interview-types';

const prompt = ai.definePrompt({
  name: 'mockInterviewPrompt',
  input: {schema: StartMockInterviewInputSchema},
  output: {schema: StartMockInterviewOutputSchema},
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are an expert technical interviewer for IndiaIntern.ai. Your task is to conduct a mock interview with a user for the PM Internship Scheme.

  **Interview Topic**: The user has selected the skill: **{{skill}}**.

  **Your Instructions**:

  1.  **Review the Conversation History**:
      - If the history is empty, this is the start of the interview. You MUST begin by greeting the candidate professionally, stating the purpose of the interview is to assess their skills in **{{skill}}**, and then asking your first question.
      - If the history is NOT empty, the interview is in progress.

  2.  **Interview Flow**:
      a.  If the user has provided an answer, you MUST first provide brief, constructive **feedback** on their previous response.
      b.  After giving feedback, ask the next logical question.
      c.  Ask a total of 5 questions that gradually increase in difficulty.

  3.  **Concluding the Interview**: After the user answers the 5th question:
      a.  Set the \`interviewFinished\` flag to \`true\`.
      b.  Do NOT ask any more questions. Instead, use the 'response' field to say something like "Thank you, that concludes our interview. Here is your feedback."
      c.  Provide the final evaluation: a \`finalScore\` (out of 10), a paragraph of \`overallFeedback\`, and a list of 2-3 specific \`improvementTips\`.

  **Maintain a professional and encouraging tone.**

  ---
  **Conversation History**:
  {{#each history}}
    **{{role}}**: {{content}}
  {{/each}}
  ---

  Based on the history, continue the interview. Your entire response must be a single, valid JSON object that strictly adheres to the output schema.
  `,
});

const mockInterviewFlow = ai.defineFlow(
  {
    name: 'mockInterviewFlow',
    inputSchema: StartMockInterviewInputSchema,
    outputSchema: StartMockInterviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function startMockInterview(
  input: StartMockInterviewInput
): Promise<StartMockInterviewOutput> {
    try {
      return await mockInterviewFlow(input);
    } catch (error: any) {
        if (error.message && error.message.includes('429')) {
            console.warn('AI quota limit reached for mockInterviewFlow.');
            return {
                response: "I'm sorry, but it looks like we've reached the daily limit for AI interactions on our free plan. Please try again tomorrow.",
                interviewFinished: true,
            };
        }
        throw error;
    }
}
