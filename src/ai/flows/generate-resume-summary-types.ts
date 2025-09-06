/**
 * @fileOverview Types for generating an improved resume summary.
 */
import {z} from 'zod';

export const GenerateResumeSummaryInputSchema = z.object({
  resumeText: z.string().describe("The user's original resume text."),
  skills: z.array(z.string()).describe("A list of key skills to highlight in the new summary."),
});
export type GenerateResumeSummaryInput = z.infer<typeof GenerateResumeSummaryInputSchema>;

export const GenerateResumeSummaryOutputSchema = z.object({
    generatedSummary: z.string().describe("The newly generated, improved resume summary."),
});
export type GenerateResumeSummaryOutput = z.infer<typeof GenerateResumeSummaryOutputSchema>;
