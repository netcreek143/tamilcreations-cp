import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const slides = await prisma.heroSlide.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(slides);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, subtitle, image, ctaText, ctaLink, order, isActive } = body;

        const slide = await prisma.heroSlide.create({
            data: {
                title,
                subtitle,
                image,
                ctaText,
                ctaLink,
                order: parseInt(order) || 0,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(slide);
    } catch (error) {
        console.error('Error creating slide:', error);
        return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
    }
}
