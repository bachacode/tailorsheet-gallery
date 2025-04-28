import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { columns, Image } from './columns';
import { useState } from 'react';
import { DataGrid } from '@/components/data-grid';
import { Grid, List } from "lucide-react"
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Imagenes',
        href: '/images',
    },
];

export default function Index() {

    const [view, setView] = useState<'table' | 'grid'>('grid');
    const handleViewChange = (newView: 'table' | 'grid') => {
        setView(newView);
    };

    const { images } = (usePage().props as unknown) as { images: Image[] };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className='p-8'>
                <Head title="Imagenes" />
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Lista de imagenes</h1>
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
                {view === 'grid' ? <DataGrid columns={columns} contentColumns={['title']} footerColumns={['title', 'actions']} data={images} filterField='title' /> : <DataTable columns={columns} data={images} />}
            </div>
        </AppLayout>
    );
}
