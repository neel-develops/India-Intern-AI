/**
 * AI feature implementations using the Gemini API directly.
 * No backend server required — all AI calls happen from the browser.
 */

import { geminiJson, geminiChat } from '@/lib/gemini';
import type { AnalyzeResumeInput, AnalyzeResumeOutput } from '@/ai/flows/analyze-resume-types';
import type { AnalyzeSkillGapInput, AnalyzeSkillGapOutput } from '@/ai/flows/analyze-skill-gap-types';
import type { CareerCoachInput, CareerCoachOutput } from '@/ai/flows/career-coach-types';
import type { StartMockInterviewInput, StartMockInterviewOutput } from '@/ai/flows/start-mock-interview-types';
import type { SuggestRelevantInternshipsInput, SuggestRelevantInternshipsOutput } from '@/ai/flows/suggest-relevant-internships-types';
import type { SuggestSuitableCandidatesInput, SuggestSuitableCandidatesOutput } from '@/ai/flows/suggest-suitable-candidates-types';

// ─── Resume Analyzer ────────────────────────────────────────────────────────

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  const systemPrompt = `You are an expert career counselor and resume reviewer specializing in helping Indian students and recent graduates land internships and entry-level jobs. Analyze the given resume text thoroughly.`;

  const userPrompt = `Analyze this resume and return a JSON object with exactly these fields:
{
  "overallFeedback": "brief overall summary",
  "strengths": [{"point": "...", "explanation": "..."}],
  "areasForImprovement": [{"point": "...", "suggestion": "..."}],
  "actionableTips": ["tip1", "tip2"],
  "resumeScore": 75,
  "scoreRationale": "brief explanation of score",
  "enhancedSummary": "professionally rewritten resume summary"
}

Resume text:
${input.resumeText}`;

  return geminiJson<AnalyzeResumeOutput>(systemPrompt, userPrompt);
}

// ─── Skill Gap Analyzer ──────────────────────────────────────────────────────

export async function analyzeSkillGap(input: AnalyzeSkillGapInput): Promise<AnalyzeSkillGapOutput> {
  const systemPrompt = `You are an expert career advisor specializing in skill gap analysis for students seeking internships in India. Provide detailed, actionable analysis.`;

  const skillsText = input.userSkills.map(s => `${s.name} (proficiency: ${s.proficiency}/5)`).join(', ');

  const userPrompt = `Analyze the skill gap between the student's skills and the internship requirements. Return a JSON object with exactly these fields:
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

  return geminiJson<AnalyzeSkillGapOutput>(systemPrompt, userPrompt);
}

// ─── Career Coach ────────────────────────────────────────────────────────────

export async function chatWithCareerCoach(input: CareerCoachInput): Promise<CareerCoachOutput> {
  const systemPrompt = `You are an expert career advisor for Indian college students seeking internships. Provide highly personalized, actionable career guidance.`;

  const profile = input.studentProfile;
  const userPrompt = `Based on this student's profile, provide career coaching. Return a JSON object with exactly these fields:
{
  "skillAnalysis": {
    "strengths": ["strength1", "strength2"],
    "gaps": ["gap1", "gap2"]
  },
  "suggestedPaths": [
    {"path": "...", "reason": "..."}
  ],
  "learningPlan": [
    {
      "skillToLearn": "...",
      "steps": ["step1", "step2"],
      "resources": [
        {"name": "Coursera", "link": "https://coursera.org", "isFree": false}
      ]
    }
  ],
  "professionalDevelopment": {
    "resumeTips": ["tip1", "tip2"],
    "interviewPrep": ["tip1", "tip2"],
    "networkingTips": ["tip1", "tip2"]
  }
}

Student profile:
- Name: ${profile.personalInfo.name}
- Degree: ${profile.personalInfo.degree || 'Not specified'}
- Stream: ${profile.personalInfo.stream || 'Not specified'}
- Skills: ${profile.skills.map(s => `${s.name} (${s.proficiency}/5)`).join(', ')}
- Preferred domain: ${profile.preferences.domain}`;

  return geminiJson<CareerCoachOutput>(systemPrompt, userPrompt);
}

// ─── Mock Interviewer ────────────────────────────────────────────────────────

export async function startMockInterview(input: StartMockInterviewInput): Promise<StartMockInterviewOutput> {
  const systemPrompt = `You are a professional technical interviewer conducting a mock interview for an internship position. 
- Ask one focused question at a time.
- Provide constructive feedback on answers.
- After 5-6 exchanges, wrap up with a final score and feedback.
- Be encouraging but honest. Focus on the skill: ${input.skill}.
- Set "interviewFinished" to true only when you've asked 5-6 questions and given final feedback.`;

  const history = input.history || [];
  const isStart = history.length === 0;

  const userMessage = isStart
    ? `Start the mock interview for: ${input.skill}. Ask your first question.`
    : history[history.length - 1]?.content || 'Continue the interview.';

  const chatHistory = isStart ? [] : history.slice(0, -1).map(h => ({
    role: h.role as 'user' | 'model',
    content: h.content,
  }));

  const responseText = await geminiChat(
    systemPrompt + `\n\nReturn your response as JSON with these fields:
{
  "response": "your question or comment",
  "feedback": "feedback on previous answer (empty string if first question)",
  "interviewFinished": false,
  "finalScore": null,
  "overallFeedback": null,
  "improvementTips": null
}
IMPORTANT: Respond ONLY with valid JSON.`,
    chatHistory,
    userMessage,
  );

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        response: parsed.response || responseText,
        feedback: parsed.feedback || undefined,
        interviewFinished: parsed.interviewFinished || false,
        finalScore: parsed.finalScore || undefined,
        overallFeedback: parsed.overallFeedback || undefined,
        improvementTips: parsed.improvementTips || undefined,
      };
    }
  } catch {
    // fallback
  }

  return {
    response: responseText,
    feedback: undefined,
    interviewFinished: false,
  };
}

