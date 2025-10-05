import { useState, useEffect, useRef } from "react";
import { Upload, X } from "lucide-react";

type UploadedImage = {
  url: string; // URL Blob de l'image
  title: string; // Titre de l'image
  uid: string;
};

export default function PhotoUploader({
  uploadedImages,
  setUploadedImages,
}: {
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: UploadedImage[] = [];

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        newImages.push({
          url: URL.createObjectURL(file),
          title: `Photo ${uploadedImages.length + index + 1}`, // Titre par défaut
          uid: "none",
        });
      }
    });

    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const updateImageTitle = (index: number, newTitle: string) => {
    setUploadedImages((prev) =>
      prev.map((image, i) => (i === index ? { ...image, title: newTitle } : image))
    );
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? "border-primary/70 bg-primary/10" : "border-muted"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
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
                src={image.url || "/placeholder.svg"}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <input
                type="text"
                placeholder={`Photo ${index + 1}`}
                value={image.title}
                onChange={(e) => updateImageTitle(index, e.target.value)}
                className="mt-1 w-full p-2 border rounded"
              />
              <input
              type="hidden"
              name={"uid"}
              value={image.uid}/>
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
