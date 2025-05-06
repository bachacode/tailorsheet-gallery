import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, router } from "@inertiajs/react";
import ImageUploader, { ImagePreview } from "@/components/images/image-uploader";
import { useState } from "react";
import AppFormLayout from "@/layouts/app/app-form-layout";
import FormField from "@/components/common/form-field";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inicio',
    href: route('dashboard')
  },
  {
    title: 'Imagenes',
    href: route('images.index'),
  },
  {
    title: 'Crear',
    href: route('images.create')
  }
];

export default function CreateImage() {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>();

  const handleAddImages = (files: File[]) => {// Clear any previous errors
    setIsUploading(true);

    // Validate file extensions
    const validExtensions = ["png", "jpeg", "jpg", "webp", "gif", "bmp", "tiff"];
    const invalidFiles = files.filter(
      (file) => !validExtensions.includes(file.name.split(".").pop()?.toLowerCase() || "")
    );

    if (invalidFiles.length > 0) {
      setError("Algunos archivos tienen extensiones no permitidas.");
      setIsUploading(false);
      return;
    } else {
      setError('');
    }

    // Create image previews
    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));

    // Simulate network delay
    setTimeout(() => {
      setImages((prev) => [...prev, ...newImages]);
      setIsUploading(false);
    }, 1000);
  };

  const handleRemoveImage = (id: number) => {
    setImages((prev) => {
      const filtered = prev.filter((image, index) => index !== id);
      // Revoke object URL to prevent memory leaks
      const imageToRemove = prev.find((image, index) => index === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return filtered;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      setError("Debes subir al menos un archivo.");
      return;
    }

    setIsUploading(true)
    // Use FormData to handle file uploads
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image.file);
    });

    router.post(route('images.store'), formData, {
      forceFormData: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Subir imágenes" />
      <AppFormLayout
        headerTitle='Subir imagenes'
        backRoute="images.index"
        onSubmit={handleSubmit}
        submitText="Subir imagenes"
        processing={isUploading}
        onProcessText="Subiendo imagenes..."
      >
        {/* Multiple File Upload Field */}
        <FormField
        id="images"
        label="Imagenes"
        inputType="custom"
        error={error}
        >
        <ImageUploader
          images={images}
          isUploading={isUploading}
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
        />
        </FormField>
      </AppFormLayout>
    </AppLayout>
  );
}
