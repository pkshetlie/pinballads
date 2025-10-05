"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, X, ChevronLeft, ChevronRight } from "lucide-react"
import config from "@/config";

interface ImageZoomModalProps {
  isOpen: boolean
  onClose: () => void
  images: {
    url: string,
    title: string,
    uid: string,
  }[]
  initialIndex: number
  title: string
}

export function ImageZoomModal({ isOpen, onClose, images, initialIndex }: ImageZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)

  // Reset zoom when image changes
  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [currentIndex])

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen, initialIndex])

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.5, 5))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.5, 0.5))
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale((prev) => Math.min(Math.max(prev * delta, 0.5), 5))
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowLeft":
        goToPrevious()
        break
      case "ArrowRight":
        goToNext()
        break
      case "Escape":
        onClose()
        break
      case "+":
      case "=":
        handleZoomIn()
        break
      case "-":
        handleZoomOut()
        break
      case "0":
        handleReset()
        break
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Close button */}
          {/*<Button*/}
          {/*  onClick={onClose}*/}
          {/*  size="sm"*/}
          {/*  variant="ghost"*/}
          {/*  className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"*/}
          {/*>*/}
          {/*  <X className="w-4 h-4" />*/}
          {/*</Button>*/}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <Button
                onClick={goToPrevious}
                size="sm"
                variant="ghost"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                onClick={goToNext}
                size="sm"
                variant="ghost"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/50 rounded-lg p-2">
            <Button onClick={handleZoomOut} size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button onClick={handleReset} size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button onClick={handleZoomIn} size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <div className="text-white text-sm px-2 py-1 min-w-[60px] text-center">{Math.round(scale * 100)}%</div>
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 z-50 bg-black/50 rounded-lg px-3 py-1 text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Main image */}
          <div
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <img
              ref={imageRef}
              src={`${images[currentIndex].url}` || `${config.CDN_BASE_URL}/placeholder.png`}
              alt={`${images[currentIndex].title}`}
              className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              }}
              draggable={false}
            />
          </div>

          {/* Instructions */}
          {/*<div className="absolute bottom-4 right-4 z-50 text-white/70 text-xs bg-black/50 rounded-lg p-2 max-w-[200px]">*/}
          {/*  <div>Molette: Zoom</div>*/}
          {/*  <div>Clic + glisser: Déplacer</div>*/}
          {/*  <div>Flèches: Navigation</div>*/}
          {/*</div>*/}
        </div>
      </DialogContent>
    </Dialog>
  )
}
