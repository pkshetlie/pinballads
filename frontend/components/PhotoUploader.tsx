import { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";

export default function PhotoUploader({ uploadedImages, setUploadedImages }) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const newImages: string[] = [];
        const invalid: number[] = [];

        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith("image/")) {
                newImages.push(URL.createObjectURL(file));
            } else {
                invalid.push(index);
            }
        });

        if (invalid.length > 0) {
            setInvalidFiles(invalid);
            setTimeout(() => setInvalidFiles([]), 1500); // effet clignotant pendant 1.5s
        }

        setUploadedImages(prev => [...prev, ...newImages]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div>
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging ? "border-primary/70 bg-primary/10" : "border-muted"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
            >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Drag & drop your photos here</p>
                <p className="text-sm text-muted-foreground">or click to select files</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </div>

            {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image || "/placeholder.svg"}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
                                }
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
