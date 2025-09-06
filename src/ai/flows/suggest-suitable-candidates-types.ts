/**
 * @fileOverview Types and Zod schemas for the suitable candidates suggestion flow.
 */

import {z} from 'genkit/zod';

export const SuggestSuitableCandidatesInputSchema = z.object({
  internshipDescription: z
    .string()
    .describe('Detailed description of the internship requirements and responsibilities.'),
  studentProfiles: z.array(
    z.object({
      personalInfo: z.object({
        name: z.string(),
        age: z.number(),
        email: z.string().email(),
        location: z.string(),
      }),
      skills: z.array(z.string()),
      preferences: z.array(z.string()),
      resumeSummary: z
        .string()
        .describe('A summary of the student resume highlighting relevant experience.'),
      affirmativeAction: z.object({
        socialCategory: z.string().describe("The student's social category (e.g., General, OBC, SC, ST, EWS)."),
        isFromAspirationalDistrict: z.boolean().describe("Whether the student is from an aspirational district."),
        hasParticipatedBefore: z.boolean().describe("Whether the student has participated in this scheme before."),
      }).describe('Information for affirmative action considerations.'),
    })
  ).describe('An array of student profiles to evaluate for suitability.'),
});

export type SuggestSuitableCandidatesInput = z.infer<
  typeof SuggestSuitableCandidatesInputSchema
>;

export const SuggestSuitableCandidatesOutputSchema = z.array(
  z.object({
    studentName: z.string().describe('Name of the student.'),
    matchScore: z
      .number()
      .describe('A numerical score (0-100) indicating the suitability of the student. This score should holistically reflect skills, qualifications, and affirmative action criteria.'),
    reasons: z
      .array(z.string())
      .describe('Specific reasons why the student is a good match, mentioning skills, experience, and any applicable affirmative action points.'),
  })
);

export type SuggestSuitableCandidatesOutput = z.infer<
  typeof SuggestSuitableCandidatesOutputSchema
>;
