import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, description, price, stock, images, categoryId, featured, variants } = body;

        // Basic validation
        if (!title || !price || !categoryId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                title,
                description: description || '',
                price: parseFloat(price),
                stock: parseInt(stock) || 0,
                images: JSON.stringify(images || []),
                categoryId,
                featured: featured || false,
                variants: variants ? JSON.stringify(variants) : null,
            },
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
