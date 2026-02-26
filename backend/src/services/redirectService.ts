import prisma from '../utils/db';
import { Request } from 'express';

export class RedirectService {
    static async processScan(shortId: string, req: Request): Promise<string | null> {
        const qrCode = await prisma.qRCode.findUnique({
            where: { shortId },
        });

        if (!qrCode) return null;

        // Parse analytics context lazily
        const userAgentStr = req.headers['user-agent'] || '';

        let deviceType = 'Desktop';
        if (/mobile/i.test(userAgentStr)) deviceType = 'Mobile';
        else if (/tablet/i.test(userAgentStr)) deviceType = 'Tablet';

        let os = 'Unknown';
        if (/windows/i.test(userAgentStr)) os = 'Windows';
        else if (/mac/i.test(userAgentStr)) os = 'macOS';
        else if (/linux/i.test(userAgentStr)) os = 'Linux';
        else if (/android/i.test(userAgentStr)) os = 'Android';
        else if (/ios|iphone|ipad/i.test(userAgentStr)) os = 'iOS';

        let browser = 'Unknown';
        if (/chrome/i.test(userAgentStr)) browser = 'Chrome';
        else if (/safari/i.test(userAgentStr)) browser = 'Safari';
        else if (/firefox/i.test(userAgentStr)) browser = 'Firefox';
        else if (/edge/i.test(userAgentStr)) browser = 'Edge';

        // Best-effort remote ID determination 
        const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown';

        // Spawn an isolated background task for database metrics avoiding primary thread blocking
        Promise.resolve().then(async () => {
            try {
                await prisma.$transaction([
                    prisma.scanLog.create({
                        data: {
                            qrCodeId: qrCode.id,
                            ipAddress,
                            userAgent: userAgentStr,
                            deviceType,
                            os,
                            browser,
                        }
                    }),
                    prisma.qRCode.update({
                        where: { id: qrCode.id },
                        data: { scanCount: { increment: 1 } }
                    })
                ]);
            } catch (err) {
                console.error('[RedirectService] Fast logging failed:', err);
            }
        });

        // Formulate final Destination Endpoint
        if (qrCode.qrType === 'URL' && qrCode.targetUrl) {
            return qrCode.targetUrl;
        } else if (qrCode.qrType === 'WHATSAPP' && qrCode.whatsappNumber) {
            const text = qrCode.whatsappText ? `?text=${encodeURIComponent(qrCode.whatsappText)}` : '';
            return `https://wa.me/${qrCode.whatsappNumber.replace(/[^0-9]/g, '')}${text}`;
        }

        return null;
    }
}
