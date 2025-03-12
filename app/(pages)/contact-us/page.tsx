"use client"

import { PageHero } from "../pageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        telephone: '',
        email: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text)
            .then(() => toast.success(`${type} copied to clipboard`))
            .catch(() => toast.error("Failed to copy"));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Message sent successfully!");
                setFormData({ name: '', telephone: '', email: '', message: '' });
            } else {
                toast.error("Failed to send message");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageHero
                title="Contact Us"
                description="Get in touch with us for any inquiries about our jewelry collection or services."
            />

            {/* Contact Info Cards */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[#FDF7F5] p-8 rounded-2xl text-center">
                            <div className="w-16 h-16 bg-[#B68C66] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-['Playfair_Display'] text-lg text-[#462901] mb-2">Phone Number</h3>
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-[#462901]/80">+234 806 028 3727</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopy('+234 806 028 3727', 'Phone number')}
                                >
                                    📋
                                </Button>
                            </div>
                        </div>

                        <div className="bg-[#FDF7F5] p-8 rounded-2xl text-center">
                            <div className="w-16 h-16 bg-[#B68C66] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-['Playfair_Display'] text-lg text-[#462901] mb-2">Email Address</h3>
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-[#462901]/80">shimmer.info@mail.com</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopy('shimmer.info@mail.com', 'Email')}
                                >
                                    📋
                                </Button>
                            </div>
                        </div>

                        <div className="bg-[#FDF7F5] p-8 rounded-2xl text-center">
                            <div className="w-16 h-16 bg-[#B68C66] rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-['Playfair_Display'] text-lg text-[#462901] mb-2">Location</h3>
                            <p className="text-[#462901]/80">Jl. Wilis no.13, Malang</p>
                        </div>

                        <div className="bg-[#FDF7F5] p-8 rounded-2xl text-center">
                            <div className="w-16 h-16 bg-[#B68C66] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="font-['Playfair_Display'] text-lg text-[#462901] mb-2">Work Hour</h3>
                            <p className="text-[#462901]/80">7 PM - 9AM , Mon - Sat</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-['Playfair_Display'] text-[#462901] mb-4">
                                Send Us Message
                            </h2>
                            <p className="text-[#462901]/60">
                                We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="Name"
                                    className="bg-[#FDF7F5] border-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Telephone"
                                    className="bg-[#FDF7F5] border-none"
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                    required
                                />
                            </div>
                            <Input
                                placeholder="Email"
                                className="bg-[#FDF7F5] border-none"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <Textarea
                                placeholder="Message"
                                className="bg-[#FDF7F5] border-none min-h-[150px]"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                            <Button
                                className="w-full bg-[#593C2D] hover:bg-[#462901]/90 text-white"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send Now'}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}
