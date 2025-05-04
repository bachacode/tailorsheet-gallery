import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Image as ImageType } from "../images/columns";
import GalleryPicker from "@/components/albums/gallery-picker";
import { Tag } from "../tags/columns";
import { MultiSelect } from "@/components/common/multiselect";
import { Album } from "./columns";
import AppFormLayout from "@/layouts/app/app-form-layout";
import FormField from "@/components/common/form-field";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Álbumes",
    href: "/albums",
  },
  {
    title: "Editar",
    href: "/albums/edit",
  },
];

type AlbumForm = {
  title: string;
  description: string;
  tags?: string[];
  images?: number[];
}

export default function CreateImage() {
  const { album, images, tags } = usePage().props as unknown as { album: Album; images: ImageType[]; tags: Tag[] };

  const tagsList: { value: string; label: string }[] = tags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));

  const { data, setData, patch, processing, errors } = useForm<Required<AlbumForm>>({
    title: album.title,
    description: album.description,
    tags: album.tags.map((tag) => tag.id.toString()),
    images: album.images.map((image) => image.id),
  });

  const updateImages = (images: ImageType[]) => {
    const imagesIds = images.map((img) => img.id);
    setData('images', imagesIds)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route("albums.update", { id: album.id }))
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar álbum" />
      <AppFormLayout
        headerTitle='Editar álbum'
        headerDescription={album.title}
        backRoute="albums.index"
        onSubmit={handleSubmit}
        submitText="Guardar cambios"
        processing={processing}
        onProcessText="Guardando cambios..."
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


        {/* Gallery Picker*/}
        <FormField
          id="images"
          label="Imagenes seleccionadas"
          inputType="custom"
          error={errors.images}
        >
          <GalleryPicker
          images={images}
          selectedImageIds={data.images}
          imagesHandler={updateImages}
          maxPreview={5}
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
