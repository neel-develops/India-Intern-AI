import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './hooks/use-auth';
import { StudentProfileProvider } from './hooks/use-student-profile';
import { IndustryProfileProvider } from './hooks/use-industry-profile';
import { NotificationsProvider } from './hooks/use-notifications';
import { Toaster } from './components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <StudentProfileProvider>
          <IndustryProfileProvider>
            <NotificationsProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <App />
                <Toaster />
              </ThemeProvider>
            </NotificationsProvider>
          </IndustryProfileProvider>
        </StudentProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
