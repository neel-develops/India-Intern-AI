const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function apiCall(endpoint: string, data: any) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API call failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call Error (${endpoint}):`, error);
    throw error;
  }
}

export const analyzeResume = (data: any) => apiCall('/analyze-resume', data);
export const analyzeSkillGap = (data: any) => apiCall('/analyze-skill-gap', data);
export const chatWithCareerCoach = (data: any) => apiCall('/career-coach', data);
export const startMockInterview = (data: any) => apiCall('/mock-interview', data);
export const suggestRelevantInternships = (data: any) => apiCall('/suggest-internships', data);
export const suggestSuitableCandidates = (data: any) => apiCall('/suggest-candidates', data);
