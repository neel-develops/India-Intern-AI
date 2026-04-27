

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/hooks/use-auth';
import { ThemeToggle } from '@/components/theme-toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, User, Palette, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [fontSize, setFontSize] = useState(100);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.style.fontSize = `${fontSize}%`;
    }, [fontSize]);
    
    if (loading || !user) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-3xl py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>

            {/* Account Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Account Settings</CardTitle>
                    <CardDescription>Manage your personal and security information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={user?.email || ''} readOnly disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Button variant="outline">Change Password</Button>
                    </div>
                    <Separator />
                     <div className="flex items-center justify-between">
                        <div>
                            <Label className="font-medium flex items-center gap-2"><Bell /> Notification Settings</Label>
                            <p className="text-sm text-muted-foreground">Receive email notifications for new messages and application updates.</p>
                        </div>
                        <Switch id="notifications" />
                    </div>
                </CardContent>
            </Card>

            {/* Accessibility Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette /> Accessibility</CardTitle>
                    <CardDescription>Customize the appearance of the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="font-medium">Theme</Label>
                             <p className="text-sm text-muted-foreground">Switch between light, dark, and system themes.</p>
                        </div>
                        <ThemeToggle />
                    </div>
                     <Separator />
                    <div className="space-y-4">
                        <Label htmlFor="font-size">Font Size: {fontSize}%</Label>
                        <Slider
                            id="font-size"
                            min={80}
                            max={120}
                            step={5}
                            value={[fontSize]}
                            onValueChange={(value) => setFontSize(value[0])}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Language Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe /> Language</CardTitle>
                    <CardDescription>Choose your preferred language for the interface.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Select defaultValue="en">
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi" disabled>Hindi (coming soon)</SelectItem>
                            <SelectItem value="bn" disabled>Bengali (coming soon)</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
        </div>
    );
}
