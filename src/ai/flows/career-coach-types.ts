
/**
 * @fileOverview Types for the AI Career Advisor flow.
 */
import {z} from 'zod';
import type { StudentProfile } from '@/lib/types';

export const CareerCoachInputSchema = z.object({
  studentProfile: z.object({
     personalInfo: z.object({
      name: z.string(),
      degree: z.string().optional(),
      stream: z.string().optional(),
    }),
    skills: z.array(z.object({
        name: z.string(),
        proficiency: z.number(),
    })),
    preferences: z.object({
        domain: z.string(),
    }),
  }),
});
export type CareerCoachInput = z.infer<typeof CareerCoachInputSchema>;


export const CareerCoachOutputSchema = z.object({
  skillAnalysis: z.object({
    strengths: z.array(z.string()).describe("List of the user's key strengths."),
    gaps: z.array(z.string()).describe("List of important skills the user is missing for their preferred domain."),
  }).describe("Analysis of the user's current skills."),
  suggestedPaths: z.array(z.object({
    path: z.string().describe("A specific career path, internship, or entry-level job title."),
    reason: z.string().describe("Why this path is a good match for the user's profile."),
  })).describe("Suggested career paths, internships, or jobs."),
  learningPlan: z.array(z.object({
    skillToLearn: z.string().describe("The skill the user should focus on learning."),
    steps: z.array(z.string()).describe("A list of actionable steps to learn this skill."),
    resources: z.array(z.object({
        name: z.string().describe("Name of the resource, e.g., 'Coursera' or 'freeCodeCamp'."),
        link: z.string().url().describe("A direct URL to the resource."),
        isFree: z.boolean().describe("Whether the resource is free or low-cost."),
    })).describe("A list of accessible online resources to help learn the skill."),
  })).describe("Step-by-step recommendations to close skill gaps."),
  professionalDevelopment: z.object({
    resumeTips: z.array(z.string()).describe("Actionable tips for improving the user's resume based on their profile."),
    interviewPrep: z.array(z.string()).describe("Tips for preparing for interviews in their preferred domain."),
    networkingTips: z.array(z.string()).describe("Practical advice on how to network effectively."),
  }).describe("General tips on resume building, interview preparation, and networking."),
});
export type CareerCoachOutput = z.infer<typeof CareerCoachOutputSchema>;
