import { FormEventHandler } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/components/common/input-error";
import { Image } from "./columns";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Tag } from "../tags/columns";
import { MultiSelect } from "@/components/common/multiselect";
import AppFormLayout from "@/layouts/app/app-form-layout";

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
          <div className="grid gap-2">
            <Label htmlFor="title">Titulo</Label>
            <Input
              id="title"
              type="text"
              required
              autoFocus
              tabIndex={1}
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              placeholder="Titulo de la imagen"
            />
            <InputError message={errors.title} />
          </div>

          {/* Nombre del archivo */}
          <div className="grid gap-2">
            <Label htmlFor="filename">Nombre del archivo</Label>
            <Input
              id="filename"
              type="text"
              required
              tabIndex={2}
              value={data.filename}
              onChange={(e) => setData("filename", e.target.value)}
              placeholder="Nombre del archivo"
            />
            <InputError message={errors.filename} />
          </div>
        </div>

        {/* Lista de etiquetas */}
        <div className="grid gap-2">
          <MultiSelect
            options={tagsList}
            onValueChange={(selectedTags) => setData("tags", selectedTags)} // Update tags in useForm
            defaultValue={data.tags} // Initialize with existing tags
            placeholder="Selecciona las etiquetas"
            variant="inverted"
            tabIndex={3}
            maxCount={3}
          />
          <InputError message={errors.tags} />
        </div>

        {/* Descripción */}
        <div className="grid gap-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            placeholder="Descripción de la imagen"
            tabIndex={4}
            className="h-40"
          ></Textarea>
          <InputError message={errors.description} />
        </div>

      </AppFormLayout>
    </AppLayout>
  );
}
