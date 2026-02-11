import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const slide = await prisma.heroSlide.findUnique({
            where: { id: params.id },
        });
        if (!slide) return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
        return NextResponse.json(slide);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch slide' }, { status: 500 });
    }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const slide = await prisma.heroSlide.update({
            where: { id: params.id },
            data: body,
        });

        return NextResponse.json(slide);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.heroSlide.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
    }
}
