import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

interface DialogWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export function DialogWrapper({ title, description, children, ...props }: DialogWrapperProps) {
  return (
    <DialogContent {...props}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogDescription className={description ? '' : 'sr-only'}>
        {description || 'Dialog window'}
      </DialogDescription>
      {children}
    </DialogContent>
  );
}
