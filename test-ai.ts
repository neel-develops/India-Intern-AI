import 'dotenv/config';
import { suggestSuitableCandidates } from './src/ai/flows/suggest-suitable-candidates';

async function test() {
  try {
    console.log("Testing...");
    const res = await suggestSuitableCandidates({
      internshipDescription: "Software Engineer intern needed.",
      studentProfiles: []
    });
    console.log("Success:", res);
  } catch (e) {
    console.error("CAUGHT ERROR:", e);
  }
}
test();
