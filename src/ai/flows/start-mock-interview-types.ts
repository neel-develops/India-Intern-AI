
/**
 * @fileOverview Types for the AI Mock Interview flow.
 */
import {z} from 'zod';

const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

export const StartMockInterviewInputSchema = z.object({
  skill: z.string().describe("The technical skill the user wants to be interviewed on."),
  history: z.array(MessageSchema).optional().describe("The history of the conversation so far."),
});
export type StartMockInterviewInput = z.infer<typeof StartMockInterviewInputSchema>;

export const StartMockInterviewOutputSchema = z.object({
  response: z.string().describe("The interviewer's next question or comment."),
  feedback: z.string().optional().describe("Constructive feedback on the user's previous answer."),
  interviewFinished: z.boolean().describe("A boolean flag indicating if the interview has concluded."),
  finalScore: z.number().optional().describe("The final score (out of 10) given at the end of the interview."),
  overallFeedback: z.string().optional().describe("Overall feedback provided at the end of the interview."),
  improvementTips: z.array(z.string()).optional().describe("A list of tips for the user to improve."),
});
export type StartMockInterviewOutput = z.infer<typeof StartMockInterviewOutputSchema>;
