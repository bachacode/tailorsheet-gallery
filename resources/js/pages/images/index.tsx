import { DataTable } from '@/components/common/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage, } from '@inertiajs/react';
import { createColumns, Image } from './columns';
import { useEffect, useState } from 'react';
import { DataGrid } from '@/components/common/data-grid';
import { Grid, List } from "lucide-react"
import { toast } from 'sonner';
import AppFeatureLayout from '@/layouts/app/app-feature-layout';

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

type usePageProps = {
  images: Image[];
  flash: {
    success: string
  }
}

export default function Index() {
  const [view, setView] = useState<'table' | 'grid'>('grid');
  const [copiedState, setCopiedState] = useState<Record<number, boolean>>({});
  const { images, flash } = (usePage().props as unknown) as usePageProps;

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

  useEffect(() => {
    if (flash && flash.success) {
      toast.success(flash.success, {
        closeButton: true,
        duration: 3000,
        position: 'top-right',
      });
    }
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Imagenes" />
      <AppFeatureLayout
        title='Mis imagenes'
        action={{ route: 'images.create', text: 'Añadir nueva imagen' }}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded cursor-pointer ${view === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded cursor-pointer ${view === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
        {view === 'grid' ? <DataGrid columns={columns} contentColumns={['image']} footerColumns={['size', 'clipboard_action', 'actions']} data={images} filterFields={['title', 'description', 'tags']} /> : <DataTable columns={columns} data={images} filterFields={['title', 'description', 'tags']} visibleColumns={['select', 'title', 'filename', 'tags', 'description', 'size', 'created_at', 'actions']} />}
      </AppFeatureLayout>
    </AppLayout>
  );
}
