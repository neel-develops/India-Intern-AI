import { openRouterChat } from '../openrouter';
import type { CareerCoachInput } from './career-coach-types';

type MessageLike = { role: 'user' | 'model'; content: string };
type CareerCoachChatInput = CareerCoachInput & { history?: MessageLike[] };

export async function chatWithCareerCoach(input: CareerCoachChatInput): Promise<{ response: string }> {
  const profile = input.studentProfile;

  const system = `You are a professional, friendly, and encouraging AI career advisor for Indian college students seeking internships.

Student Profile:
- Name: ${profile.personalInfo.name}
- Education: ${profile.personalInfo.degree || 'Not specified'} in ${profile.personalInfo.stream || 'Not specified'}
- Skills: ${profile.skills.map((s: any) => `${s.name} (${s.proficiency}/5)`).join(', ')}
- Career Interests: ${profile.preferences?.domain || 'Not specified'}

Format your response with markdown for readability (bold headers, bullet points for lists).`;

  const history = (input.history || []).map((h: any) => ({
    role: (h.role === 'model' ? 'assistant' : 'user') as 'user' | 'assistant',
    content: h.content,
  }));

  const lastUserMsg = history.filter(h => h.role === 'user').pop()?.content
    || 'Hello, I need career guidance.';

  const historyWithoutLast = history.slice(0, -1);

  try {
    const response = await openRouterChat(system, historyWithoutLast, lastUserMsg);
    return { response };
  } catch (error: any) {
    console.error('chatWithCareerCoach error:', error.message);
    return {
      response: "I'm here to help with your career journey! Could you tell me more about what you're looking for? (AI temporarily unavailable)",
    };
  }
}
