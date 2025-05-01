import { FormEventHandler, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { Image } from "./columns";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tag } from "../tags/columns";
import { MultiSelect } from "@/components/multiselect";

type ImageForm = {
  title: string;
  description: string;
  filename: string;
  tags?: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Imagenes",
    href: "/images",
  },
  {
    title: "Editar",
    href: "/images/edit",
  },
];


export default function EditImage() {
  const { image, tags, flash } = usePage().props as unknown as {
    image: Image;
    tags: Tag[];
    flash: { error: string };
  };

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

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route("images.update", { id: image.id }));
  };

  useEffect(() => {
    if (flash && flash.error) {
      toast.error(flash.error, {
        closeButton: true,
        duration: 3000,
        position: "top-right",
      });
    }
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar imagen" />
      <div className="p-8 space-y-6">
        <h1 className="text-2xl font-bold">Editar imagen</h1>
        <form className="flex flex-col gap-6" onSubmit={submit}>
          <div className="grid gap-6">
            <div className="grid gap-4 grid-cols-2">
              <div>
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

              <div>
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

            {/* MultiSelect Component */}
            <MultiSelect
              options={tagsList}
              onValueChange={(selectedTags) => setData("tags", selectedTags)} // Update tags in useForm
              defaultValue={data.tags} // Initialize with existing tags
              placeholder="Selecciona las etiquetas"
              variant="inverted"
              maxCount={3}
            />
            <InputError message={errors.tags} />

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Descripción de la imagen"
                tabIndex={3}
              ></Textarea>
              <InputError message={errors.description} />
            </div>

            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
