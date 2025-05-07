import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: '/dashboard',
  },
];

import type React from "react"
import { ArrowDownIcon, ArrowUpIcon, LucideHardDrive, LucideImage, LucideImages } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, formatFileSize } from "@/lib/utils"

interface DashboardCardProps {
  title: string
  value: string
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  className?: string
}

export function DashboardCard({ title, value, description, icon, trend, className }: DashboardCardProps) {
  const showTrend = trend && trend.value !== 0
  const isPositive = trend && trend.value > 0

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>}
        {showTrend && (
          <div className="mt-2 flex items-center text-xs">
            <span className={cn("flex items-center gap-1 font-medium", isPositive ? "text-green-600" : "text-red-600")}>
              {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
              {Math.abs(trend.value)}%
            </span>
            <span className="ml-1 text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface User {
  albums_count: number,
  images_count: number,
  images_sum_size: number
}

interface PageProps {
  user: User;
  [x: string]: unknown;
}

export default function Dashboard() {
  const { user } = usePage<PageProps>().props

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard
            title='Imagenes totales'
            value={`${user.images_count} imagenes subidas`}
            icon={<LucideImage className='h-6 w-6' />}
            className='gap-2.5 py-6 h-min justify-center'
          />
          <DashboardCard
            title='Albumes totales'
            value={`${user.albums_count} álbumes registrados`}
            icon={<LucideImages className='h-6 w-6' />}
            className='gap-2.5 py-6 h-min justify-center'
          />
          <DashboardCard
            title='Espacio utilizado'
            value={`${formatFileSize(user.images_sum_size)} en total`}
            icon={<LucideHardDrive className='h-6 w-6' />}
            className='gap-2.5 py-6 h-min justify-center'
          />

        </div>
      </div>
    </AppLayout>
  );
}
