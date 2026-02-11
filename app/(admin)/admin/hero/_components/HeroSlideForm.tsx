'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface HeroSlideFormProps {
    initialData?: {
        id?: string;
        title: string;
        subtitle: string | null;
        image: string;
        ctaText: string;
        ctaLink: string;
        order: number;
        isActive: boolean;
    };
    isEdit?: boolean;
}

export default function HeroSlideForm({ initialData, isEdit = false }: HeroSlideFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        subtitle: initialData?.subtitle || '',
        image: initialData?.image || '',
        ctaText: initialData?.ctaText || 'Shop Collection',
        ctaLink: initialData?.ctaLink || '/shop',
        order: initialData?.order || 0,
        isActive: initialData?.isActive ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/admin/hero/${initialData?.id}` : '/api/admin/hero';
            const method = isEdit ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save slide');

            router.push('/admin/hero');
            router.refresh();
        } catch (error) {
            console.error('Error saving slide:', error);
            alert('Failed to save slide. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/hero" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Slide' : 'New Slide'}</h1>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#0F172A] text-white px-6 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Slide
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Timeless Elegance"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
                        <textarea
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Optional description"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">CTA Text</label>
                            <input
                                type="text"
                                name="ctaText"
                                value={formData.ctaText}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Shop Now"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">CTA Link</label>
                            <input
                                type="text"
                                name="ctaLink"
                                value={formData.ctaLink}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                                placeholder="e.g. /shop/silk-sarees"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar (Image & Settings) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <label className="block text-sm font-medium text-slate-700 mb-4">Slide Image</label>

                        <div className="mb-4">
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="Image URL (e.g. from Unsplash)"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-sm mb-2"
                            />
                            <p className="text-xs text-slate-500">Enter a direct image URL.</p>
                        </div>

                        <div className="aspect-video bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative">
                            {formData.image ? (
                                <Image src={formData.image} alt="Preview" fill className="object-cover" />
                            ) : (
                                <div className="text-center text-slate-400">
                                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <span className="text-sm">No image preview</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-semibold text-slate-900">Settings</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Display Order</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="w-4 h-4 text-[#D4AF37] border-slate-300 rounded focus:ring-[#D4AF37]"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                                Active (Visible on Home)
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
