import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/app-shell';

// Eagerly loaded (always needed)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazily loaded (only when visited)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Internships = lazy(() => import('./pages/Internships'));
const InternshipsDetails = lazy(() => import('./pages/InternshipsDetails'));
const Applications = lazy(() => import('./pages/Applications'));
const Profile = lazy(() => import('./pages/Profile'));
const ResumeAnalyser = lazy(() => import('./pages/ResumeAnalyser'));
const SkillGapVisualizer = lazy(() => import('./pages/SkillGapVisualizer'));
const CareerCoach = lazy(() => import('./pages/CareerCoach'));
const MockInterview = lazy(() => import('./pages/MockInterview'));
const Companies = lazy(() => import('./pages/Companies'));
const CompaniesDetails = lazy(() => import('./pages/CompaniesDetails'));
const Eligibility = lazy(() => import('./pages/Eligibility'));
const IndustryDetails = lazy(() => import('./pages/IndustryDetails'));
const Notifications = lazy(() => import('./pages/Notifications'));
const SavedInternships = lazy(() => import('./pages/SavedInternships'));
const Settings = lazy(() => import('./pages/Settings'));

// Recruiter pages
const Recruiter = lazy(() => import('./pages/Recruiter'));
const RecruiterDetails = lazy(() => import('./pages/RecruiterDetails'));
const RecruiterInternships = lazy(() => import('./pages/recruiter/RecruiterInternships'));
const RecruiterPostNew = lazy(() => import('./pages/recruiter/RecruiterPostNew'));
const RecruiterApplicants = lazy(() => import('./pages/recruiter/RecruiterApplicants'));
const RecruiterCandidates = lazy(() => import('./pages/recruiter/RecruiterCandidates'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes outside AppShell */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All routes inside AppShell (sidebar + header) */}
        {/* ── Student Routes ── */}
        <Route element={<AppShell allowedRole="student" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/internships/:id" element={<InternshipsDetails />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/saved" element={<SavedInternships />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/resume-analyser" element={<ResumeAnalyser />} />
          <Route path="/skill-gap-visualizer" element={<SkillGapVisualizer />} />
          <Route path="/career-coach" element={<CareerCoach />} />
          <Route path="/mock-interview" element={<MockInterview />} />
        </Route>

        {/* ── Recruiter Routes ── */}
        <Route element={<AppShell allowedRole="industry" />}>
          <Route path="/recruiter" element={<Recruiter />} />
          <Route path="/recruiter/:id" element={<RecruiterDetails />} />
          <Route path="/recruiter/internships" element={<RecruiterInternships />} />
          <Route path="/recruiter/internships/new" element={<RecruiterPostNew />} />
          <Route path="/recruiter/internships/:id/edit" element={<RecruiterPostNew />} />
          <Route path="/recruiter/internships/:id/applicants" element={<RecruiterApplicants />} />
          <Route path="/recruiter/candidates" element={<RecruiterCandidates />} />
        </Route>

        {/* ── Public / Shared ── */}
        <Route element={<AppShell />}>
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompaniesDetails />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/industry/:id" element={<IndustryDetails />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
