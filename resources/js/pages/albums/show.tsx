import { DataTable } from '@/components/common/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage, } from '@inertiajs/react';
import { Album } from './columns';
import { createColumns } from '../images/columns';
import { useState } from 'react';
import { toast } from 'sonner';

import DataTableToggle from '@/components/common/data-table-toggle';
import { DataGrid } from '@/components/common/data-grid';
import AppFeatureLayout from '@/layouts/app/app-feature-layout';


interface PageProps {
  album: Album;
  [x: string]: unknown;
}

export default function Show() {
  const { album } = usePage<PageProps>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Inicio',
      href: route('dashboard')
    },
    {
      title: 'Álbumes',
      href: route('albums.index'),
    },
    {
      title: album.title,
      href: ''
    }
  ];

  const [view, setView] = useState<'table' | 'grid'>('grid');
  const [copiedState, setCopiedState] = useState<Record<number, boolean>>({});

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
      <Head title={album.title} />
       <AppFeatureLayout
              title={album.title}
              description="Viendo álbum"
              action={{ route: route('albums.add', { id: album.id }), text: 'Añadir imagenes' }}
            >
            <DataTableToggle view={view} setView={setView} />
            {view === 'grid' ? <DataGrid columns={columns} contentColumns={['image']} footerColumns={['size', 'actions']} data={album.images} filterFields={['title', 'description', 'tags']} /> : <DataTable columns={columns} data={album.images} filterFields={['title', 'description', 'tags']} visibleColumns={['select', 'title', 'filename', 'tags', 'description', 'size', 'created_at', 'actions']} />}
        </AppFeatureLayout>
    </AppLayout>
  );
}
