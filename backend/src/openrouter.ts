/**
 * Shared OpenRouter API client for the backend.
 * Replaces @genkit-ai/googleai — uses the same key as the frontend.
 */

const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'mistralai/mistral-7b-instruct:free';

function getKey(): string {
  const key = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY environment variable is not set.');
  return key;
}

export async function openRouterJson<T>(
  systemPrompt: string,
  userPrompt: string,
): Promise<T> {
  const key = getKey();

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://neel-develops.github.io',
      'X-Title': 'PM Internship Scheme',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            systemPrompt +
            '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no backticks, no extra text.',
        },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(`OpenRouter error: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? '';

  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error(`Non-JSON response from model: ${text.slice(0, 300)}`);
  }
}

export async function openRouterChat(
  systemPrompt: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  userMessage: string,
): Promise<string> {
  const key = getKey();

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://neel-develops.github.io',
      'X-Title': 'PM Internship Scheme',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: userMessage },
      ],
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(`OpenRouter error: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}
