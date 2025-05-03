import type React from "react";
import { useRef, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatFileSize } from "@/lib/utils";

export interface ImagePreview {
    id: string;
    file: File;
    url: string;
}

interface ImageUploaderProps {
    images: ImagePreview[];
    isUploading: boolean;
    onAddImages: (files: File[]) => void;
    onRemoveImage: (id: string) => void;
}

export default function ImageUploader({
    images,
    isUploading,
    onAddImages,
    onRemoveImage,
}: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const newFiles = Array.from(e.target.files);
        onAddImages(newFiles);

        // Reset the input value so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files?.length) {
            const newFiles = Array.from(e.dataTransfer.files);
            onAddImages(newFiles);
        }
    };

    return (
        <div className="w-full mx-auto p-4">
            <Card className="border border-border bg-card">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? "border-blue-500" : "hover:border-primary"
                                }`}
                            onClick={handleUploadClick}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".png,.jpeg,.jpg,.webp,.gif,.bmp,.tiff"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground text-center">
                                Haz clic para subir imágenes o arrastra y suelta
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, JPEG, WEBP, GIF, BMP, TIFF hasta 50MB
                            </p>
                            {isUploading && (
                                <div className="mt-4 flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    <span className="text-sm">Subiendo...</span>
                                </div>
                            )}
                        </div>

                        {images.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                {images.map((image) => (
                                    <Card
                                        key={image.id}
                                        className="overflow-hidden group relative border border-border"
                                    >
                                        <div className="aspect-square relative bg-muted max-h-52">
                                            <img
                                                src={image.url || "/placeholder.svg"}
                                                alt={image.file.name}
                                                className="object-cover w-full max-h-52"
                                            />
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                className="absolute cursor-pointer top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => onRemoveImage(image.id)}
                                            >
                                                <X className="h-3 w-3" />
                                                <span className="sr-only">Eliminar</span>
                                            </Button>
                                        </div>
                                        <CardFooter className="p-2 text-xs flex justify-between items-center bg-card text-card-foreground">
                                            <span
                                                className="truncate max-w-[240px]"
                                                title={image.file.name}
                                            >
                                                {image.file.name}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {formatFileSize(image.file.size)}
                                            </span>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
