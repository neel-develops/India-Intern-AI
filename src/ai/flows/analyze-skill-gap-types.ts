/**
 * @fileOverview Types and Zod schemas for the skill gap analysis flow.
 */
import { z } from 'zod';

export const AnalyzeSkillGapInputSchema = z.object({
  userSkills: z.array(z.object({
    name: z.string(),
    proficiency: z.number().min(1).max(5),
  })).describe("A list of the user's current skills with proficiency on a 1-5 scale."),
  internshipDescription: z.string().describe("The full job description for the target internship."),
  internshipTitle: z.string().describe("The title of the target internship."),
});
export type AnalyzeSkillGapInput = z.infer<typeof AnalyzeSkillGapInputSchema>;

export const AnalyzeSkillGapOutputSchema = z.object({
  overallMatchPercentage: z.number().min(0).max(100).describe("A percentage score representing how closely the student's profile matches the internship requirements."),
  strengths: z.array(z.string()).describe("A list of the user's key skills that are strong assets for this role."),
  prioritizedGaps: z.array(z.object({
      skill: z.string().describe("The name of the missing or underdeveloped skill."),
      reason: z.string().describe("A brief explanation of why this skill is critical for the internship."),
      priority: z.enum(["Critical", "High", "Moderate"]).describe("The priority level for addressing this skill gap."),
  })).describe("A prioritized list of the most important skills the user is lacking."),
  actionPlan: z.array(z.object({
      step: z.string().describe("A high-level step in the learning roadmap (e.g., 'Week 1-2: Master SQL Fundamentals')."),
      tasks: z.array(z.string()).describe("A list of specific, actionable tasks for that step."),
  })).describe("A step-by-step action plan to close the identified skill gaps."),
  chartData: z.array(z.object({
      skill: z.string().describe("The name of the skill."),
      required: z.number().min(0).max(5).describe("The required proficiency level for the job (0-5)."),
      user: z.number().min(0).max(5).describe("The user's current proficiency level (0-5)."),
  })).describe("Structured data for a radar chart comparing user skills to required skills. Include the top 5-7 most relevant skills for the role."),
});
export type AnalyzeSkillGapOutput = z.infer<typeof AnalyzeSkillGapOutputSchema>;
