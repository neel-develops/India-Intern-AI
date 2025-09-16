
/**
 * @fileOverview Types and Zod schemas for the skill gap analysis flow.
 */
import { z } from 'zod';
import type { Skill } from '@/lib/types';

export const AnalyzeSkillGapInputSchema = z.object({
  userSkills: z.array(z.object({
    name: z.string(),
    proficiency: z.number(),
    certificate: z.string().optional(),
  })).describe("A list of the user's current skills with proficiency."),
  internshipDescription: z.string().describe("The full job description for the target internship."),
});
export type AnalyzeSkillGapInput = z.infer<typeof AnalyzeSkillGapInputSchema>;

export const AnalyzeSkillGapOutputSchema = z.object({
  requiredSkills: z.array(z.string()).describe("A list of all skills required for the internship, extracted from the description."),
  matchingSkills: z.array(z.string()).describe("A list of skills the user has that match the internship requirements."),
  missingSkills: z.array(z.object({
    skill: z.string().describe("The name of the missing skill."),
    importance: z.string().describe("An explanation of why this skill is important for the role, based on the job description."),
  })).describe("A list of critical skills the user is lacking for this specific role, along with their importance."),
});
export type AnalyzeSkillGapOutput = z.infer<typeof AnalyzeSkillGapOutputSchema>;
