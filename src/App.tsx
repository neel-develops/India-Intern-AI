import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/app-shell';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Internships from './pages/Internships';
import InternshipsDetails from './pages/InternshipsDetails';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import ResumeAnalyser from './pages/ResumeAnalyser';
import SkillGapVisualizer from './pages/SkillGapVisualizer';
import CareerCoach from './pages/CareerCoach';
import MockInterview from './pages/MockInterview';
import Companies from './pages/Companies';
import CompaniesDetails from './pages/CompaniesDetails';
import Eligibility from './pages/Eligibility';
import IndustryDetails from './pages/IndustryDetails';
import Notifications from './pages/Notifications';
import Recruiter from './pages/Recruiter';
import RecruiterDetails from './pages/RecruiterDetails';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/:id" element={<InternshipsDetails />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resume-analyser" element={<ResumeAnalyser />} />
        <Route path="/skill-gap-visualizer" element={<SkillGapVisualizer />} />
        <Route path="/career-coach" element={<CareerCoach />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompaniesDetails />} />
        <Route path="/eligibility" element={<Eligibility />} />
        <Route path="/industry/:id" element={<IndustryDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/recruiter" element={<Recruiter />} />
        <Route path="/recruiter/:id" element={<RecruiterDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
