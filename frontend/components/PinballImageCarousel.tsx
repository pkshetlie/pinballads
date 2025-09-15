"use client"

import {useState} from "react"
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Heart, Share2, ZoomIn} from "lucide-react"
import { ImageZoomModal } from "./image-zoom-modal"
import config from "@/config"
import {useLanguage} from "@/lib/language-context";
import {PinballDto} from "@/components/Object/pinball";

interface PinballImageCarouselProps {
    machine: PinballDto
    showActions?: boolean
    className?: string
}

export function PinballImageCarousel({
                                        machine,
                                         showActions = true,
                                         className = "",
                                     }: PinballImageCarouselProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false)
    const [zoomImageIndex, setZoomImageIndex] = useState(0)
    const {t} = useLanguage()
    const displayImages = machine.images.length > 0 ? machine.images : [{title: "no image", url: "uploads/pinballs/placeholder.png"},{title: "no image", url: "uploads/pinballs/placeholder.png"}]
    const limitedImages = displayImages.slice(0, 10)

    const handleImageClick = (index: number) => {
        setZoomImageIndex(index)
        setIsZoomModalOpen(true)
    }

    return (
        <div className={`relative ${className}`}>
            <Carousel className="w-full">
                <CarouselContent>
                    {limitedImages.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="aspect-[4/3] overflow-hidden rounded-lg relative group">
                                <img
                                    src={`${config.CDN_BASE_URL}${image.url}` || `${config.CDN_BASE_URL}/placeholder.png`}
                                    alt={`${machine.title} - Image ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {limitedImages.length > 1 && (
                                    <div className="absolute bottom-4 left-4">
                                        <Badge variant="secondary" className="bg-background/90 text-foreground">
                                            {index + 1} / {limitedImages.length}
                                        </Badge>
                                    </div>
                                )}

                                {/* Zoom overlay on hover */}
                                <div
                                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center cursor-zoom-in"
                                    onClick={() => handleImageClick(index)}
                                >
                                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation arrows - only show if more than 1 image */}
                {limitedImages.length > 1 && (
                    <>
                        <CarouselPrevious className="left-4"/>
                        <CarouselNext className="right-4"/>
                    </>
                )}
            </Carousel>

            {/* Action buttons */}
            {showActions && (
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
                        <Heart className="w-4 h-4"/>
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
                        <Share2 className="w-4 h-4"/>
                    </Button>
                </div>
            )}
            <ImageZoomModal
                isOpen={isZoomModalOpen}
                onClose={() => setIsZoomModalOpen(false)}
                images={limitedImages}
                initialIndex={zoomImageIndex}
                title={machine.name}
            />
        </div>
    )
}
