import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch dashboard statistics
        const [
            totalOrders,
            totalRevenue,
            totalProducts,
            totalCustomers,
            recentOrders,
        ] = await Promise.all([
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: {
                    total: true,
                },
            }),
            prisma.product.count(),
            prisma.user.count({
                where: { role: 'CUSTOMER' },
            }),
            prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
        ]);

        return NextResponse.json({
            totalOrders,
            totalRevenue: totalRevenue._sum.total || 0,
            totalProducts,
            totalCustomers,
            recentOrders,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
