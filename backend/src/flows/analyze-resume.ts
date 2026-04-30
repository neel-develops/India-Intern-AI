import { openRouterJson } from '../openrouter';
import type { AnalyzeResumeInput, AnalyzeResumeOutput } from './analyze-resume-types';

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  const system = `You are an expert career coach AI specializing in helping Indian students land internships.`;

  const user = `Analyze this resume and return a JSON object with EXACTLY these fields:
{
  "overallFeedback": "brief overall summary",
  "strengths": [{"point": "...", "explanation": "..."}],
  "areasForImprovement": [{"point": "...", "suggestion": "..."}],
  "actionableTips": ["tip1", "tip2"],
  "resumeScore": 75,
  "scoreRationale": "brief explanation",
  "enhancedSummary": "professionally rewritten summary"
}

Resume text:
${input.resumeText}`;

  try {
    return await openRouterJson<AnalyzeResumeOutput>(system, user);
  } catch (error: any) {
    console.error('analyzeResume error:', error.message);
    return {
      overallFeedback: 'AI analysis unavailable. Please try again later.',
      strengths: [{ point: 'Clear formatting', explanation: 'Resume is easy to read.' }],
      areasForImprovement: [{ point: 'Add metrics', suggestion: 'Quantify your achievements.' }],
      actionableTips: ['Include portfolio link.', 'Proofread carefully.'],
      resumeScore: 70,
      scoreRationale: 'Fallback score — AI unavailable.',
      enhancedSummary: 'Motivated professional seeking opportunities to grow and contribute.',
    };
  }
}
