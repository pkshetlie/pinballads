import {useState, useEffect, useRef} from "react";
import {Upload, X, Loader2} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {useLanguage} from "@/lib/language-context";
import {Button} from "@/components/ui/button";

type UploadedImage = {
    url: string; // URL Blob de l'image
    title: string; // Titre de l'image
    uid: string;
    rotation: number;
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
    const [draggedItem, setDraggedItem] = useState<number | null>(null);
    const [isRotating, setIsRotating] = useState<number | null>(null);
    const {t} = useLanguage();
    const {toast} = useToast();
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 10MB in bytes

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const newImages: UploadedImage[] = [];

        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith("image/")) {
                if (file.size > MAX_FILE_SIZE) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: `${t('collection.toasts.imageTooLarge')} "${file.name}" ${t('collection.toasts.imageTooLargeDescription')}`,
                    });
                    return;
                }

                newImages.push({
                    url: URL.createObjectURL(file),
                    title: `Photo ${uploadedImages.length + index + 1}`, // Titre par défaut
                    uid: "none",
                    rotation: 0,
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
            prev.map((image, i) => (i === index ? {...image, title: newTitle} : image))
        );
    };

    const handleImageDragStart = (index: number) => {
        setDraggedItem(index);
    };

    const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === index) return;

        setUploadedImages(prev => {
            const newImages = [...prev];
            const draggedImage = newImages[draggedItem];
            newImages.splice(draggedItem, 1);
            newImages.splice(index, 0, draggedImage);
            return newImages;
        });
        setDraggedItem(index);
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
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4"/>
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
                        <div
                            key={index}
                            className="relative group cursor-move"
                            draggable
                            onDragStart={() => handleImageDragStart(index)}
                            onDragOver={(e) => handleImageDragOver(e, index)}
                        >
                            
                            <div className="relative">
                                <img
                                    src={image.url || "/placeholder.svg"}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border"
                                />
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        setIsRotating(index);
                                        const canvas = document.createElement('canvas');
                                        const ctx = canvas.getContext('2d');
                                        const img = new Image();
                                        img.crossOrigin = "anonymous";

                                        img.onload = () => {
                                            canvas.width = img.height;
                                            canvas.height = img.width;

                                            if (ctx) {
                                                ctx.translate(canvas.width / 2, canvas.height / 2);
                                                ctx.rotate(Math.PI / 2);
                                                ctx.drawImage(img, -img.width / 2, -img.height / 2);
                                            }

                                            canvas.toBlob((blob) => {
                                                if (blob) {
                                                    const newUrl = URL.createObjectURL(blob);
                                                    setUploadedImages(prev =>
                                                        prev.map((img, i) =>
                                                            i === index ? {...img, url: newUrl} : img
                                                        )
                                                    );
                                                }
                                                setIsRotating(null);
                                            }, 'image/jpeg');
                                        };
                                        img.src = image.url;
                                    }}
                                    className="absolute cursor-pointer top-2 left-2 bg-primary text-primary-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                        <path d="M3 3v5h5"/>
                                    </svg>
                                </Button>
                                {isRotating === index && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                                        <Loader2 className="w-6 h-6 animate-spin text-white"/>
                                    </div>
                                )}
                            </div>
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
                                <X className="w-4 h-4"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
