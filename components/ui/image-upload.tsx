"use client"

import { useCallback, useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ImagePlus, Trash } from "lucide-react"

// Add cloud name configuration
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

if (!cloudName) {
    throw new Error('Missing Cloudinary cloud name')
}

interface ImageUploadProps {
    value: string[]
    onChange: (value: string[]) => void
    onRemove: (value: string) => void
}

export function ImageUpload({
    value,
    onChange,
    onRemove
}: ImageUploadProps) {
    

    return (
        <div>
            <div className="mb-4 flex items-center gap-4 flex-wrap">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px]">
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover rounded-lg"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                    maxFiles: 5,
                    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                }}
                onQueuesEnd={(result: any) => {
                    console.log("Queues end result:", result);
                    
                    if ('info' in result && Array.isArray(result.info.files)) {
                        // Extract secure_urls from all successfully uploaded files
                        const newUrls = result.info.files
                            .filter((file: { status: string; uploadInfo: { secure_url: string } }) => file.status === "success")
                            .map((file: { uploadInfo: { secure_url: string } }) => file.uploadInfo.secure_url);

                        console.log("New URLs to add:", newUrls);
                        
                        // Combine with existing URLs
                        const updatedUrls = [...value, ...newUrls];
                        console.log("Final image array:", updatedUrls);
                        
                        // Update form state
                        onChange(updatedUrls);
                    }
                    
                    result.widget.close();
                }}
            >
                {({ open }) => (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            console.log("Opening upload widget");
                            open?.();
                        }}
                        className="border-[#593C2D] text-[#593C2D] hover:bg-[#593C2D] hover:text-white"
                    >
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Upload Images ({value.length} uploaded)
                    </Button>
                )}
            </CldUploadWidget>
            <div className="mt-2 text-sm text-gray-500">
                {value.length > 0 ? `${value.length} images uploaded` : 'No images uploaded yet'}
            </div>
        </div>
    )
} 