import { DataTable } from '@/components/common/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage, } from '@inertiajs/react';
import { createColumns, Album } from './columns';
import { useState } from 'react';
import { DataGrid } from '@/components/common/data-grid';
import { toast } from 'sonner';
import AppFeatureLayout from '@/layouts/app/app-feature-layout';
import DataTableToggle from '@/components/common/data-table-toggle';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: route('dashboard'),
  },
  {
    title: 'Álbumes',
    href: route('albums.index'),
  },
];

interface PageProps {
  albums: Album[];
  [x: string]: unknown;
}

export default function Index() {

  const [view, setView] = useState<'table' | 'grid'>('grid');
  const { albums } = usePage<PageProps>().props

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Álbumes" />
      <AppFeatureLayout
        title='Mis álbumes'
        action={{ route: 'albums.create', text: 'Crear nuevo álbum' }}
      >
        <DataTableToggle view={view} setView={setView} />
        {view === 'grid' ? <DataGrid columns={columns} contentColumns={['image', 'title']} footerColumns={['images_count', 'actions']} data={albums} filterFields={['title', 'description', 'tags']} /> : <DataTable columns={columns} data={albums} filterFields={['title', 'description', 'tags']} visibleColumns={['select', 'title', 'tags', 'images_count_table', 'description', 'created_at', 'actions']} />}
      </AppFeatureLayout>
    </AppLayout>
  );
}
