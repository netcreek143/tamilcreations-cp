'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, ArrowLeft, Save, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                slug: initialData.slug || '',
                description: initialData.description || '',
                image: initialData.image || '',
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = { ...prev, [name]: value };
            if (name === 'name' && !isEditing) {
                updates.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            return updates;
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            });

            if (!res.ok) throw new Error('Upload failed');

            const result = await res.json();
            setFormData(prev => ({ ...prev, image: result.url }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEditing
                ? `/api/admin/categories/${initialData.id}`
                : '/api/admin/categories';

            const method = isEditing ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to save category');
            }

            router.push('/admin/categories');
            router.refresh();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Error saving category: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <Link href="/admin/categories" className="text-gray-500 hover:text-gray-700 flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Categories
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center"
                >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Update Category' : 'Create Category'}
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                            placeholder="e.g., Summer Collection"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary bg-gray-50 text-gray-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                            placeholder="Optional description..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Image</label>
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                    placeholder="Image URL or upload..."
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary mb-2"
                                />
                                <label className={`cursor-pointer btn btn-outline w-full flex items-center justify-center gap-2 ${uploading ? 'opacity-50' : ''}`}>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                </label>
                            </div>
                            {formData.image && (
                                <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                                    <Image
                                        src={formData.image}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
