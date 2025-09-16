
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
  prompt: `You are an experienced technical and HR interviewer for IndiaIntern.ai. Your task is to conduct a realistic mock interview with the user for the PM Internship Scheme.

  **Interview Topic**: The user has selected the skill: **{{skill}}**.

  **Your Instructions**:

  1.  **Review the History**:
      - **If the history is empty**: This is the start of the interview. You MUST begin by greeting the candidate professionally, introducing yourself, stating the purpose of the interview is to assess their skills in **{{skill}}**, and then ask your first question.
      - **If the history is NOT empty**: The interview is in progress. Continue to the next step.

  2.  **Interview Flow**:
      a.  If the user has provided an answer, you MUST first provide brief, constructive **feedback** on their previous response.
      b.  After giving feedback, ask the next logical question.
      c.  Ask a total of 5 questions. The questions should gradually increase in difficulty, covering theory, application, and problem-solving related to **{{skill}}**.

  3.  **Concluding the Interview**: After the user answers the 5th question:
      a.  Set the \`interviewFinished\` flag to \`true\`.
      b.  Do NOT ask any more questions. Instead, use the 'response' field to say something like "Thank you, that concludes our interview. Here is your feedback."
      c.  Provide the final evaluation: a \`finalScore\` (out of 10), a paragraph of \`overallFeedback\`, and a list of 2-3 specific \`improvementTips\`.

  **Maintain a professional, friendly, and encouraging tone throughout.**

  ---
  **Conversation History**:
  {{#each history}}
    **{{role}}**: {{content}}
  {{/each}}
  ---

  Now, based on the history, continue the interview. Your entire response must be a single, valid JSON object.
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
  return mockInterviewFlow(input);
}
