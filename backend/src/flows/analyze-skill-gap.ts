import { openRouterJson } from '../openrouter';
import type { AnalyzeSkillGapInput, AnalyzeSkillGapOutput } from './analyze-skill-gap-types';

export async function analyzeSkillGap(input: AnalyzeSkillGapInput): Promise<AnalyzeSkillGapOutput> {
  const system = `You are an expert career advisor specializing in skill gap analysis for students seeking internships in India.`;

  const skillsText = input.userSkills.map(s => `${s.name} (proficiency: ${s.proficiency}/5)`).join(', ');

  const user = `Analyze the skill gap and return a JSON object with EXACTLY these fields:
{
  "overallMatchPercentage": 65,
  "strengths": ["strength1", "strength2"],
  "prioritizedGaps": [
    {"skill": "...", "reason": "...", "priority": "Critical|High|Moderate"}
  ],
  "actionPlan": [
    {"step": "Week 1-2: ...", "tasks": ["task1", "task2"]}
  ],
  "chartData": [
    {"skill": "...", "required": 4, "user": 2}
  ]
}

Student skills: ${skillsText}
Target internship: ${input.internshipTitle}
Job description: ${input.internshipDescription}`;

  try {
    return await openRouterJson<AnalyzeSkillGapOutput>(system, user);
  } catch (error: any) {
    console.error('analyzeSkillGap error:', error.message);
    return {
      overallMatchPercentage: 60,
      strengths: ['Communication', 'Problem Solving'],
      prioritizedGaps: [{ skill: 'Domain Knowledge', reason: 'Key for the role.', priority: 'High' }],
      chartData: [{ skill: 'General Skills', required: 4, user: 3 }],
      actionPlan: [{ step: 'Week 1: Learn fundamentals', tasks: ['Take an online course', 'Build a project'] }],
    };
  }
}
