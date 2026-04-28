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

const allowedOrigins = [
  'https://neel-develops.github.io',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CORS_ORIGIN,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'IndiaIntern.ai Backend API is running!' });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/analyze-resume', async (req, res) => {
  try {
    const result = await analyzeResume(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('analyze-resume error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/analyze-skill-gap', async (req, res) => {
  try {
    const result = await analyzeSkillGap(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('analyze-skill-gap error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/career-coach', async (req, res) => {
  try {
    const result = await chatWithCareerCoach(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('career-coach error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/mock-interview', async (req, res) => {
  try {
    const result = await startMockInterview(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('mock-interview error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suggest-internships', async (req, res) => {
  try {
    const result = await suggestRelevantInternships(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('suggest-internships error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suggest-candidates', async (req, res) => {
  try {
    const result = await suggestSuitableCandidates(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('suggest-candidates error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
