/**
 * @fileOverview Types and Zod schemas for the mock interview flow.
 */
import { z } from 'zod';
import type { Skill } from '@/lib/types';

export const StartMockInterviewInputSchema = z.object({
  internshipTitle: z.string().describe("The title of the internship the user is practicing for."),
  userSkills: z.array(z.object({
    name: z.string(),
    proficiency: z.number(),
  })).describe("A list of the user's skills with proficiency."),
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
});
export type StartMockInterviewOutput = z.infer<typeof StartMockInterviewOutputSchema>;
