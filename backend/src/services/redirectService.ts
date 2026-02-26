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
        else if (/android/i.test(userAgentStr)) {
            const match = userAgentStr.match(/Android\s+([\d\.]+)/i);
            os = match ? `Android ${match[1]}` : 'Android';
        }
        else if (/ios|iphone|ipad/i.test(userAgentStr)) {
            const match = userAgentStr.match(/OS\s+([\d_]+)/i);
            os = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS';
        }

        let browser = 'Unknown';
        if (/chrome/i.test(userAgentStr)) browser = 'Chrome';
        else if (/safari/i.test(userAgentStr)) browser = 'Safari';
        else if (/firefox/i.test(userAgentStr)) browser = 'Firefox';
        else if (/edge/i.test(userAgentStr)) browser = 'Edge';

        // Best-effort remote ID determination 
        let ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'Unknown';

        // If x-forwarded-for has multiple IPs (comma separated), take the first one
        if (ipAddress.includes(',')) {
            ipAddress = ipAddress.split(',')[0].trim();
        }

        // Spawn an isolated background task for database metrics avoiding primary thread blocking
        Promise.resolve().then(async () => {
            try {
                let country = 'Unknown';
                let city = 'Unknown';

                // Only lookup if it's a real-looking IP
                if (ipAddress && ipAddress !== 'Unknown' && !ipAddress.startsWith('127.') && !ipAddress.startsWith('::1')) {
                    try {
                        const geoResponse = await fetch(`http://ip-api.com/json/${ipAddress}`);
                        const geoData = await geoResponse.json() as any;
                        if (geoData.status === 'success') {
                            country = geoData.country || 'Unknown';
                            city = geoData.city || 'Unknown';
                        }
                    } catch (geoErr) {
                        console.error('[RedirectService] GeoIP lookup failed:', geoErr);
                    }
                }

                // Enhanced device identification (Attempting to find brand names)
                let enhancedDevice = deviceType;
                if (/iphone/i.test(userAgentStr)) enhancedDevice = 'iPhone';
                else if (/ipad/i.test(userAgentStr)) enhancedDevice = 'iPad';
                else if (/samsung|sm-|gt-/i.test(userAgentStr)) enhancedDevice = 'Samsung';
                else if (/pixel/i.test(userAgentStr)) enhancedDevice = 'Google Pixel';
                else if (/redmi|xiaomi|mi /i.test(userAgentStr)) enhancedDevice = 'Redmi/Xiaomi';
                else if (/lenovo/i.test(userAgentStr)) enhancedDevice = 'Lenovo';
                else if (/huawei|honor/i.test(userAgentStr)) enhancedDevice = 'Huawei';
                else if (/oppo/i.test(userAgentStr)) enhancedDevice = 'Oppo';
                else if (/vivo/i.test(userAgentStr)) enhancedDevice = 'Vivo';
                else if (/oneplus/i.test(userAgentStr)) enhancedDevice = 'OnePlus';

                await prisma.$transaction([
                    prisma.scanLog.create({
                        data: {
                            qrCodeId: qrCode.id,
                            ipAddress,
                            userAgent: userAgentStr,
                            deviceType: enhancedDevice,
                            os,
                            browser,
                            country,
                            city,
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
