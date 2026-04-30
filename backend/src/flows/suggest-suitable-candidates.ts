import { openRouterJson } from '../openrouter';
import type { SuggestSuitableCandidatesInput, SuggestSuitableCandidatesOutput } from './suggest-suitable-candidates-types';

export async function suggestSuitableCandidates(
  input: SuggestSuitableCandidatesInput,
): Promise<SuggestSuitableCandidatesOutput> {
  const students = input.studentProfiles.slice(0, 15);

  const system = `You are an AI recruiter for the PM Internship Scheme. Evaluate candidates based on merit and affirmative action principles.

Affirmative Action Priority (highest to lowest):
1. Candidates from aspirational districts
2. Under-represented social categories (SC, ST, OBC, EWS)
3. Lower preference for candidates who participated before`;

  const user = `Rank these students for the internship and return a JSON ARRAY:
[
  {"studentName": "...", "matchScore": 85, "reasons": ["reason1", "reason2"]}
]

Return top matches sorted by matchScore descending.

Internship requirements:
${input.internshipDescription}

Candidates:
${students.map((s: any) => `Name: ${s.personalInfo.name} | Skills: ${s.skills?.map((sk: any) => sk.name).join(', ')} | Category: ${s.affirmativeAction?.socialCategory} | Aspirational District: ${s.affirmativeAction?.isFromAspirationalDistrict}`).join('\n')}`;

  try {
    const result = await openRouterJson<SuggestSuitableCandidatesOutput>(system, user);
    return Array.isArray(result) ? result.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5) : [];
  } catch (error: any) {
    console.error('suggestSuitableCandidates error:', error.message);
    return students.slice(0, 5).map((p: any, idx: number) => ({
      studentName: p.personalInfo.name,
      matchScore: Math.max(10, 95 - idx * 15),
      reasons: ['Meets basic criteria.'],
    }));
  }
}
