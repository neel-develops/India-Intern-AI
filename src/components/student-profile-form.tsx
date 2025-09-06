
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { StudentProfile } from '@/lib/types';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { universities } from '@/lib/universities';
import { Separator } from '@/components/ui/separator';


const profileSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    age: z.coerce.number().min(21, "Must be at least 21").max(24, "Must be at most 24"),
    email: z.string().email('Invalid email address.'),
    location: z.string().min(2, 'Location is required.'),
    linkedin: z.string().url().optional().or(z.literal('')),
    university: z.string().optional(),
    degree: z.string().min(2, "Degree is required."),
    stream: z.string().min(2, "Stream is required."),
    graduatingYear: z.coerce.number().min(new Date().getFullYear(), "Year must be in the future.").max(new Date().getFullYear() + 5, "Year seems too far in the future."),
  }),
  skills: z.string().min(1, 'Please list at least one skill.'),
  preferences: z.object({
    domain: z.string().min(1, 'Domain preference is required.'),
    internshipType: z.string().min(1, 'Internship type is required.'),
  }),
  resumeSummary: z.string().min(50, 'Resume summary must be at least 50 characters.'),
  resumeFile: z.any().optional(),
  eligibility: z.object({
    isNotEmployedFullTime: z.boolean().refine(val => val === true, { message: 'You must not be employed full-time.' }),
    isNotEnrolledFullTime: z.boolean().refine(val => val === true, { message: 'You must not be enrolled full-time.' }),
    familyIncome: z.coerce.number().max(799999, 'Family income must be less than 8 Lakhs PA.'),
    hasNoGovtJobFamily: z.boolean().refine(val => val === true, { message: 'No family member should have a government job.' }),
    experienceMonths: z.coerce.number().min(12, 'At least 12 months of experience is required.'),
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface StudentProfileFormProps {
  profile: StudentProfile | null;
  onSave: (data: StudentProfile) => void;
}

export function StudentProfileForm({ profile, onSave }: StudentProfileFormProps) {
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      personalInfo: {
        name: profile?.personalInfo.name || '',
        age: profile?.personalInfo.age || 21,
        email: profile?.personalInfo.email || '',
        location: profile?.personalInfo.location || '',
        linkedin: profile?.personalInfo.linkedin || '',
        university: profile?.personalInfo.university || '',
        degree: profile?.personalInfo.degree || '',
        stream: profile?.personalInfo.stream || '',
        graduatingYear: profile?.personalInfo.graduatingYear || new Date().getFullYear() + 1,
      },
      skills: profile?.skills.join(', ') || '',
      preferences: {
        domain: profile?.preferences.domain || '',
        internshipType: profile?.preferences.internshipType || '',
      },
      resumeSummary: profile?.resumeSummary || '',
      eligibility: {
          isNotEmployedFullTime: profile?.eligibility.isNotEmployedFullTime || false,
          isNotEnrolledFullTime: profile?.eligibility.isNotEnrolledFullTime || false,
          familyIncome: profile?.eligibility.familyIncome || 0,
          hasNoGovtJobFamily: profile?.eligibility.hasNoGovtJobFamily || false,
          experienceMonths: profile?.eligibility.experienceMonths || 0,
      },
    },
  });

  function onSubmit(data: ProfileFormValues) {
    const newProfile: StudentProfile = {
      ...data,
      skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
      resumeFilename: (data.resumeFile as FileList)?.[0]?.name,
    };
    onSave(newProfile);
    toast({
      title: 'Profile Saved',
      description: 'Your profile has been updated successfully.',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal & Academic Information</CardTitle>
            <CardDescription>This information will be visible to recruiters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="personalInfo.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Priya Sharma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="personalInfo.age"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="22" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="personalInfo.email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="priya.sharma@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="personalInfo.location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Mumbai, India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="personalInfo.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="personalInfo.degree"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Bachelor of Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="personalInfo.stream"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Stream / Major</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="personalInfo.graduatingYear"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Graduating Year</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g. 2025" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="personalInfo.university"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>University / College</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? universities.find(
                                (uni) => uni === field.value
                              )
                            : "Select your university"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                      <Command>
                        <CommandInput placeholder="Search university..." />
                        <CommandEmpty>No university found.</CommandEmpty>
                        <CommandGroup>
                          {universities.map((uni) => (
                            <CommandItem
                              value={uni}
                              key={uni}
                              onSelect={() => {
                                form.setValue("personalInfo.university", uni);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  uni === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {uni}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Preferences</CardTitle>
            <CardDescription>Help us find the best matches for you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. React, Python, Figma" {...field} />
                  </FormControl>
                  <FormDescription>Enter skills separated by commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="preferences.domain"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Preferred Domain</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a domain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                           <SelectItem value="Agriculture">Agriculture</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="preferences.internshipType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Internship Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="resumeSummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume Summary</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief summary of your experience and career goals..." rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="resumeFile"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Upload Resume</FormLabel>
                    <FormControl>
                    <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormDescription>Upload your resume in PDF format.</FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
                <CardDescription>Please confirm you meet the following criteria for the PM Internship Scheme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="eligibility.experienceMonths"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Months of Professional Experience</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g. 18" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="eligibility.familyIncome"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Annual Family Income (in INR)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g. 500000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="eligibility.isNotEmployedFullTime"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>I am not currently employed full-time.</FormLabel>
                        </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="eligibility.isNotEnrolledFullTime"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>I am not currently enrolled full-time in an educational institution.</FormLabel>
                        </div>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="eligibility.hasNoGovtJobFamily"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>No member of my immediate family holds a government job.</FormLabel>
                        </div>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Button type="submit" size="lg">Save Profile</Button>
      </form>
    </Form>
  );
}
