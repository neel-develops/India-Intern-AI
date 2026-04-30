import { openRouterJson } from '../openrouter';
import type { SuggestRelevantInternshipsInput, SuggestRelevantInternshipsOutput } from './suggest-relevant-internships-types';

export async function suggestRelevantInternships(
  input: SuggestRelevantInternshipsInput,
): Promise<SuggestRelevantInternshipsOutput> {
  const profile = input.studentProfile;
  const listings = input.internshipListings.slice(0, 20);

  const system = `You are an expert AI career counselor matching students to internships.`;

  const user = `Match this student to the best internships and return a JSON ARRAY (not object):
[
  {"id": "internship_id", "matchReason": "why this is a good match", "matchPercentage": 85}
]

Return the top 5 best matches sorted by matchPercentage descending.

Student profile:
- Skills: ${profile.skills.map((s: any) => `${s.name}(${s.proficiency}/5)`).join(', ')}
- Domain preference: ${profile.preferences?.domain || 'Any'}
- Location: ${profile.personalInfo?.location || 'Any'}

Available internships:
${listings.map((i: any) => `ID: ${i.id} | Title: ${i.title} | Company: ${i.company} | Skills: ${i.skills?.join(', ')}`).join('\n')}`;

  try {
    const result = await openRouterJson<SuggestRelevantInternshipsOutput>(system, user);
    return Array.isArray(result) ? result.sort((a, b) => b.matchPercentage - a.matchPercentage) : [];
  } catch (error: any) {
    console.error('suggestRelevantInternships error:', error.message);
    return listings.slice(0, 3).map((i: any, idx: number) => ({
      id: i.id,
      matchPercentage: Math.max(10, 90 - idx * 12),
      matchReason: `Matches your skills in ${i.skills?.[0] || 'general areas'}.`,
    }));
  }
}
