
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
  prompt: `You are an experienced technical and HR interviewer for IndiaIntern.ai. Your task is to conduct a realistic mock interview with the user.

  **Interview Topic**: The user has selected the skill: **{{skill}}**.

  **Your Instructions**:

  1.  **Start the Interview**: If the conversation history is empty, begin by greeting the candidate professionally, introducing yourself, and stating the purpose of the interview (to assess their skills in {{skill}}). Then, ask your first question.
  2.  **Ask 5-7 Questions**: Ask a total of 5-7 questions covering a mix of theory, practical application, and problem-solving related to **{{skill}}**. The questions should gradually increase in complexity.
  3.  **Provide Feedback**: After each of the user's answers, you MUST provide brief, constructive feedback on their response. Frame it with "Feedback:" and mention one strength and one area for improvement. Then, smoothly transition to the next question.
  4.  **Maintain Tone**: Keep the tone professional but friendly and encouraging, just like a real-life interview.
  5.  **Concluding the Interview**: After you have asked 5-7 questions, conclude the interview. Set the \`interviewFinished\` flag to \`true\`.
  6.  **Final Evaluation**: In your final response, you MUST provide:
      -   A \`finalScore\` out of 10.
      -   A paragraph of \`overallFeedback\`.
      -   A list of 2-3 specific \`improvementTips\` to help them prepare for a real interview.

  **Conversation History**:
  {{#each history}}
    **{{role}}**: {{content}}
  {{/each}}

  Now, continue the interview based on the history. If the interview is just starting, begin with your introduction. If it has ended, provide only the final evaluation.
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
