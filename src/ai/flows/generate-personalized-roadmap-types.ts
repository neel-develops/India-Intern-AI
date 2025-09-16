/**
 * @fileOverview Types for the Personalized Roadmap Generation Flow.
 */
import { z } from 'zod';

// Define the skill level enum
const SkillLevel = z.enum(['beginner', 'intermediate', 'advanced', 'not_started']);

// Input schema for the flow
export const PersonalizedRoadmapInputSchema = z.object({
  userId: z.string().describe('Unique ID of the student.'),
  locationType: z.enum(['rural', 'urban']).describe('The student\'s location type (rural or urban).'),
  skills: z.array(z.object({
    name: z.string().describe('The name of the skill.'),
    level: SkillLevel.describe('The student\'s proficiency level in the skill.'),
  })).describe('A list of the student\'s skills with their current levels.'),
  matchScore: z.number().min(0).max(100).describe('The student\'s current match score with a target internship.'),
});
export type PersonalizedRoadmapInput = z.infer<typeof PersonalizedRoadmapInputSchema>;

// Output schema for the flow
export const PersonalizedRoadmapOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A short list of AI-suggested learning steps (e.g., free courses, workshops).'),
  roadmap: z.object({
    week1: z.array(z.string()).describe('A list of actionable tasks for week 1.'),
    week2: z.array(z.string()).describe('A list of actionable tasks for week 2.'),
    week3: z.array(z.string()).describe('A list of actionable tasks for week 3.'),
  }).describe('A weekly improvement plan with concrete actions for three weeks.'),
});
export type PersonalizedRoadmapOutput = z.infer<typeof PersonalizedRoadmapOutputSchema>;
