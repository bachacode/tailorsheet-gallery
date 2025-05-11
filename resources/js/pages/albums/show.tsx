import { DataTable } from '@/components/common/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage, } from '@inertiajs/react';
import { Album } from './columns';
import { createColumns } from '../images/columns';
import { useState } from 'react';
import { toast } from 'sonner';

import DataTableToggle from '@/components/common/data-table-toggle';
import { DataGrid } from '@/components/common/data-grid';
import AppFeatureLayout from '@/layouts/app/app-feature-layout';
import FormField from '@/components/common/form-field';
import ImageUploader from '@/components/images/image-uploader';
import { Button } from '@/components/ui/button';
import { LucideLoaderCircle } from 'lucide-react';
import { Accordion,AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PageProps {
  album: Album;
  [x: string]: unknown;
}

interface AlbumForm {
  images?: File[];
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


  const { data, setData, post, processing, errors, setError } = useForm<Required<AlbumForm>>({
    images: []
  });

  // const [images, setImages] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleAddImages = (files: File[]) => {// Clear any previous errors
    setIsUploadingImages(true);
    // Validate file extensions
    const validExtensions = ["png", "jpeg", "jpg", "webp", "gif", "bmp", "tiff"];
    const invalidFiles = files.filter(
      (file) => !validExtensions.includes(file.name.split(".").pop()?.toLowerCase() || "")
    );

    if (invalidFiles.length > 0) {
      setError('images', "Algunos archivos tienen extensiones no permitidas.");
      setIsUploadingImages(false);
      return;
    } else {
      setError('images', '');
    }

    // Simulate network delay
    setTimeout(() => {
      setData('images', files);
      setIsUploadingImages(false);
    }, 600);

  };

  const handleRemoveImage = (id: number) => {
    setData('images', data.images.filter((_, i) => i !== id))
    // setImages((prev) => prev.filter((image, index) => index !== id) );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (data.images.length === 0) {
      setError('images', "Debes subir al menos un archivo.");
      return;
    }
    setIsUploadingImages(true);

    post(route("albums.upload", { id: album.id }))
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={album.title} />
      <AppFeatureLayout
        title={album.title}
        description="Viendo álbum"
      >
        <Accordion type='single' collapsible className='w-full pb-6 justify-center'>
          <AccordionItem value='item-1' className='w-full text-center'>
            <AccordionTrigger className='border-b border-gray-600 rounded-none cursor-pointer py-3'>
              Añadir nuevas imagenes
            </AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handleSubmit} className="space-y-4 pb-6">
                {/* Multiple File Upload Field */}
                <FormField
                  id="images"
                  label=""
                  inputType="custom"
                  error={errors.images}
                >
                  <ImageUploader
                    images={data.images}
                    isUploading={isUploadingImages}
                    onAddImages={handleAddImages}
                    onRemoveImage={handleRemoveImage}
                  />
                </FormField>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-400 min-w-xs transition-colors text-white px-4 py-6 rounded cursor-pointer">
                    {processing && <LucideLoaderCircle className="h-4 w-4 animate-spin" />}
                    {processing ? "Subiendo imagenes..." : "Subir imagenes"}
                  </Button>
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DataTableToggle view={view} setView={setView} />
        {view === 'grid' ? <DataGrid columns={columns} contentColumns={['image']} footerColumns={['size', 'actions']} data={album.images} filterFields={['title', 'description', 'tags']} /> : <DataTable columns={columns} data={album.images} filterFields={['title', 'description', 'tags']} visibleColumns={['select', 'title', 'filename', 'tags', 'description', 'size', 'created_at', 'actions']} />}
      </AppFeatureLayout>
    </AppLayout>
  );
}
