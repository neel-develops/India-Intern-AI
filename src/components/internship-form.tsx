
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PlusCircle, Trash } from 'lucide-react';
import type { Internship } from '@/lib/types';

const internshipSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  location: z.string().min(2, 'Location is required.'),
  domain: z.string().min(1, 'Domain is required.'),
  stipend: z.coerce.number().min(0, "Stipend cannot be negative.").optional(),
  duration: z.string().min(2, "Duration is required.").optional(),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  longDescription: z.string().min(50, 'Detailed description must be at least 50 characters.'),
  responsibilities: z.array(z.object({ value: z.string().min(5, 'Responsibility is required.') })).min(1),
  qualifications: z.array(z.object({ value: z.string().min(5, 'Qualification is required.') })).min(1),
  skills: z.array(z.object({ value: z.string().min(1, 'Skill is required.') })).min(1),
});

type InternshipFormValues = z.infer<typeof internshipSchema>;

interface InternshipFormProps {
  internship?: Internship;
  onSave: (data: Omit<Internship, 'id' | 'image' | 'company'>) => void;
}

export function InternshipForm({ internship, onSave }: InternshipFormProps) {
  const form = useForm<InternshipFormValues>({
    resolver: zodResolver(internshipSchema),
    defaultValues: {
      title: internship?.title || '',
      location: internship?.location || '',
      domain: internship?.domain || '',
      stipend: internship?.stipend || undefined,
      duration: internship?.duration || undefined,
      description: internship?.description || '',
      longDescription: internship?.longDescription || '',
      responsibilities: internship?.responsibilities.map(r => ({ value: r })) || [{ value: '' }],
      qualifications: internship?.qualifications.map(q => ({ value: q })) || [{ value: '' }],
      skills: internship?.skills.map(s => ({ value: s })) || [{ value: '' }],
    },
  });

  const { fields: respFields, append: appendResp, remove: removeResp } = useFieldArray({
    control: form.control,
    name: "responsibilities",
  });
   const { fields: qualFields, append: appendQual, remove: removeQual } = useFieldArray({
    control: form.control,
    name: "qualifications",
  });
   const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: "skills",
  });


  function onSubmit(data: InternshipFormValues) {
    const formattedData = {
        ...data,
        responsibilities: data.responsibilities.map(r => r.value),
        qualifications: data.qualifications.map(q => q.value),
        skills: data.skills.map(s => s.value),
    };
    onSave(formattedData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internship Title</FormLabel>
                  <FormControl><Input placeholder="e.g. Frontend Developer Intern" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Input placeholder="e.g. Mumbai, Remote" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Domain</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a domain" /></SelectTrigger></FormControl>
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
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="stipend"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Monthly Stipend (INR)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g. 25000" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl><Input placeholder="e.g. 6 Months" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl><Textarea placeholder="A brief, one-paragraph summary of the role." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl><Textarea placeholder="A full description of the internship, company, and team." rows={5} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Responsibilities</FormLabel>
              {respFields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`responsibilities.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2 mt-2">
                            <Input {...field} placeholder={`Responsibility #${index + 1}`} />
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeResp(index)} disabled={respFields.length <= 1}><Trash className="h-4 w-4" /></Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendResp({ value: "" })}><PlusCircle className="mr-2 h-4 w-4" />Add Responsibility</Button>
            </div>

            <div>
              <FormLabel>Qualifications</FormLabel>
              {qualFields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`qualifications.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2 mt-2">
                            <Input {...field} placeholder={`Qualification #${index + 1}`} />
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeQual(index)} disabled={qualFields.length <= 1}><Trash className="h-4 w-4" /></Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendQual({ value: "" })}><PlusCircle className="mr-2 h-4 w-4" />Add Qualification</Button>
            </div>

            <div>
              <FormLabel>Skills Required</FormLabel>
               <FormDescription>List the key skills required for this role.</FormDescription>
              {skillFields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`skills.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2 mt-2">
                            <Input {...field} placeholder={`Skill #${index + 1}`} />
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeSkill(index)} disabled={skillFields.length <= 1}><Trash className="h-4 w-4" /></Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendSkill({ value: "" })}><PlusCircle className="mr-2 h-4 w-4" />Add Skill</Button>
            </div>
            
          </CardContent>
        </Card>

        <Button type="submit" size="lg">Save Internship</Button>
      </form>
    </Form>
  );
}
