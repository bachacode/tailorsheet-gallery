import { DataTable } from '@/components/common/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage, } from '@inertiajs/react';
import { createColumns, Image } from './columns';
import { useState } from 'react';
import { DataGrid } from '@/components/common/data-grid';
import { toast } from 'sonner';
import AppFeatureLayout from '@/layouts/app/app-feature-layout';
import DataTableToggle from '@/components/common/data-table-toggle';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: route('dashboard')
  },
  {
    title: 'Imagenes',
    href: route('images.index'),
  },
];

interface PageProps {
  images: Image[];
  [x: string]: unknown;
}

export default function Index() {
  const [view, setView] = useState<'table' | 'grid'>('grid');
  const [copiedState, setCopiedState] = useState<Record<number, boolean>>({});
  const { images } = usePage<PageProps>().props

  const handleCopy = (id: number, filename: string) => {
    const domain = window.location.origin; // Get the current domain
    const fullUrl = `${domain}/storage/images/${filename}`; // Construct the full URL
    navigator.clipboard.writeText(fullUrl); // Copy to clipboard

    // Update the copied state for this row
    setCopiedState((prev) => ({ ...prev, [id]: true }));

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedState((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

  const handleDelete = (id: number) => {
    router.delete(route('images.destroy', { id: id }), {
      onSuccess: () => {
        toast.success('¡Imagen eliminada correctamente!', {
          closeButton: true,
          duration: 3000,
          position: 'top-right',
        });
      }
    });
  }

  const columns = createColumns(copiedState, handleCopy, handleDelete);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Imagenes" />
      <AppFeatureLayout
        title='Mis imagenes'
        action={{ route: route('images.create'), text: 'Añadir nueva imagen' }}
      >
        <DataTableToggle view={view} setView={setView}/>
        {view === 'grid' ? <DataGrid columns={columns} contentColumns={['image']} footerColumns={['size', 'actions']} data={images} filterFields={['title', 'description', 'tags']} /> : <DataTable columns={columns} data={images} filterFields={['title', 'description', 'tags']} visibleColumns={['select', 'title', 'filename', 'tags', 'description', 'size', 'created_at', 'actions']} />}
      </AppFeatureLayout>
    </AppLayout>
  );
}
