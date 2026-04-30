/**
 * Direct API client for frontend AI calls.
 * Last Build Trigger: 2026-04-30 22:30 (Force Refresh)
 */

const OPENROUTER_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

const MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemini-flash-1.5-exp:free',
  'mistralai/mistral-7b-instruct:free',
  'openrouter/auto-free'
];

const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

function getApiKey(): string {
  const key = OPENROUTER_API_KEY;
  if (!key) {
    console.error('VITE_GEMINI_API_KEY is undefined in environment');
    throw new Error('OpenRouter API key is missing. Please set VITE_GEMINI_API_KEY.');
  }
  return key;
}

const cache = new Map<string, any>();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Call OpenRouter API with retries, caching, and exponential backoff.
 */
export async function geminiJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const cacheKey = JSON.stringify({ systemPrompt, userPrompt });
  if (cache.has(cacheKey)) {
    console.log('--- AI Cache Hit ---');
    return cache.get(cacheKey) as T;
  }

  const key = getApiKey();
  const maxRetries = 2; // Retries per model

  for (const model of MODELS) {
    let delay = 1500;
    console.log(`--- Trying Model: ${model} ---`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(BASE_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'HTTP-Referer': 'https://neel-develops.github.io/India-Intern-AI/',
            'X-Title': 'PM Internship Scheme'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { 
                role: 'user', 
                content: `Instructions: ${systemPrompt}\n\nInput Data: ${userPrompt}\n\nIMPORTANT: Return ONLY a valid JSON object or array. No extra text.`
              }
            ],
            temperature: 0.1
            // Removed response_format for better compatibility with all free models
          }),
        });

        if (res.status === 429) {
          console.warn(`Rate limited (429) on ${model}. Retrying in ${delay}ms...`);
          await sleep(delay);
          delay *= 2;
          continue;
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
          console.error(`Model ${model} failed with status ${res.status}:`, err?.error?.message || res.statusText);
          break; // Try next model
        }

        const data = await res.json();
        const text: string = data?.choices?.[0]?.message?.content ?? '';
        
        if (!text) throw new Error('Empty response');

        const cleanedText = text.replace(/```json|```/g, '').trim();
        let result: T;
        try {
          result = JSON.parse(cleanedText) as T;
        } catch {
          const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          if (!jsonMatch) {
            console.error('Failed to find JSON in response:', text);
            throw new Error('No JSON found');
          }
          result = JSON.parse(jsonMatch[0]) as T;
        }

        cache.set(cacheKey, result);
        return result;

      } catch (err: any) {
        console.error(`Attempt ${attempt} for ${model} failed:`, err.message);
        if (attempt < maxRetries) {
          await sleep(delay);
          delay *= 2;
        }
      }
    }
  }
  
  throw new Error('All AI models failed or returned errors. Please check your API key quota or try again later.');
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

  // Use the most reliable free model for chat
  const model = MODELS[0];

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      content: h.content
    })),
    { role: 'user', content: userMessage }
  ];

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': 'https://neel-develops.github.io/India-Intern-AI/',
      'X-Title': 'PM Internship Scheme'
    },
    body: JSON.stringify({
      model: model,
      messages,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(`OpenRouter API error: ${err?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

