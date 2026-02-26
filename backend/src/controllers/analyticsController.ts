import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';

export const getDashboardSummary = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const stats = await AnalyticsService.getDashboardStats(userId);
    res.status(200).json({ success: true, data: stats });
};

export const getQRSpecificAnalytics = async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { qrId } = req.params as { qrId: string };
    const analytics = await AnalyticsService.getSingleQRAnalytics(qrId, userId);
    res.status(200).json({ success: true, data: analytics });
};
