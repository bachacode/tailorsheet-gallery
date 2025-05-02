import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage,  } from '@inertiajs/react';
import { createColumns, Album } from './columns';
import { useEffect, useState } from 'react';
import { DataGrid } from '@/components/data-grid';
import { Grid, List } from "lucide-react"
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Álbumes',
    href: '/albums',
  },
];

export default function Index() {

  const [view, setView] = useState<'table' | 'grid'>('grid');
  const { albums, flash } = (usePage().props as unknown) as { albums: Album[]; flash: { success: string } };
  const handleViewChange = (newView: 'table' | 'grid') => {
    setView(newView);
  };


  const handleDelete = (id: number) => {
    router.delete(`/albums/${id}`, {
      onSuccess: () => {
        toast.success('¡Álbum eliminado correctamente!', {
          closeButton: true,
          duration: 3000,
          position: 'top-right',
        });
      }
    });
  }
  const columns = createColumns(handleDelete);


  useEffect(() => {
      if (flash && flash.success) {
        toast.success(flash.success, {
          closeButton: true,
          duration: 3000,
          position: 'top-right',
        });
  }}, [flash]);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Álbumes" />
      <div className='p-8 space-y-4'>
        <div className='flex justify-end items-center'>
          <Link href="/albums/create" className="bg-blue-500 hover:bg-blue-400 transition-colors text-white px-4 py-2 rounded">
            Añadir nuevo álbum
          </Link>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Lista de Álbumes</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewChange('grid')}
              className={`px-4 py-2 rounded cursor-pointer ${view === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewChange('table')}
              className={`px-4 py-2 rounded cursor-pointer ${view === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
        {view === 'grid' ? <DataGrid columns={columns} contentColumns={['image', 'title']} footerColumns={['images_count','actions']} data={albums} filterFields={['title', 'description', 'tags']} /> : <DataTable columns={columns} data={albums} filterFields={['title', 'description', 'tags']} visibleColumns={['select', 'title', 'tags', 'images_count_table', 'description', 'created_at', 'actions']} />}
      </div>
    </AppLayout>
  );
}
