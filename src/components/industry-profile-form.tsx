import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building, Mail, User, Globe, Save } from 'lucide-react';
import type { IndustryProfile } from '@/lib/types';

interface IndustryProfileFormProps {
  profile: IndustryProfile | null;
  onSave: (data: IndustryProfile) => Promise<void>;
  userEmail: string;
}

export function IndustryProfileForm({ profile, onSave, userEmail }: IndustryProfileFormProps) {
  const [formData, setFormData] = useState<IndustryProfile>(
    profile || {
      name: '',
      email: userEmail,
      companyName: '',
      position: '',
      website: '',
      description: '',
    }
  );

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-violet-400" />
            Company Information
          </CardTitle>
          <CardDescription>Update your company details for candidates to see.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Infosys, TCS"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Company Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  className="pl-9"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://company.com"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">About the Company</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your company and what you do..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-violet-400" />
            Recruiter Details
          </CardTitle>
          <CardDescription>Your personal professional information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Job Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g. HR Manager, Senior Recruiter"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                className="pl-9"
                value={formData.email}
                readOnly
                disabled
              />
            </div>
            <p className="text-xs text-muted-foreground">Email is managed by your account settings.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-6 border-t">
          <Button type="submit" disabled={saving} className="rounded-full px-8">
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Saving...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />Save Profile</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
