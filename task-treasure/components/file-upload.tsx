"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  selectedFile: File | null
  previewUrl: string | null
  accept?: string
  maxSize?: number
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  previewUrl,
  accept = "image/png, image/jpeg, image/jpg",
  maxSize = 5 * 1024 * 1024, // 5MB
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      // Check file type
      if (accept && !accept.split(", ").includes(file.type)) {
        setError(`Please upload a valid file type (${accept})`)
        return
      }

      // Check file size
      if (maxSize && file.size > maxSize) {
        setError(`File size should be less than ${maxSize / (1024 * 1024)}MB`)
        return
      }

      setError(null)
      onFileSelect(file)
    }
  }

  return (
    <div className="space-y-2">
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        {previewUrl ? (
          <div className="space-y-4">
            <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
            <div className="flex justify-center">
              <Button type="button" variant="outline" onClick={onFileRemove}>
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">
              {accept.replace(/image\//g, "").toUpperCase()} (max. {maxSize / (1024 * 1024)}MB)
            </p>
            <input id="file-upload" type="file" accept={accept} className="hidden" onChange={handleFileChange} />
            <Button type="button" variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
              Select File
            </Button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

