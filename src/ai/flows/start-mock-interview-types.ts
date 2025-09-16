/**
 * @fileOverview Types and Zod schemas for the mock interview flow.
 */
import { z } from 'zod';

export const StartMockInterviewInputSchema = z.object({
  skillToInterview: z.string().describe("The primary skill the user wants to be interviewed on."),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
  })).optional().describe("The conversation history. The user's responses will be in the 'user' role."),
});
export type StartMockInterviewInput = z.infer<typeof StartMockInterviewInputSchema>;

export const StartMockInterviewOutputSchema = z.object({
  interviewerMessage: z.string().describe("The interviewer's next question or statement."),
  feedback: z.string().optional().describe("Constructive feedback on the user's previous answer. This should only be provided after the user has answered a question."),
  isInterviewOver: z.boolean().default(false).describe("A boolean flag indicating if the interview has concluded."),
  summary: z.string().optional().describe("A summary of the candidate's performance at the end of the interview."),
  score: z.number().optional().describe("A final score out of 10 for the candidate's performance."),
  tips: z.array(z.string()).optional().describe("Specific tips for the candidate to improve before a real interview."),
});
export type StartMockInterviewOutput = z.infer<typeof StartMockInterviewOutputSchema>;
