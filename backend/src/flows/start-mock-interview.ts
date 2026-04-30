import { openRouterJson } from '../openrouter';
import type { StartMockInterviewInput, StartMockInterviewOutput } from './start-mock-interview-types';

export async function startMockInterview(
  input: StartMockInterviewInput,
): Promise<StartMockInterviewOutput> {
  const history = input.history || [];
  const isStart = history.length === 0;
  const questionCount = history.filter((h: any) => h.role === 'model').length;
  const isFinishing = questionCount >= 5;

  const system = `You are a professional technical interviewer conducting a mock interview for the PM Internship Scheme.
Interview topic: ${input.skill}
Total questions: 5 (gradually increasing in difficulty)
${isFinishing ? 'The interview is now complete. Give final evaluation.' : 'Ask one focused question at a time. Provide brief feedback on the previous answer before your next question.'}
IMPORTANT: Respond ONLY with valid JSON.`;

  const historyText = history.map((h: any) => `${h.role}: ${h.content}`).join('\n');

  const user = `${isStart ? `Start the mock interview for: ${input.skill}. Greet the candidate and ask your first question.` : `Continue based on this conversation history:\n${historyText}`}

Return a JSON object with EXACTLY these fields:
{
  "response": "your question or closing statement",
  "feedback": "feedback on previous answer (empty string if first question)",
  "interviewFinished": ${isFinishing},
  "finalScore": ${isFinishing ? 'a number 0-10' : 'null'},
  "overallFeedback": ${isFinishing ? '"paragraph summary"' : 'null'},
  "improvementTips": ${isFinishing ? '["tip1", "tip2"]' : 'null'}
}`;

  try {
    return await openRouterJson<StartMockInterviewOutput>(system, user);
  } catch (error: any) {
    console.error('startMockInterview error:', error.message);
    return {
      response: isStart
        ? `Welcome! Let's begin your mock interview on ${input.skill}. Can you start by explaining what ${input.skill} means to you?`
        : 'Thank you for your answer! Here is the next question: Can you describe a challenge you solved using your skills?',
      feedback: '',
      interviewFinished: false,
    };
  }
}
