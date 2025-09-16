import {genkit} from 'genkit';
import {googleAI, gemini15Pro} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: gemini15Pro,
});
