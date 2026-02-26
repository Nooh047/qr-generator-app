export interface User {
    id: string;
    email: string;
    name?: string | null;
    createdAt: string;
}

export interface VisualSettings {
    theme?: string;
    color?: string;
    bgColor?: string;
    size?: number;
    logoUrl?: string;
    gradientType?: string;
}

export interface QRCodeContext {
    id: string;
    userId: string;
    title: string;
    qrType: 'URL' | 'WHATSAPP';
    targetUrl?: string | null;
    whatsappNumber?: string | null;
    whatsappText?: string | null;
    shortId: string;
    visualSettings?: VisualSettings | null;
    scanCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface AnalyticsSummary {
    totalQRs: number;
    totalScans: number;
    qrCodes: QRCodeContext[];
}

export interface ScanLog {
    id: string;
    scannedAt: string;
    ipAddress?: string | null;
    os?: string;
    browser?: string;
    deviceType?: string;
    country?: string;
    city?: string;
}

export interface DetailedQRAnalytics {
    totalScans: number;
    recentLogs: ScanLog[];
    osStats: Record<string, number>;
    deviceStats: Record<string, number>;
    countryStats: Record<string, number>;
    cityStats: Record<string, number>;
}
