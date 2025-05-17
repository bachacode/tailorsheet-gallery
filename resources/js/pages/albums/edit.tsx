import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Image as ImageType } from "../images/columns";
import { Tag } from "../tags/columns";
import { Album } from "./columns";
import AppFormLayout from "@/layouts/app/app-form-layout";
import FormField from "@/components/common/form-field";

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
    title: 'Editar',
    href: ''
  }
];

interface AlbumForm {
  title: string;
  description: string;
}

interface PageProps {
  album: Album;
  images: ImageType[];
  tags: Tag[];
  [x: string]: unknown;
}

export default function CreateImage() {
  const { album } = usePage<PageProps>().props;

  const { data, setData, patch, processing, errors } = useForm<Required<AlbumForm>>({
    title: album.title,
    description: album.description
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route("albums.update", { id: album.id }))
  };

  // const handleNewTagSubmit = async (name: string) => {
  //   try {
  //     setIsLoading(true)
  //     const response = await axios.post(route('tags.store', { no_redirect: true }), { name });
  //     const newTag = response.data.tag as Tag
  //     router.reload({
  //       only: ["tags"],
  //       onFinish: () => {
  //         toast.success("¡Etiqueta creada correctamente!", {
  //           closeButton: true,
  //           duration: 3000,
  //           position: 'top-right',
  //         });
  //         setIsLoading(false)
  //       }
  //     })
  //     return newTag.id.toString();
  //   } catch (error) {
  //     toast.error("Hubo un error al crear la etiqueta.");
  //     throw error;
  //   }
  // };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar álbum" />
      <AppFormLayout
        headerTitle={album.title}
        headerDescription="Editando álbum"
        backRoute="albums.index"
        onSubmit={handleSubmit}
        submitText="Guardar cambios"
        processing={processing}
        onProcessText="Guardando cambios..."
      >

        <div className="">
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

          {/* Etiquetas
          <FormField
            id="tags"
            label="Etiquetas"
            inputType="custom"
            error={errors.tags}
          >
            <MultiSelectImages
              id="tags"
              options={tagsList}
              onValueChange={(selectedTags) => {
                setData("tags", selectedTags)
              }} // Update tags in useForm
              defaultValue={data.tags} // Initialize with existing tags
              placeholder="Selecciona las etiquetas"
              variant="inverted"
              tabIndex={3}
              maxCount={3}
              handleCommandSubmit={handleNewTagSubmit}
            />
          </FormField> */}
        </div>
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
