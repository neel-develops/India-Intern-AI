
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { IndustryProfile } from '@/lib/types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email(),
  position: z.string().min(2, 'Position is required.'),
  companyName: z.string().min(2, 'Company name is required.'),
  website: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  description: z.string().min(20, 'Description must be at least 20 characters.').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface CompanyProfileFormProps {
  profile: IndustryProfile | null;
  onSave: (data: IndustryProfile) => void;
}

export function CompanyProfileForm({ profile, onSave }: CompanyProfileFormProps) {
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      email: profile?.email || '',
      position: profile?.position || '',
      companyName: profile?.companyName || '',
      website: profile?.website || '',
      description: profile?.description || '',
    },
  });

  function onSubmit(data: ProfileFormValues) {
    onSave(data);
    toast({
      title: 'Profile Saved',
      description: 'Your company profile has been updated.',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl><Input placeholder="e.g. Anjali Verma" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Position</FormLabel>
                    <FormControl><Input placeholder="e.g. HR Manager" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Email</FormLabel>
                  <FormControl><Input readOnly disabled className="bg-muted" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>This information will be visible to students on your company page and internship listings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl><Input placeholder="Your Company Inc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl><Input placeholder="https://yourcompany.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About the Company</FormLabel>
                  <FormControl><Textarea placeholder="Describe your company, its mission, and culture." rows={5} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Button type="submit" size="lg">Save Changes</Button>
      </form>
    </Form>
  );
}
