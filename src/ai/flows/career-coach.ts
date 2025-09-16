
'use server';
/**
 * @fileOverview A Genkit flow that acts as a professional career advisor for students.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { CareerCoachInputSchema, CareerCoachOutputSchema } from './career-coach-types';
import type { CareerCoachInput, CareerCoachOutput, Message } from './career-coach-types';
import { z } from 'zod';

const CareerCoachChatInputSchema = z.object({
  studentProfile: CareerCoachInputSchema.shape.studentProfile,
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe("The history of the conversation so far."),
});
type CareerCoachChatInput = z.infer<typeof CareerCoachChatInputSchema>;


const CareerCoachChatOutputSchema = z.object({
  response: z.string().describe("The career coach's response."),
});
type CareerCoachChatOutput = z.infer<typeof CareerCoachChatOutputSchema>;


const prompt = ai.definePrompt({
  name: 'careerCoachChatPrompt',
  input: {schema: CareerCoachChatInputSchema},
  output: {schema: CareerCoachChatOutputSchema},
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are a professional, friendly, and encouraging AI career advisor. Your goal is to provide practical and personalized advice to students.

  You are having a conversation with a student. Use their profile information as context for your answers.

  **Student Profile:**
  - Name: {{{studentProfile.personalInfo.name}}}
  - Education: {{{studentProfile.personalInfo.degree}}} in {{{studentProfile.personalInfo.stream}}}
  - Skills: {{#each studentProfile.skills}}{{this.name}} (Proficiency: {{this.proficiency}}/5){{#unless @last}}, {{/unless}}{{/each}}
  - Career Interests: Domain of {{{studentProfile.preferences.domain}}}

  **Conversation History**:
  {{#each history}}
    **{{role}}**: {{content}}
  {{/each}}

  **Your Task**:
  Based on the conversation history and the student's profile, provide a helpful and encouraging response to their latest message. If the user asks for a learning plan, provide a detailed plan with actionable steps and links to accessible online resources (prioritize free or low-cost options and ensure URLs are valid).
  
  Format your response with markdown for readability (e.g., use bolding for headers, bullet points for lists).
  `,
});


const careerCoachChatFlow = ai.defineFlow(
  {
    name: 'careerCoachChatFlow',
    inputSchema: CareerCoachChatInputSchema,
    outputSchema: CareerCoachChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function chatWithCareerCoach(
  input: CareerCoachChatInput
): Promise<CareerCoachChatOutput> {
   try {
        return await careerCoachChatFlow(input);
    } catch (error: any) {
        if (error.message && error.message.includes('429')) {
            console.warn('AI quota limit reached for careerCoachChatFlow.');
            return { response: "I'm sorry, but it looks like we've reached the daily limit for AI interactions on our free plan. Please try again tomorrow." };
        }
        throw error;
    }
}
