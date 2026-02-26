import prisma from '../utils/db';

export class AnalyticsService {
    static async getDashboardStats(userId: string) {
        const qrCodes = await prisma.qRCode.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                qrType: true,
                shortId: true,
                scanCount: true,
                visualSettings: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });

        const totalQRs = qrCodes.length;
        const totalScans = qrCodes.reduce((sum: number, qr: { scanCount: number }) => sum + qr.scanCount, 0);

        const parsedQRCodes = qrCodes.map(qr => ({
            ...qr,
            visualSettings: qr.visualSettings ? JSON.parse(qr.visualSettings) : null
        }));

        return { totalQRs, totalScans, qrCodes: parsedQRCodes };
    }

    static async getSingleQRAnalytics(qrCodeId: string, userId: string) {
        const qr = await prisma.qRCode.findFirst({ where: { id: qrCodeId, userId } });
        if (!qr) throw new Error('QR code not found or unauthorized');

        const logs = await prisma.scanLog.findMany({
            where: { qrCodeId },
            orderBy: { scannedAt: 'desc' },
        });

        // In-memory aggregation of device specs
        const osStats = logs.reduce((acc: Record<string, number>, log: { os: string | null }) => {
            const os = log.os || 'Unknown';
            acc[os] = (acc[os] || 0) + 1;
            return acc;
        }, {});

        const deviceStats = logs.reduce((acc: Record<string, number>, log: { deviceType: string | null }) => {
            const dev = log.deviceType || 'Unknown';
            acc[dev] = (acc[dev] || 0) + 1;
            return acc;
        }, {});

        return {
            totalScans: qr.scanCount,
            recentLogs: logs.slice(0, 100),
            osStats,
            deviceStats
        };
    }
}
