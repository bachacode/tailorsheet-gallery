import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Head, router } from "@inertiajs/react";
import ImageUploader, { ImagePreview } from "@/components/image-uploader";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Imagenes",
        href: "/images",
    },
    {
        title: "Crear",
        href: "/images/create",
    },
];

export default function CreateImage() {
    const [images, setImages] = useState<ImagePreview[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddImages = (files: File[]) => {
        setError(null); // Clear any previous errors
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

    const handleRemoveImage = (id: string) => {
        setImages((prev) => {
            const filtered = prev.filter((image) => image.id !== id);
            // Revoke object URL to prevent memory leaks
            const imageToRemove = prev.find((image) => image.id === id);
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

        router.post("/images", formData, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subir imágenes" />
            <div className="p-8 space-y-6">
                <h1 className="text-2xl font-bold">Subir Imágenes</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Multiple File Upload Field */}
                    <ImageUploader
                        images={images}
                        isUploading={isUploading}
                        onAddImages={handleAddImages}
                        onRemoveImage={handleRemoveImage}
                    />

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <Button type="submit" disabled={isUploading} className="bg-blue-500 hover:bg-blue-400 min-w-xs transition-colors text-white px-4 py-6 rounded cursor-pointer">
                            {isUploading ? "Subiendo imagenes..." : "Subir imagenes"}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
