import CategoryForm from '../_components/CategoryForm';

export default function NewCategoryPage() {
    return (
        <div className="min-h-screen bg-muted py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Add New Category</h1>
                    <p className="text-gray-600">Create a new category for your products.</p>
                </div>
                <CategoryForm />
            </div>
        </div>
    );
}
