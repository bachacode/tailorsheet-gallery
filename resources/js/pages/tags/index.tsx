import { DataTable } from '@/components/common/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage, } from '@inertiajs/react';
import { createColumns, Tag } from './columns';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import HeadingBig from '@/components/common/heading-big';
import Heading from '@/components/common/heading';
import FormField from '@/components/common/form-field';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: route('dashboard')
  },
  {
    title: 'Etiquetas',
    href: route('tags.index'),
  },
];

export type TagForm = {
  name: string;
}

interface PageProps {
  tags: Tag[];
  [x: string]: unknown;
}

export default function Index() {
  const { tags } = usePage<PageProps>().props;
  const serverErrors = usePage().props.errors;
  const { data, setData, post, processing, errors, reset } = useForm<Required<TagForm>>({
    name: ''
  });

  const handleDelete = (id: number) => {
    router.delete(route('tags.destroy', { id: id }), {
      onSuccess: () => {
        toast.success('¡Etiqueta eliminada correctamente!', {
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
    if (serverErrors && serverErrors.name) {
      toast.error(serverErrors.name, {
        closeButton: true,
        duration: 3000,
        position: 'top-right',
      });
    }
  }, [serverErrors]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Etiquetas" />
      <div className='py-8 px-12 space-y-6'>
        <div className='flex justify-between items-center'>
          <HeadingBig title="Mis etiquetas" />
        </div>
        <div className='flex gap-12'>
          <div className='w-1/3'>
            <Heading title='Crear nueva etiqueta' />
            <form onSubmit={handleSubmit} className="py-4 px-8 space-y-3 border rounded-xl shadow-sm gap-3 flex flex-col mt-10">
              {/* Name */}
              <FormField
                  id="name"
                  label="Nombre"
                  inputType="input"
                  error={errors.name}
                  inputProps={{
                    required: true,
                    autoFocus: true,
                    tabIndex: 1,
                    value: data.name,
                    onChange: (e) => setData("name", e.target.value),
                    placeholder: "Nombre de la etiqueta"
                  }}
                />

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button type="submit" className="bg-blue-500 hover:bg-blue-400 min-w-3xs transition-colors text-white px-4 py-6 rounded cursor-pointer" tabIndex={2} disabled={processing}>
                  {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {processing ? "Creando etiqueta..." : "Crear etiqueta"}
                </Button>
              </div>
            </form>
          </div>
          <div className='w-2/3'>
            <DataTable columns={columns} data={tags} filterFields={['name']} visibleColumns={['select', 'name', 'created_at', 'actions']} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
