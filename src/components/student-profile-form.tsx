
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown, PlusCircle, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { universities } from '@/lib/universities';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

const profileSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    age: z.coerce.number().min(18).max(30),
    email: z.string().email('Invalid email address.'),
    location: z.string().min(2, 'Location is required.'),
    linkedin: z.string().url().optional().or(z.literal('')),
    university: z.string().min(2, "University is required."),
    degree: z.string().min(2, "Degree is required."),
    stream: z.string().min(2, "Stream is required."),
    graduatingYear: z.coerce.number(),
  }),
  skills: z.array(z.object({
    name: z.string().min(1, "Skill name is required."),
    proficiency: z.number().min(1).max(5),
    certificate: z.string().url().optional().or(z.literal('')),
  })).min(1, "Please add at least one skill."),
  preferences: z.object({
    domain: z.string().min(1, 'Domain preference is required.'),
    internshipType: z.string().min(1, 'Internship type is required.'),
    otherDomain: z.string().optional(),
  }),
  resumeSummary: z.string().min(50, 'Resume summary must be at least 50 characters.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface StudentProfileFormProps {
  profile: StudentProfile | null;
  onSave: (data: StudentProfile) => void;
  userEmail: string;
}

export function StudentProfileForm({ profile, onSave, userEmail }: StudentProfileFormProps) {
  const { toast } = useToast();
  const [openUniversityPopover, setOpenUniversityPopover] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      personalInfo: {
        name: profile?.personalInfo.name || '',
        age: profile?.personalInfo.age || 21,
        email: profile?.personalInfo.email || userEmail,
        location: profile?.personalInfo.location || '',
        linkedin: profile?.personalInfo.linkedin || '',
        university: profile?.personalInfo.university || '',
        degree: profile?.personalInfo.degree || '',
        stream: profile?.personalInfo.stream || '',
        graduatingYear: profile?.personalInfo.graduatingYear || new Date().getFullYear() + 1,
      },
      skills: profile?.skills || [{ name: '', proficiency: 3, certificate: '' }],
      preferences: {
        domain: profile?.preferences.domain || '',
        internshipType: profile?.preferences.internshipType || '',
        otherDomain: profile?.preferences.otherDomain || '',
      },
      resumeSummary: profile?.resumeSummary || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  function onSubmit(data: ProfileFormValues) {
    onSave(data as StudentProfile);
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
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your basic contact and identity details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="personalInfo.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="e.g. Priya Sharma" {...field} /></FormControl>
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
                    <FormControl><Input type="number" {...field} /></FormControl>
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
                    <FormControl><Input type="email" readOnly {...field} className="bg-muted" /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Academic Information</CardTitle></CardHeader>
           <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="personalInfo.university"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>University</FormLabel>
                  <Popover open={openUniversityPopover} onOpenChange={setOpenUniversityPopover}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                          {field.value || "Select university"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandEmpty>No university found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-y-auto">
                          {universities.map((uni) => (
                            <CommandItem key={uni} onSelect={() => { form.setValue("personalInfo.university", uni); setOpenUniversityPopover(false); }}>
                              <Check className={cn("mr-2 h-4 w-4", uni === field.value ? "opacity-100" : "opacity-0")} />
                              {uni}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Skills & Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
              {fields.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex gap-4">
                    <FormField control={form.control} name={`skills.${index}.name`} render={({ field }) => (
                      <FormItem className="flex-grow"><FormLabel>Skill</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="mt-8"><Trash className="h-4 w-4" /></Button>
                  </div>
                  <FormField control={form.control} name={`skills.${index}.proficiency`} render={({ field }) => (
                    <FormItem><FormLabel>Proficiency (1-5)</FormLabel><FormControl><Slider min={1} max={5} step={1} value={[field.value]} onValueChange={v => field.onChange(v[0])} /></FormControl></FormItem>
                  )} />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => append({ name: "", proficiency: 3 })}><PlusCircle className="mr-2 h-4 w-4" />Add Skill</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
          <CardContent>
             <FormField control={form.control} name="resumeSummary" render={({ field }) => (
                <FormItem><FormLabel>Professional Summary</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl></FormItem>
             )} />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full md:w-auto">Save Profile</Button>
      </form>
    </Form>
  );
}
