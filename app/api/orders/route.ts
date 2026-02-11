import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { items, address, subtotal, shipping, total } = body;

        // Create address first
        const addressRecord = await prisma.address.create({
            data: {
                userId: session.user.id,
                fullName: address.fullName,
                phone: address.phone,
                addressLine: address.addressLine,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                isDefault: false,
            },
        });

        // Create order and update stock in a transaction
        const order = await prisma.$transaction(async (tx: any) => {
            // 1. Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId: session.user.id,
                    addressId: addressRecord.id,
                    items: JSON.stringify(items),
                    subtotal,
                    shipping,
                    total,
                    status: 'PENDING',
                },
            });

            // 2. Process items: Create OrderItems and Update Stock
            for (const item of items) {
                // Create OrderItem
                await tx.orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        variant: item.variant || null,
                    },
                });

                // Decrement Stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return newOrder;
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            message: 'Order placed successfully',
        });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: {
                address: true,
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
