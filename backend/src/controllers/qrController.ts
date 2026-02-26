import { Request, Response } from 'express';
import { QRService } from '../services/qrService';
import { UserService } from '../services/userService';

export const createQR = async (req: Request, res: Response) => {
    let userId: string | undefined = undefined;

    if (req.user) {
        userId = req.user.id;
        const email = req.user.email;
        // Sync user context natively first
        await UserService.syncUser(userId, email);
    }

    const qrCode = await QRService.createQRCode(userId, req.body);
    res.status(201).json({ success: true, data: qrCode });
};

export const getMyQRs = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const qrCodes = await QRService.getUserQRCodes(userId);
    res.status(200).json({ success: true, data: qrCodes });
};

export const getQRById = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };

    const qrCode = await QRService.getQRCodeById(id, userId);
    if (!qrCode) {
        res.status(404);
        throw new Error('QR Code not found');
    }

    res.status(200).json({ success: true, data: qrCode });
};

export const updateQR = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };

    const updatedQR = await QRService.updateQRCode(id, userId, req.body);
    res.status(200).json({ success: true, data: updatedQR });
};

export const deleteQR = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params as { id: string };

    await QRService.deleteQRCode(id, userId);
    res.status(200).json({ success: true, message: 'QR Code deleted successfully' });
};
