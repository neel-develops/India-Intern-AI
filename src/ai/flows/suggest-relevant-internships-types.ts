/**
 * @fileOverview Types and Zod schemas for the internship suggestion flow.
 */

import {z} from 'zod';
import type { Internship, Skill } from '@/lib/types';


// Define the input schema for the flow
export const SuggestRelevantInternshipsInputSchema = z.object({
  studentProfile: z.object({
    personalInfo: z.object({
      name: z.string().describe('The name of the student.'),
      age: z.number().describe('The age of the student.'),
      location: z.string().describe('The location of the student.'),
    }),
    skills: z.array(z.object({
      name: z.string(),
      proficiency: z.number(),
      certificate: z.string().optional(),
    })).describe('A list of the student s skills with proficiency.'),
    preferences: z.object({
      domain: z.string().describe('The preferred domain of the student.'),
      internshipType: z
        .string()      
        .describe('The preferred type of internship.'),
      otherDomain: z.string().optional().describe('A custom domain if the preferred domain is "Other".'),
    }),
    resumeText: z.string().describe('The text content of the student resume.'),
  }).describe('The student profile data.'),
  internshipListings: z.array(z.object({
      id: z.string(),
      title: z.string(),
      company: z.string(),
      description: z.string(),
      skills: z.array(z.string()),
      domain: z.string(),
      location: z.string(),
    })).describe('A list of available internship listings.'),
});

export type SuggestRelevantInternshipsInput = z.infer<
  typeof SuggestRelevantInternshipsInputSchema
>;

// Define the output schema for the flow
export const SuggestRelevantInternshipsOutputSchema = z.array(z.object({
  id: z.string().describe('The unique ID of the internship listing.'),
  matchReason: z.string().describe('The reason why this internship is a good match for the student, highlighting skill matches and areas for improvement.'),
  matchPercentage: z.number().min(0).max(100).describe('A normalized percentage score (0-100) representing how well the student matches the internship.'),
}));

// This is a workaround to make the AI output compatible with our Internship type
export type SuggestRelevantInternshipsOutput = { id: string, matchReason: string, matchPercentage: number }[];
