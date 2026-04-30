/**
 * Direct Gemini API client for frontend AI calls.
 * Calls the Gemini REST API directly — no backend server required.
 */

// Primary: from env (local dev). Fallback: hardcoded for production builds
// where VITE_ vars may not be available at build time.
const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) || '';

const MODEL = 'gemini-2.0-flash';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}`;

function getApiKey(): string {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
  }
  return GEMINI_API_KEY;
}

/**
 * Call Gemini generateContent endpoint and expect a JSON response.
 * The prompt should instruct the model to return valid JSON.
 */
export async function geminiJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const key = getApiKey();
  const url = `${BASE_URL}:generateContent?key=${key}`;

  const body = {
    contents: [
      { role: 'user', parts: [{ text: userPrompt }] },
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt + '\n\nIMPORTANT: Respond ONLY with valid JSON. Do not include markdown code blocks, backticks, or any text outside the JSON object.' }],
    },
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    const msg = err?.error?.message || res.statusText;
    throw new Error(`Gemini API error: ${msg}`);
  }

  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  
  try {
    return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON from text if model added extra text
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]) as T;
    throw new Error(`Gemini returned non-JSON response: ${text.slice(0, 200)}`);
  }
}

/**
 * Call Gemini for a conversational chat response (plain text).
 */
export async function geminiChat(
  systemPrompt: string,
  history: { role: 'user' | 'model'; content: string }[],
  userMessage: string,
): Promise<string> {
  const key = getApiKey();
  const url = `${BASE_URL}:generateContent?key=${key}`;

  const contents = [
    ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 4096,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(`Gemini API error: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}
