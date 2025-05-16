'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Star, Loader2, ImagePlus } from "lucide-react"
import Image from "next/image"
import axios from "axios"

interface ReviewFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ReviewForm({ isOpen, onClose }: ReviewFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: 5,
        review: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>('')

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast(

                'File size must be less than 5MB'

            );
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast(

                'File must be an image (JPG, PNG, WEBP)'

            );
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setImageUrl(response.data.secure_url);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    imageUrl
                }),
            });

            if (response.ok) {
                toast.success("Review submitted successfully!");
                setFormData({ name: '', email: '', rating: 5, review: '' });
                setImageUrl('');
                onClose();
            } else {
                toast.error("Failed to submit review");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-['Playfair_Display'] text-[#462901]">Share Your Experience</DialogTitle>
                    <DialogDescription>
                        We'd love to hear about your experience with Street Comfort.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: star })}
                                className={`p-1 ${formData.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                            >
                                <Star className="w-6 h-6 fill-current" />
                            </button>
                        ))}
                    </div>
                    <Textarea
                        placeholder="Your Review"
                        value={formData.review}
                        onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                        required
                        className="min-h-[100px]"
                    />

                    <div className="space-y-4">
                        {imageUrl && (
                            <div className="relative w-full h-[120px] bg-gray-50 rounded-lg">
                                <Image
                                    fill
                                    src={imageUrl}
                                    alt="Review Image"
                                    className="object-contain rounded-lg p-2"
                                />
                            </div>
                        )}
                        <div className="relative">
                            <Input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageUpload}
                                disabled={isUploading || isSubmitting}
                                className="hidden"
                                id="image-upload"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('image-upload')?.click()}
                                disabled={isUploading || isSubmitting}
                                className="w-full border-[#593C2D] text-[#593C2D] hover:bg-[#593C2D] hover:text-white"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <ImagePlus className="h-4 w-4 mr-2" />
                                        {imageUrl ? 'Change Image' : 'Add Image (Optional)'}
                                    </>
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Maximum file size: 5MB. Accepted formats: JPG, PNG, WEBP
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#593C2D] hover:bg-[#462901] text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Review'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
} 