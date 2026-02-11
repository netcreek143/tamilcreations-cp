import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CategoryForm from '../_components/CategoryForm';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-muted py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Edit Category</h1>
                    <p className="text-gray-600">Update category details.</p>
                </div>
                <CategoryForm initialData={category} isEditing />
            </div>
        </div>
    );
}
