import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { toast } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

interface FlashProps {
  success?: string;
  error?: string;
  [key: string]: string | undefined
}

interface PageProps {
  flash: FlashProps
  [key: string]: unknown
}

export default function ({ children, breadcrumbs, ...props }: AppLayoutProps) {
  const { flash } = usePage<PageProps>().props
  const prevFlashRef = useRef<FlashProps>({})

  useEffect(() => {
    const prevFlash = prevFlashRef.current;

    if (flash) {
      if (flash.success && flash.success !== prevFlash.success) {
        toast.success(flash.success, {
          closeButton: true,
          duration: 3000,
          position: 'top-right',
        });
      }

      if (flash.error && flash.error !== prevFlash.error) {
        toast.error(flash.error, {
          closeButton: true,
          duration: 3000,
          position: 'top-right',
        });
      }
    }
    prevFlashRef.current = flash
  }, [flash]);
  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
      <Toaster />
    </AppLayoutTemplate>
  )
};
