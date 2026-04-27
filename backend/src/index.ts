import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeResume } from './flows/analyze-resume';
import { analyzeSkillGap } from './flows/analyze-skill-gap';
import { chatWithCareerCoach } from './flows/career-coach';
import { startMockInterview } from './flows/start-mock-interview';
import { suggestRelevantInternships } from './flows/suggest-relevant-internships';
import { suggestSuitableCandidates } from './flows/suggest-suitable-candidates';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('IndiaIntern.ai Backend API is running!');
});

app.post('/api/analyze-resume', async (req, res) => {
  try {
    const result = await analyzeResume(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/analyze-skill-gap', async (req, res) => {
  try {
    const result = await analyzeSkillGap(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/career-coach', async (req, res) => {
  try {
    const result = await chatWithCareerCoach(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/mock-interview', async (req, res) => {
  try {
    const result = await startMockInterview(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suggest-internships', async (req, res) => {
  try {
    const result = await suggestRelevantInternships(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suggest-candidates', async (req, res) => {
  try {
    const result = await suggestSuitableCandidates(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
