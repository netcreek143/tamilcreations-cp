'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, ArrowLeft, Save, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        images: [''],
        featured: false,
        variants: '', // JSON string
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                price: initialData.price.toString() || '',
                stock: initialData.stock.toString() || '',
                categoryId: initialData.categoryId || '',
                images: JSON.parse(initialData.images || '[""]'),
                featured: initialData.featured || false,
                variants: initialData.variants || '',
            });
        }
        fetchCategories();
    }, [initialData]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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

            const newImages = [...formData.images];
            newImages[index] = result.url;
            setFormData(prev => ({ ...prev, images: newImages }));
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
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: formData.images.filter(img => img.trim() !== ''),
                variants: formData.variants ? JSON.parse(formData.variants) : null,
            };

            const url = isEditing
                ? `/api/admin/products/${initialData.id}`
                : '/api/admin/products';

            const method = isEditing ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save product');

            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <Link href="/admin/products" className="text-gray-500 hover:text-gray-700 flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Products
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center"
                >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isEditing ? 'Update Product' : 'Create Product'}
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                <h3 className="text-lg font-semibold border-b pb-4">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Product Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                            placeholder="e.g., Silk Saree"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                        placeholder="Detailed product description..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            id="featured"
                            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="featured" className="text-sm font-medium">Featured Product</label>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-lg font-semibold">Images</h3>
                </div>

                <div className="space-y-4">
                    {formData.images.map((url, index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        placeholder="Image URL or upload file..."
                                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary"
                                    />
                                    <label className={`cursor-pointer btn btn-secondary px-3 py-2 flex items-center ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, index)}
                                            disabled={uploading}
                                        />
                                        <Upload className="w-4 h-4" />
                                    </label>
                                </div>
                                {url && (
                                    <div className="relative w-20 h-20 border rounded overflow-hidden">
                                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            {formData.images.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded mt-1"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addImageField}
                        className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Image URL
                    </button>
                    <p className="text-xs text-gray-500">Note: Enter valid image URLs. The first image will be the main image.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                <h3 className="text-lg font-semibold border-b pb-4">Advanced: Variants (JSON)</h3>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Variants Config (Optional)</label>
                    <textarea
                        name="variants"
                        value={formData.variants}
                        onChange={handleChange}
                        rows={6}
                        className="w-full p-2 border rounded font-mono text-sm focus:ring-2 focus:ring-primary"
                        placeholder={'Example: [{"type": "Size", "options": ["S", "M", "L"]}, {"type": "Color", "options": ["Red", "Blue"]}]'}
                    />
                    <p className="text-xs text-gray-500">
                        Enter a valid JSON array for product variants (sizes, colors, etc).
                    </p>
                </div>
            </div>
        </form>
    );
}
