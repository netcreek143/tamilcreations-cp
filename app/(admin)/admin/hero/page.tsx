'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, ArrowLeft, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import Image from 'next/image';

interface HeroSlide {
    id: string;
    title: string;
    subtitle: string | null;
    image: string;
    ctaText: string;
    ctaLink: string;
    order: number;
    isActive: boolean;
}

export default function HeroSlidesPage() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const res = await fetch('/api/admin/hero');
            if (res.ok) {
                const data = await res.json();
                setSlides(data);
            }
        } catch (error) {
            console.error('Failed to fetch slides', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this slide?')) return;
        try {
            const res = await fetch(`/api/admin/hero/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSlides(slides.filter(s => s.id !== id));
            }
        } catch (error) {
            alert('Failed to delete slide');
        }
    };

    const toggleActive = async (id: string, currentState: boolean) => {
        try {
            const res = await fetch(`/api/admin/hero/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentState })
            });
            if (res.ok) {
                fetchSlides();
            }
        } catch (error) {
            console.error('Failed to toggle status');
        }
    };

    const moveSlide = async (id: string, direction: 'up' | 'down') => {
        // Optimistic update would be better, but simple refetch for now
        // This requires a backend endpoint to handle reordering or manual swap logic
        // For MVP, we'll just implement the UI and simple logic if backend supports it
        // Or we can swap orders of two items locally then send updates
        console.log('Reorder not fully implemented yet');
    };

    return (
        <div className="min-h-screen bg-muted py-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/admin" className="text-gray-500 hover:text-gray-700 flex items-center mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold">Hero Slides</h1>
                        <p className="text-gray-600">Manage homepage slider content</p>
                    </div>
                    <Link href="/admin/hero/new" className="btn btn-primary flex items-center bg-[#0F172A] text-white px-4 py-2 rounded-lg hover:bg-[#1E293B] transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Slide
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                                <tr>
                                    <th className="px-6 py-4">Image</th>
                                    <th className="px-6 py-4">Content</th>
                                    <th className="px-6 py-4">Order</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                                ) : slides.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No slides found</td></tr>
                                ) : (
                                    slides.map((slide) => (
                                        <tr key={slide.id} className="hover:bg-gray-50 group">
                                            <td className="px-6 py-4">
                                                <div className="relative w-24 h-16 rounded overflow-hidden bg-gray-100 border">
                                                    <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{slide.title}</div>
                                                <div className="text-xs text-gray-500">{slide.subtitle}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm">{slide.order}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleActive(slide.id, slide.isActive)}
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                                >
                                                    {slide.isActive ? 'Active' : 'Draft'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/hero/${slide.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(slide.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
