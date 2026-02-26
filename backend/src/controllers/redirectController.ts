import { Request, Response } from 'express';
import { RedirectService } from '../services/redirectService';

export const handleDynamicRedirect = async (req: Request, res: Response) => {
    const { shortId } = req.params as { shortId: string };

    const destinationUrl = await RedirectService.processScan(shortId, req);

    if (!destinationUrl) {
        res.status(404).send('<h1>QR Code Not Found or Inactive</h1>');
        return;
    }

    // Engage 302 Header redirection effectively routing user browser implicitly
    res.redirect(302, destinationUrl);
};
