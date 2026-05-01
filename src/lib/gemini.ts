/**
 * Direct API client for frontend AI calls.
 * Last Build Trigger: 2026-05-01 11:30 (Model ID Fix)
 */

const OPENROUTER_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

const MODELS = [
  'openrouter/free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemini-flash-1.5-8b:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free'
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
 * Call OpenRouter API with retries, model rotation, and exponential backoff.
 */
export async function geminiJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const cacheKey = JSON.stringify({ systemPrompt, userPrompt });
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) as T;
  }

  const key = getApiKey();
  const maxRetriesPerModel = 1; 

  for (const model of MODELS) {
    let delay = 1000;
    console.log(`--- AI Request: Trying ${model} ---`);

    for (let attempt = 0; attempt <= maxRetriesPerModel; attempt++) {
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
          }),
        });

        if (res.status === 429) {
          console.warn(`Rate limited (429) on ${model}. Switching model or retrying...`);
          if (attempt < maxRetriesPerModel) {
            await sleep(delay);
            delay *= 2;
            continue;
          }
          break; // Try next model
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
          const msg = err?.error?.message || res.statusText;
          console.error(`Model ${model} failed (${res.status}):`, msg);
          if (msg.includes('Provider returned error') || res.status === 400 || res.status === 500) {
            break; // Upstream failure, try next model
          }
          throw new Error(msg);
        }

        const data = await res.json();
        const text: string = data?.choices?.[0]?.message?.content ?? '';
        
        if (!text) throw new Error('Empty response from AI');

        const cleanedText = text.replace(/```json|```/g, '').trim();
        let result: T;
        try {
          result = JSON.parse(cleanedText) as T;
        } catch {
          const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          if (!jsonMatch) throw new Error('AI response did not contain valid JSON');
          result = JSON.parse(jsonMatch[0]) as T;
        }

        cache.set(cacheKey, result);
        return result;

      } catch (err: any) {
        console.error(`Error with ${model}:`, err.message);
        if (attempt < maxRetriesPerModel) {
          await sleep(delay);
          delay *= 2;
        }
      }
    }
  }
  
  throw new Error('OpenRouter API error: All available free models are currently busy or rate-limited. Please try again in a few minutes.');
}

/**
 * Call OpenRouter for a conversational chat response with model rotation.
 */
export async function geminiChat(
  systemPrompt: string,
  history: { role: 'user' | 'model'; content: string }[],
  userMessage: string,
): Promise<string> {
  const key = getApiKey();
  
  // Try models in rotation for chat too
  for (const model of MODELS) {
    try {
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

      if (res.status === 429 || !res.ok) {
        console.warn(`Chat model ${model} failed (${res.status}). Trying next...`);
        continue;
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) return content;
    } catch (err) {
      console.error(`Chat error with ${model}, trying next...`);
    }
  }

  throw new Error('OpenRouter API error: Service is temporarily unavailable. Please try again later.');
}

