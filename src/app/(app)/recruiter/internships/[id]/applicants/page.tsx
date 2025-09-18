
'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { internships, studentProfiles } from '@/lib/data';
import { applications as allApplications } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, ChevronDown, Download, Filter, Search, User, Briefcase } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ApplicantsPage() {
  const params = useParams();
  const { id: internshipId } = params;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  const internship = internships.find(i => i.id === internshipId);

  // For prototype: simulate applicants by linking some students to this internship
  const applicants = useMemo(() => {
    return studentProfiles.slice(0, 8).map((profile, index) => ({
      student: profile,
      application: {
        id: `app-${index}`,
        internshipId: internshipId as string,
        studentEmail: profile.personalInfo.email,
        status: ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'][index % 5] as any,
        appliedDate: new Date(2023, 10, 15 + index).toISOString(),
      }
    }));
  }, [internshipId]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      const nameMatch = app.student.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'all' || app.application.status === statusFilter;
      const skillMatch = skillFilter === 'all' || !skillFilter || app.student.skills.some(s => s.name.toLowerCase().includes(skillFilter.toLowerCase()));
      return nameMatch && statusMatch && skillMatch;
    });
  }, [applicants, searchTerm, statusFilter, skillFilter]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? filteredApplicants.map(app => app.application.id) : []);
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  }
  
  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    applicants.forEach(app => app.student.skills.forEach(s => skillSet.add(s.name)));
    return Array.from(skillSet);
  }, [applicants]);

  if (!internship) {
    return <div>Internship not found.</div>;
  }
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <div>
          <h1 className="text-3xl font-bold tracking-tight">Applicants for {internship.title}</h1>
          <p className="text-muted-foreground">Manage and track candidates for this internship.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search by name..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="In Review">In Review</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Offered">Offered</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
         <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            {allSkills.map(skill => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="sm" disabled={selectedRows.length === 0}>
                <Briefcase className="mr-2 h-4 w-4" />
                Move to Next Stage
            </Button>
            <Button variant="outline" size="sm" disabled={selectedRows.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export List
            </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectedRows.length === filteredApplicants.length && filteredApplicants.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.map(app => (
                <TableRow key={app.application.id}>
                  <TableCell>
                    <Checkbox
                        checked={selectedRows.includes(app.application.id)}
                        onCheckedChange={(checked) => handleSelectRow(app.application.id, !!checked)}
                     />
                  </TableCell>
                  <TableCell className="font-medium">
                     <Link href={`/recruiter/internships/${internshipId}/applicants/${encodeURIComponent(app.student.personalInfo.email)}`} className="hover:underline">
                      {app.student.personalInfo.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                        {app.student.skills.slice(0, 3).map(s => <Badge key={s.name} variant="secondary">{s.name}</Badge>)}
                        {app.student.skills.length > 3 && <Badge variant="outline">+{app.student.skills.length - 3}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(app.application.appliedDate).toLocaleDateString()}</TableCell>
                  <TableCell><Badge>{app.application.status}</Badge></TableCell>
                   <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                       <Link href={`/recruiter/internships/${internshipId}/applicants/${encodeURIComponent(app.student.personalInfo.email)}`}>
                        <User className="mr-2 h-4 w-4"/> View Profile
                       </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredApplicants.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
                No applicants found matching your criteria.
            </div>
        )}
      </div>
    </div>
  );
}
