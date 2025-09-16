
/**
 * @fileOverview Types and Zod schemas for the resume analysis flow.
 */
import { z } from 'zod';

export const AnalyzeResumeInputSchema = z.object({
  resumeText: z.string().describe("The full text content of the user's resume."),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

export const AnalyzeResumeOutputSchema = z.object({
  overallFeedback: z.string().describe("A brief, overall summary of the resume's quality."),
  strengths: z.array(z.object({
    point: z.string().describe("A specific strength of the resume."),
    explanation: z.string().describe("A brief explanation of why this is a strength."),
  })).describe("A list of the resume's key strengths."),
  areasForImprovement: z.array(z.object({
    point: z.string().describe("A specific area for improvement."),
    suggestion: z.string().describe("A concrete suggestion on how to improve this point."),
  })).describe("A list of areas where the resume can be improved."),
  actionableTips: z.array(z.string()).describe("A list of general, actionable tips for making the resume stand out."),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;
