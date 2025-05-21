"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { getTranslation } from "@/lib/i18n"

interface MediaUploadProps {
  language: string
  onMediaUpload: (files: File[]) => void
}

export default function MediaUpload({ language, onMediaUpload }: MediaUploadProps) {
  const [mediaFiles, setMediaFiles] = useState<{ file: File; preview: string; type: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith("image/") ? "image" : "video",
      }))

      setMediaFiles((prev) => [...prev, ...newFiles])
      onMediaUpload(newFiles.map((item) => item.file))
    }
  }

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {getTranslation("uploadMedia", language)}
        </Button>
        <p className="text-sm text-gray-500">{getTranslation("uploadMediaDescription", language)}</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*"
          multiple
        />
      </div>

      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {mediaFiles.map((media, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => removeMedia(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardContent className="p-2 h-32 flex items-center justify-center">
                {media.type === "image" ? (
                  <div className="relative w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={media.preview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <video src={media.preview} controls className="w-full h-full object-cover rounded" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
