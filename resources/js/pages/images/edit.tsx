import { FormEventHandler } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Image } from "./columns";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Tag } from "../tags/columns";
import { MultiSelect } from "@/components/common/multiselect";
import AppFormLayout from "@/layouts/app/app-form-layout";
import FormField from "@/components/common/form-field";

type ImageForm = {
  title: string;
  description: string;
  filename: string;
  tags?: string[];
}

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
    title: 'Editar',
    href: ''
  }
];

interface PageProps {
  image: Image;
  tags: Tag[];
  [x: string]: unknown;
}


export default function EditImage() {
  const { image, tags } = usePage<PageProps>().props

  const tagsList: { value: string; label: string }[] = tags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));

  const { data, setData, patch, processing, errors } = useForm<Required<ImageForm>>({
    title: image.title,
    description: image.description,
    filename: image.filename,
    tags: (image.tags) ? image.tags.map((tag) => tag.id.toString()) : [], // Initialize with existing tags
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route("images.update", { id: image.id }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar imagen" />
      <AppFormLayout
        headerTitle="Editar imagen"
        headerDescription={image.title}
        backRoute="images.index"
        onSubmit={handleSubmit}
        submitText="Guardar cambios"
        processing={processing}
        onProcessText="Guardando cambios..."
      >
        {/* Titulo y nombre del archivo */}
        <div className="grid gap-4 grid-cols-2">
          {/* Titulo */}
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
              placeholder: "Título de la imagen"
            }}
          />

          {/* Nombre del archivo */}
          <FormField
            id="filename"
            label="Nombre del archivo"
            inputType="input"
            error={errors.filename}
            inputProps={{
              required: true,
              autoFocus: true,
              tabIndex: 2,
              value: data.filename,
              onChange: (e) => setData("filename", e.target.value),
              placeholder: "example.jpg"
            }}
          />
        </div>

        {/* Lista de etiquetas */}
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
            tabIndex={3}
            maxCount={3}
          />
        </FormField>


        {/* Descripción */}
        <FormField
          id="description"
          label="Descripción"
          inputType="textarea"
          error={errors.description}
          inputProps={{
            required: true,
            autoFocus: true,
            tabIndex: 4,
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
