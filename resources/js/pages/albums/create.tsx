import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Image as ImageType } from "../images/columns";
import { Tag } from "../tags/columns";
import { MultiSelect } from "@/components/common/multiselect";
import AppFormLayout from "@/layouts/app/app-form-layout";
import FormField from "@/components/common/form-field";
import ImageUploader from "@/components/images/image-uploader";
import { useState } from "react";

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
    title: 'Crear',
    href: route('albums.create')
  }
];

interface AlbumForm {
  title: string;
  description: string;
  tags?: string[];
  images?: File[];
}

interface PageProps {
  images: ImageType[];
  tags: Tag[];
  [x: string]: unknown;
}

export default function CreateImage() {
  const { tags } = usePage<PageProps>().props;

  const tagsList: { value: string; label: string }[] = tags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));

  const { data, setData, post, processing, errors, setError } = useForm<Required<AlbumForm>>({
    title: "",
    description: "",
    tags: [],
    images: []
  });

  //const [previews, setPreviews] = useState<ImagePreview[]>([]);
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (data.images.length === 0) {
      setError('images',"Debes subir al menos un archivo.");
      return;
    }
    setIsUploadingImages(true);

    post(route("albums.store"), {
      forceFormData: true
    })
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear álbum" />
      <AppFormLayout
        headerTitle='Crear álbum'
        backRoute="albums.index"
        onSubmit={handleSubmit}
        submitText="Crear álbum"
        processing={processing}
        onProcessText="Creando álbum..."
      >
        {/* Titulo del album */}
        <FormField
          id="title"
          label="Título"
          inputType="input"
          error={errors.title}
          inputProps={{
            required: true,
            autoFocus: true,
            tabIndex: 1,
            value: data.title,
            onChange: (e) => setData("title", e.target.value),
            placeholder: "Título del álbum"
          }}
        />

        {/* Etiquetas */}
        <FormField
          id="tags"
          label="Etiquetas"
          inputType="custom"
          error={errors.tags}
        >
          <MultiSelect
            id="tags"
            options={tagsList}
            onValueChange={(selectedTags) => setData("tags", selectedTags)} // Update tags in useForm
            defaultValue={data.tags} // Initialize with existing tags
            placeholder="Selecciona las etiquetas"
            variant="inverted"
            tabIndex={2}
            maxCount={3}
          />
        </FormField>


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

        {/* Descripcion */}
        <FormField
          id="description"
          label="Descripción"
          inputType="textarea"
          error={errors.description}
          inputProps={{
            autoFocus: true,
            tabIndex: 3,
            value: data.description,
            onChange: (e) => setData("description", e.target.value),
            placeholder: "Descripción de la imagen",
            className: "h-40"
          }}
        />
      </AppFormLayout>
    </AppLayout>
  );
}
