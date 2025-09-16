'use client';
import { SkillGapVisualizer } from '@/components/skill-gap-visualizer';
import { Suspense } from 'react';

function SkillGapVisualizerContent() {
    return (
        <div className="container mx-auto max-w-4xl py-8">
            <SkillGapVisualizer />
        </div>
    );
}

export default function SkillGapVisualizerPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SkillGapVisualizerContent />
        </Suspense>
    );
}
