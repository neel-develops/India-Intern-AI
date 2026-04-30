/**
 * Direct API client for frontend AI calls.
 * Last Build Trigger: 2026-04-30 21:50
 */

const OPENROUTER_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

const MODEL = 'mistralai/mistral-7b-instruct:free';
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

function getApiKey(): string {
  const key = OPENROUTER_API_KEY;
  if (!key) {
    console.error('VITE_GEMINI_API_KEY is undefined in environment');
    throw new Error('OpenRouter API key is missing. Please set VITE_GEMINI_API_KEY.');
  }
  // Safe debug log for the user to verify key presence
  console.log('Using OpenRouter Key starting with:', key.slice(0, 8) + '...', '(length: ' + key.length + ')');
  return key;
}

/**
 * Call OpenRouter API and expect a JSON response.
 * We prompt the Gemma model to return only valid JSON.
 */
export async function geminiJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const key = getApiKey();

  const body = {
    model: MODEL,
    messages: [
      { 
        role: 'user', 
        content: `Instructions: ${systemPrompt}\n\nInput Data: ${userPrompt}`
      }
    ],
    temperature: 0.1,
    max_tokens: 1000
  };

  console.log('--- AI Request Started ---');
  console.log('Model:', MODEL);

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': window.location.href, // Required by OpenRouter
      'X-Title': 'PM Internship Scheme' // Optional, for OpenRouter analytics
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    const msg = err?.error?.message || res.statusText;
    throw new Error(`OpenRouter API error: ${msg}`);
  }

  const data = await res.json();
  console.log('Full OpenRouter Response:', data);
  const text: string = data?.choices?.[0]?.message?.content ?? '';
  
  // Debug log to see exactly what the AI is saying
  console.log('Raw AI Response:', text);
  
  try {
    // Clean common model artifacts like markdown code blocks
    const cleanedText = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedText) as T;
  } catch {
    // Fallback: extract anything that looks like JSON
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]) as T;
    throw new Error(`Model returned non-JSON response: ${text.slice(0, 200)}`);
  }
}

/**
 * Call OpenRouter for a conversational chat response (plain text).
 */
export async function geminiChat(
  systemPrompt: string,
  history: { role: 'user' | 'model'; content: string }[],
  userMessage: string,
): Promise<string> {
  const key = getApiKey();

  // Map Gemini roles to OpenAI roles (model -> assistant)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      content: h.content
    })),
    { role: 'user', content: userMessage }
  ];

  const body = {
    model: MODEL,
    messages,
    temperature: 0.8,
  };

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': window.location.href,
      'X-Title': 'PM Internship Scheme'
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(`OpenRouter API error: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}
