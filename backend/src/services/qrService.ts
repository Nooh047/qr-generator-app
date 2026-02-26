import prisma from '../utils/db';
import crypto from 'crypto';

interface CreateQRData {
    title: string;
    qrType: 'URL' | 'WHATSAPP';
    targetUrl?: string;
    whatsappNumber?: string;
    whatsappText?: string;
    visualSettings?: any;
}

export class QRService {
    static async createQRCode(userId: string | undefined, data: CreateQRData) {
        const shortId = crypto.randomBytes(4).toString('hex'); // Generate an 8-character unique route slug

        const qr = await prisma.qRCode.create({
            data: {
                userId: userId || null,
                title: data.title,
                qrType: data.qrType,
                targetUrl: data.targetUrl,
                whatsappNumber: data.whatsappNumber,
                whatsappText: data.whatsappText,
                shortId,
                visualSettings: data.visualSettings ? JSON.stringify(data.visualSettings) : null,
            },
        });

        return {
            ...qr,
            visualSettings: qr.visualSettings ? JSON.parse(qr.visualSettings) : null
        };
    }

    static async getUserQRCodes(userId: string) {
        const qrs = await prisma.qRCode.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return qrs.map(qr => ({
            ...qr,
            visualSettings: qr.visualSettings ? JSON.parse(qr.visualSettings) : null
        }));
    }

    static async getQRCodeById(id: string, userId: string) {
        const qr = await prisma.qRCode.findFirst({
            where: { id, userId },
        });

        if (!qr) return null;

        return {
            ...qr,
            visualSettings: qr.visualSettings ? JSON.parse(qr.visualSettings) : null
        };
    }

    static async updateQRCode(id: string, userId: string, data: Partial<CreateQRData>) {
        const qr = await prisma.qRCode.findFirst({ where: { id, userId } });
        if (!qr) throw new Error('QR Code not found or unauthorized');

        const updatedQR = await prisma.qRCode.update({
            where: { id },
            data: {
                title: data.title !== undefined ? data.title : undefined,
                targetUrl: data.targetUrl !== undefined ? data.targetUrl : undefined,
                whatsappNumber: data.whatsappNumber !== undefined ? data.whatsappNumber : undefined,
                whatsappText: data.whatsappText !== undefined ? data.whatsappText : undefined,
                visualSettings: data.visualSettings !== undefined ? (data.visualSettings ? JSON.stringify(data.visualSettings) : null) : undefined,
            },
        });

        return {
            ...updatedQR,
            visualSettings: updatedQR.visualSettings ? JSON.parse(updatedQR.visualSettings) : null
        };
    }

    static async deleteQRCode(id: string, userId: string) {
        const qr = await prisma.qRCode.findFirst({ where: { id, userId } });
        if (!qr) throw new Error('QR Code not found or unauthorized');

        return prisma.qRCode.delete({ where: { id } });
    }
}
