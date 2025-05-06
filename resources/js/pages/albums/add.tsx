import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import AppFormLayout from "@/layouts/app/app-form-layout";
import FormField from "@/components/common/form-field";
import ImageUploader from "@/components/images/image-uploader";
import { useState } from "react";
import { Album } from "./columns";

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
    title: 'Añadir',
    href: ''
  }
];

interface AlbumForm {
  images?: File[];
}

interface PageProps {
  album: Album;
  [x: string]: unknown;
}

export default function CreateImage() {
  const { album } = usePage<PageProps>().props;

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
      setError('images',"Debes subir al menos un archivo.");
      return;
    }
    setIsUploadingImages(true);

    post(route("albums.upload", { id: album.id }))
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Añadir imagenes" />
      <AppFormLayout
        headerTitle='Añadir imagenes'
        headerDescription={album.title}
        backRoute="albums.index"
        onSubmit={handleSubmit}
        submitText="Añadir imagenes"
        processing={processing}
        onProcessText="Añadiendo imagenes..."
      >
        {/* Multiple File Upload Field */}
        <FormField
        id="images"
        label="Imagenes"
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
      </AppFormLayout>
    </AppLayout>
  );
}
