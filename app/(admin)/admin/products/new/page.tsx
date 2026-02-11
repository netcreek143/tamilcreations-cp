'use client';

import ProductForm from '../_components/ProductForm';

export default function NewProductPage() {
    return (
        <div className="min-h-screen bg-muted py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Add New Product</h1>
                    <p className="text-gray-600">Create a new product for your store.</p>
                </div>
                <ProductForm />
            </div>
        </div>
    );
}
