

import { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Application, StudentProfile } from '@/lib/types';
import { studentProfiles } from '@/lib/data';
import { internships } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ClientOnly } from './client-only';

type PipelineStage = 'Applied' | 'In Review' | 'Interview' | 'Offered' | 'Rejected';

const stages: PipelineStage[] = ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'];

interface Applicant {
  id: string;
  applicationId: string;
  name: string;
  email: string;
  avatar: string;
  skills: string[];
}

// Helper to get initials for avatar
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

export function RecruitmentPipeline() {
  const [selectedInternshipId, setSelectedInternshipId] = useState<string>(internships[0]?.id || '');
  const [columns, setColumns] = useState<Record<PipelineStage, Applicant[]>>({
    Applied: [],
    'In Review': [],
    Interview: [],
    Offered: [],
    Rejected: [],
  });

  useEffect(() => {
    if (!selectedInternshipId) return;

    // Simulate fetching applicants for the selected internship
    // In a real app, this would be an API call
    const simulatedApplicants = studentProfiles.slice(0, 10).map((profile, index) => ({
        ...profile,
        application: {
            id: `app-${index}-${selectedInternshipId}`,
            internshipId: selectedInternshipId,
            studentEmail: profile.personalInfo.email,
            status: stages[index % stages.length],
            appliedDate: new Date().toISOString(),
        }
    }));
    
    const applicantsByStage = stages.reduce((acc, stage) => {
        acc[stage] = simulatedApplicants
            .filter(p => p.application.status === stage)
            .map(p => ({
                id: p.personalInfo.email,
                applicationId: p.application.id,
                name: p.personalInfo.name,
                email: p.personalInfo.email,
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${p.personalInfo.name}`,
                skills: p.skills.slice(0, 3).map(s => s.name),
            }));
        return acc;
    }, {} as Record<PipelineStage, Applicant[]>);

    setColumns(applicantsByStage);
  }, [selectedInternshipId]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId as PipelineStage];
    const destColumn = columns[destination.droppableId as PipelineStage];
    const [movedItem] = sourceColumn.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
        sourceColumn.splice(destination.index, 0, movedItem);
    } else {
        destColumn.splice(destination.index, 0, movedItem);
    }

    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });
    
    // Here you would typically make an API call to update the application status in your database
  };

  return (
    <div className="space-y-4">
        <Card>
            <CardContent className="p-4">
                <label className="text-sm font-medium">Select Internship to View Pipeline</label>
                <Select value={selectedInternshipId} onValueChange={setSelectedInternshipId}>
                    <SelectTrigger className="w-full md:w-[400px]">
                        <SelectValue placeholder="Select an internship..." />
                    </SelectTrigger>
                    <SelectContent>
                        {internships.map(internship => (
                            <SelectItem key={internship.id} value={internship.id}>
                                {internship.title} - {internship.company}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>
      <ClientOnly>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
            {stages.map(stage => (
              <Droppable key={stage} droppableId={stage}>
                {(provided, snapshot) => (
                  <Card 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className={`flex flex-col ${snapshot.isDraggingOver ? 'bg-accent' : 'bg-muted/40'}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{stage} ({columns[stage]?.length || 0})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 min-h-[200px]">
                      {columns[stage]?.map((applicant, index) => (
                        <Draggable key={applicant.applicationId} draggableId={applicant.applicationId} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 rounded-lg bg-card shadow ${snapshot.isDragging ? 'ring-2 ring-primary' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <p className="font-semibold text-sm">{applicant.name}</p>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-4 w-4"/></button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Send Test</DropdownMenuItem>
                                        <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {applicant.skills.map(skill => (
                                  <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </CardContent>
                  </Card>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </ClientOnly>
    </div>
  );
}