// ─── Smart Match Internships ─────────────────────────────────────────────────

export async function suggestRelevantInternships(input: SuggestRelevantInternshipsInput): Promise<SuggestRelevantInternshipsOutput> {
  const systemPrompt = `You are an AI matching engine for an internship platform. Match student profiles to internship listings based on skills, domain, and preferences.`;

  const profile = input.studentProfile;
  const listings = input.internshipListings.slice(0, 20); // Limit to avoid token limits

  const userPrompt = `Match this student to the best internships from the list. Return a JSON array:
[
  {"id": "internship_id", "matchReason": "why this is a good match", "matchPercentage": 85}
]

Return results for the top 5-8 best matches only. Sort by matchPercentage descending.

Student profile:
- Skills: ${profile.skills.map(s => `${s.name}(${s.proficiency}/5)`).join(', ')}
- Domain preference: ${profile.preferences.domain}
- Internship type: ${profile.preferences.internshipType}
- Location: ${profile.personalInfo.location}

Available internships:
${listings.map(i => `ID: ${i.id} | Title: ${i.title} | Company: ${i.company} | Domain: ${i.domain} | Skills: ${i.skills.join(', ')}`).join('\n')}`;

  const result = await geminiJson<SuggestRelevantInternshipsOutput>(systemPrompt, userPrompt);
  return Array.isArray(result) ? result : [];
}

// ─── Smart Match Candidates ──────────────────────────────────────────────────

export async function suggestSuitableCandidates(input: SuggestSuitableCandidatesInput): Promise<SuggestSuitableCandidatesOutput> {
  const systemPrompt = `You are an AI recruiter assistant helping match student candidates to internship positions. Consider skills, qualifications, and affirmative action criteria for Indian PM Internship Scheme.`;

  const students = input.studentProfiles.slice(0, 15);

  const userPrompt = `Rank these students for the internship. Return a JSON array:
[
  {"studentName": "...", "matchScore": 85, "reasons": ["reason1", "reason2"]}
]

Return top matches sorted by matchScore descending.

Internship requirements:
${input.internshipDescription}

Candidates:
${students.map(s => `Name: ${s.personalInfo.name} | Skills: ${s.skills.map(sk => sk.name).join(', ')} | Category: ${s.affirmativeAction.socialCategory} | Summary: ${s.resumeSummary}`).join('\n')}`;

  const result = await geminiJson<SuggestSuitableCandidatesOutput>(systemPrompt, userPrompt);
  return Array.isArray(result) ? result : [];
}
