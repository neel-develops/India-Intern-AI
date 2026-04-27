

import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LandingContent } from '@/components/landing-content';

export default function HomePage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading IndiaIntern.ai...</div>
            </div>
        );
    }
    
    // While redirecting, don't flash content
    if (user) return null;

    return <LandingContent />;
}
