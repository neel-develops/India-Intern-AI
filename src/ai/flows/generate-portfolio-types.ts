/**
 * @fileOverview Types and Zod schemas for the portfolio generation flow.
 */
import { z } from 'zod';

export const GeneratePortfolioInputSchema = z.object({
  name: z.string().describe("The student's full name."),
  email: z.string().email().describe("The student's email address."),
  linkedin: z.string().url().optional().describe("The student's LinkedIn profile URL."),
  resumeSummary: z.string().describe("The summary from the student's resume."),
  skills: z.array(z.string()).describe("A list of the student's top skills."),
});
export type GeneratePortfolioInput = z.infer<typeof GeneratePortfolioInputSchema>;

export const GeneratePortfolioOutputSchema = z.object({
  professionalTitle: z.string().describe("A professional title for the student (e.g., 'Aspiring Data Scientist')."),
  aboutMe: z.string().describe("An expanded, professionally written 'About Me' section."),
  projectIdeas: z.array(z.object({
    title: z.string().describe("A catchy title for a suggested portfolio project."),
    description: z.string().describe("A brief description of the project, tailored to the student's skills."),
    skillsUsed: z.array(z.string()).describe("A list of key skills that would be highlighted by this project."),
  })).describe("A list of 2-3 tailored project ideas the student could build to showcase their skills."),
  skillHighlights: z.array(z.object({
    skill: z.string().describe("A key skill from the student's list."),
    showcase: z.string().describe("A brief, one-sentence example of how this skill can be applied in a project or professional context."),
  })).describe("Highlights for a few key skills with practical application examples."),
});
export type GeneratePortfolioOutput = z.infer<typeof GeneratePortfolioOutputSchema>;
