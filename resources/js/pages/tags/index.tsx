import { DataTable } from '@/components/common/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage, } from '@inertiajs/react';
import { createColumns, Tag } from './columns';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/common/input-error';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Etiquetas',
    href: '/tags',
  },
];

export type TagForm = {
  name: string;
}

export default function Index() {
  const { tags, flash } = (usePage().props as unknown) as { tags: Tag[]; flash: { success: string } };
  const serverErrors = usePage().props.errors;
  const { data, setData, post, processing, errors, reset } = useForm<Required<TagForm>>({
    name: ''
  });
  const handleDelete = (id: number) => {
    router.delete(`/tags/${id}`, {
      onSuccess: () => {
        toast.success('Etiqueta eliminada correctamente', {
          closeButton: true,
          duration: 3000,
          position: 'top-right',
        });
      }
    });
  }

  const columns = createColumns(handleDelete);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('tags.store'), {
      onSuccess: () => reset('name')
    })
  };


  useEffect(() => {
    if (flash && flash.success) {
      toast.success(flash.success, {
        closeButton: true,
        duration: 3000,
        position: 'top-right',
      });
    }

    if(serverErrors && serverErrors.name) {
      toast.error(serverErrors.name, {
        closeButton: true,
        duration: 3000,
        position: 'top-right',
      });
    }
  }, [flash, serverErrors]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Etiquetas" />
      <div className='p-8 space-y-4'>
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Módulo de etiquetas</h1>
        </div>
        <div className='flex gap-12'>
          <div className='w-1/3'>
            <h2 className="text-2xl font-bold pb-3">Crear nueva etiqueta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Multiple File Upload Field */}

              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  autoFocus
                  tabIndex={1}
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Nombre de la etiqueta"
                />
                <InputError message={errors.name} />
              </div>
              {/* Submit Button */}
              <div className="flex justify-center">
                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                  {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  Crear etiqueta
                </Button>
              </div>
            </form>
          </div>
          <div className='w-2/3'>
            <h2 className="text-2xl font-bold pb-3">Lista de etiquetas</h2>
            <DataTable columns={columns} data={tags} filterFields={['name']} visibleColumns={['select', 'name', 'created_at', 'actions']} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
