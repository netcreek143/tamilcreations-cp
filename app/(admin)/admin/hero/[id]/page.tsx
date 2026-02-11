'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import HeroSlideForm from '../_components/HeroSlideForm';
import { Loader2 } from 'lucide-react';

export default function EditHeroSlidePage() {
    const params = useParams();
    const [slide, setSlide] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSlide();
    }, []);

    const fetchSlide = async () => {
        try {
            const res = await fetch(`/api/admin/hero/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setSlide(data);
            }
        } catch (error) {
            console.error('Failed to fetch slide');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-muted flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!slide) {
        return (
            <div className="min-h-screen bg-muted flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Slide not found</h2>
                    <p className="text-slate-500">The slide you requested does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted py-8">
            <div className="container mx-auto px-4">
                <HeroSlideForm initialData={slide} isEdit />
            </div>
        </div>
    );
}
