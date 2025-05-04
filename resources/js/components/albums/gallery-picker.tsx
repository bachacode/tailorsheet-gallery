import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Image } from "@/pages/images/columns";
import { Check, LucideImages, X } from "lucide-react";
import { useState, useMemo } from "react";
import { formatFileSize } from "@/lib/utils";

interface GalleryPickerProps {
  images: Image[];
  selectedImageIds: number[];
  imagesHandler: (image: Image[]) => void;
  maxPreview?: number;
}

export default function GalleryPicker({
  images,
  selectedImageIds = [],
  imagesHandler,
  maxPreview = 3,
}: GalleryPickerProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [markedImages, setMarkedImages] = useState<number[]>(selectedImageIds);
  const selectedImages = useMemo(() => {
    return images.filter((image) => selectedImageIds.includes(image.id))
  }, [images, selectedImageIds]);

  const filteredImages = useMemo(() => {
    if (!searchTerm) return images;
    return images.filter((image) =>
      image.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [images, searchTerm]);

  const handleToggleMarkedImage = (image: Image) => {
    setMarkedImages((prev) =>
      prev.includes(image.id)
        ? prev.filter((id) => id !== image.id)
        : [...prev, image.id]
    );
  };

  const handleImagePreviewRemove = (image: Image) => {
    const updated = selectedImages.filter((img) => img.id !== image.id);
    imagesHandler(updated);
  };

  const handleConfirmSelection = () => {
    const selected = images.filter((img) => markedImages.includes(img.id));
    imagesHandler(selected);
  };

  const handleClearSelection = () => {
    setMarkedImages([]);
  }

  return (
    <Dialog>

      <div className="p-6 border border-border bg-card space-y-4">
        <div>
          {/* Preview Section */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedImages.slice(0, maxPreview).map((image) => (
                <Card
                  key={image.id}
                  className="overflow-hidden group relative border border-border w-40 gap-2 p-0"
                >
                  <div className="relative bg-muted">
                    <img
                      src={`/storage/images/${image.filename || "/placeholder.svg"}`}
                      alt={image.title}
                      className="object-cover aspect-square h-40"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute cursor-pointer top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleImagePreviewRemove(image)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                  <CardFooter className="p-2 text-xs mt-auto flex justify-between items-center bg-card text-card-foreground">
                    <span
                      className="truncate max-w-1/2"
                      title={image.filename}
                    >
                      {image.filename}
                    </span>
                    <span className="text-muted-foreground">
                      {formatFileSize(image.size ?? 0)}
                    </span>
                  </CardFooter>
                </Card>
              ))}
            {selectedImages.length > maxPreview && (
              <div className="flex items-center justify-center w-40 h-auto rounded-md border text-sm text-muted-foreground">
                +{selectedImages.length - maxPreview} más
              </div>
            )}
          </div>
        </div>
        <DialogTrigger asChild>
          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-gray-600`}
          >
            <LucideImages className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Haz clic para escoger las imagénes desde la galería.
            </p>
          </div>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[90%] rounded-sm h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Seleccionar Imágenes</DialogTitle>
        </DialogHeader>
        <div className="flex space-x-2">
          <div className="mt-4 w-full">
            {/* Search Input */}
            <Input
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages.map((image) => (
                <Card
                  key={image.id}
                  className={`relative overflow-hidden border p-0 gap-0 ${markedImages.includes(image.id) ? "border-blue-500" : "border-gray-300"
                    }`}
                  onClick={() => handleToggleMarkedImage(image)}
                >
                  <CardContent className="p-0">
                    <img
                      src={`/storage/images/${image.filename}`}
                      alt={image.title}
                      className="object-cover w-full h-36"
                    />
                    {markedImages.includes(image.id) && (
                      <div className="absolute inset-0 bg-blue-500/50 flex items-center justify-center">
                        <Check className="h-10 w-10 text-white" />
                      </div>
                    )}
                  </CardContent>
                  <div className="p-2 text-center text-sm font-medium text-wrap">
                    {image.title}
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2 w-3/12">
            <DialogTrigger className="h-fit">
              <Button
                type="button"
                variant="default"
                onClick={handleConfirmSelection}
                className="cursor-pointer"
              >
                Confirmar
              </Button>
            </DialogTrigger>

            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
              onClick={handleClearSelection}
            >
              Limpiar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
