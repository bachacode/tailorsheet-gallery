import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Image as ImageType } from "../images/columns";
import GalleryPicker from "@/components/gallery-picker";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tag } from "../tags/columns";
import { MultiSelect } from "@/components/multiselect";
import { Textarea } from "@/components/ui/textarea";
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Álbumes",
    href: "/albums",
  },
  {
    title: "Crear",
    href: "/albums/create",
  },
];

type AlbumForm = {
  title: string;
  description: string;
  tags?: string[];
  images?: string[];
}

export default function CreateImage() {
  const { images, tags } = usePage().props as unknown as { images: ImageType[]; tags: Tag[] };

  const tagsList: { value: string; label: string }[] = tags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));

  const { data, setData, post, processing, errors } = useForm<Required<AlbumForm>>({
    title: "",
    description: "",
    tags: [],
    images: [],
  });

  const handleImageSelect = (images: ImageType[]) => {
    const imagesIds = images.map((img) => img.id.toString());

    setData('images', imagesIds)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("albums.store"))
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear álbum" />
      <div className="p-8 space-y-6">
        <h1 className="text-2xl font-bold">Crear álbum</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Titulo del album */}
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
              placeholder="Titulo del álbum"
            />
            <InputError message={errors.title} />
          </div>

          {/* Etiquetas */}
          <div>
            <Label htmlFor="tags">Etiquetas</Label>
            <MultiSelect
              id="tags"
              options={tagsList}
              onValueChange={(selectedTags) => setData("tags", selectedTags)} // Update tags in useForm
              defaultValue={data.tags} // Initialize with existing tags
              placeholder="Selecciona las etiquetas"
              variant="inverted"
              maxCount={3}
            />
            <InputError message={errors.tags} />
          </div>


          {/* Gallery Picker*/}
          <GalleryPicker images={images} onSelect={handleImageSelect} maxPreview={5}></GalleryPicker>
          <InputError message={errors.images}></InputError>

          {/* Descripcion */}
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              placeholder="Descripción del álbum"
              tabIndex={3}
              className="min-h-40"
            ></Textarea>
            <InputError message={errors.description} />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-400 min-w-xs transition-colors text-white px-4 py-6 rounded cursor-pointer">
              {processing ? "Creando álbum..." : "Crear álbum"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
