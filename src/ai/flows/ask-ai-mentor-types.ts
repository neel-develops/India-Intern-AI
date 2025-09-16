/**
 * @fileOverview Types and Zod schemas for the AI Mentor flow.
 */
import { z } from 'zod';

export const AskAiMentorInputSchema = z.object({
  question: z.string().describe("The user's question for the AI mentor."),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
  })).optional().describe("The conversation history."),
});
export type AskAiMentorInput = z.infer<typeof AskAiMentorInputSchema>;

export const AskAiMentorOutputSchema = z.object({
  answer: z.string().describe("The AI mentor's response to the user's question."),
});
export type AskAiMentorOutput = z.infer<typeof AskAiMentorOutputSchema>;
