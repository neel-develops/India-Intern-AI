/**
 * @fileOverview Types and Zod schemas for the resume analysis flow.
 */

import {z} from 'zod';

export const AnalyseResumeInputSchema = z.object({
  resumeText: z.string().min(100).describe("The full text content of the student's resume."),
});
export type AnalyseResumeInput = z.infer<typeof AnalyseResumeInputSchema>;

export const AnalyseResumeOutputSchema = z.object({
    analysis: z.object({
        strengths: z.string().describe("A summary of the key strengths of the resume."),
        suggestions: z.string().describe("Actionable suggestions for improvement."),
        impactScore: z.number().min(0).max(100).describe("A score from 0-100 indicating the overall impact of the resume."),
    }),
    detectedSkills: z.array(z.string()).describe("A list of skills detected from the resume text."),
});
export type AnalyseResumeOutput = z.infer<typeof AnalyseResumeOutputSchema>;
