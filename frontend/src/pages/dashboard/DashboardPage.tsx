import { useEffect, useState } from "react";
import { analyticsService, qrService } from "../../services/dataService";
import type { AnalyticsSummary, QRCodeContext, DetailedQRAnalytics } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import {
  BarChart3,
  QrCode as QrIcon,
  Link as LinkIcon,
  AlertCircle,
  Loader2,
  Plus,
  LogOut,
  ExternalLink,
  Activity,
  Edit2,
  X,
  Save,
  Trash2,
  Globe,
  Smartphone,
  MapPin,
  Maximize2,
  Download
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export const DashboardPage = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQR, setEditingQR] = useState<QRCodeContext | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<DetailedQRAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewQR, setPreviewQR] = useState<QRCodeContext | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await analyticsService.getDashboardSummary();
      setData(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleEditClick = (qr: any) => {
    setEditingQR({ ...qr });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQR) return;

    setUpdateLoading(true);
    try {
      await qrService.updateQR(editingQR.id, {
        title: editingQR.title,
        targetUrl: editingQR.targetUrl,
        whatsappNumber: editingQR.whatsappNumber,
        whatsappText: editingQR.whatsappText,
      });
      setIsEditModalOpen(false);
      setEditingQR(null);
      await fetchDashboard(); // Refresh data
    } catch (err: any) {
      alert(err.message || "Failed to update QR Code");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleViewAnalytics = async (qrId: string) => {
    setAnalyticsLoading(true);
    setIsAnalyticsModalOpen(true);
    try {
      const response = await analyticsService.getSpecificAnalytics(qrId);
      setAnalyticsData(response.data);
    } catch (err: any) {
      alert(err.message || "Failed to load analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handlePreview = (qr: any) => {
    setPreviewQR(qr);
    setIsPreviewModalOpen(true);
  };

  const handleDownload = (qrId: string, title: string) => {
    const svg = document.getElementById(`qr-preview-${qrId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx?.drawImage(img, 0, 0, 1000, 1000);
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
      link.href = url;
      link.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this QR code?")) return;

    try {
      await qrService.deleteQR(id);
      await fetchDashboard();
    } catch (err: any) {
      alert(err.message || "Failed to delete QR Code");
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "tween", stiffness: 300, damping: 24 },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-3 max-w-2xl mx-auto my-8 shadow-sm"
      >
        <AlertCircle className="w-6 h-6 shrink-0" />
        <span className="font-medium">{error}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-600" />
            Dashboard
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Welcome back,{" "}
            <span className="text-slate-700 font-semibold">
              {session?.user?.email}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/app/builder"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Create QR
          </Link>
          <button
            onClick={() => {
              signOut();
              navigate("/auth/login");
            }}
            className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-2xl text-sm font-bold shadow-sm border border-slate-200 transition-all flex items-center gap-2 hover:text-red-600 focus:ring-4 focus:ring-slate-100"
          >
            <LogOut className="w-5 h-5" /> Sign out
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex items-center gap-6 group hover:shadow-[0_8px_30px_rgb(79,70,229,0.1)] hover:border-indigo-100/50 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-indigo-500/30 relative z-10">
            <QrIcon className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
              Total QR Codes
            </p>
            <h3 className="text-5xl font-black tracking-tighter text-slate-900">
              {data?.totalQRs || 0}
            </h3>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex items-center gap-6 group hover:shadow-[0_8px_30px_rgb(139,92,246,0.1)] hover:border-violet-100/50 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all duration-500" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 text-violet-600 flex items-center justify-center shrink-0 group-hover:from-violet-600 group-hover:to-fuchsia-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-violet-500/30 relative z-10">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
              Total Scans
            </p>
            <h3 className="text-5xl font-black tracking-tighter text-slate-900">
              {data?.totalScans || 0}
            </h3>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-white/40 flex items-center justify-between bg-white/40">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Your Active Links
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {!data || !data.qrCodes || data.qrCodes.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                <QrIcon className="w-10 h-10 text-slate-300" />
              </div>
              <p className="font-bold text-slate-900 tracking-tight text-xl mb-2">
                No QR codes yet
              </p>
              <p className="text-slate-500 max-w-sm mb-6">
                Create your first dynamic link to start tracking engagement and
                analytics instantly.
              </p>
              <Link
                to="/app/builder"
                className="text-indigo-600 font-bold hover:text-indigo-700 bg-indigo-50 px-6 py-2.5 rounded-xl transition-colors"
              >
                Get Started
              </Link>
            </div>
          ) : (
            data?.qrCodes.map((qr: QRCodeContext, index: number) => {
              const backendBaseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || `${window.location.protocol}//${window.location.hostname}:5000`;
              const qrUrl = `${backendBaseUrl}/r/${qr.shortId}`;

              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={qr.id}
                  className="p-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-white/60 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-5">
                    <div
                      onClick={() => handlePreview(qr)}
                      title="Click to enlarge"
                      className={`p-2.5 rounded-2xl border shadow-sm shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 cursor-zoom-in relative overflow-hidden ${qr.qrType === "WHATSAPP" ? "bg-emerald-50/80 border-emerald-100" : "bg-white/80 border-slate-200/60"}`}
                    >
                      <QRCodeSVG
                        value={qrUrl}
                        size={48}
                        fgColor={(qr.visualSettings?.gradientType && qr.visualSettings.gradientType !== "none") ? `url(#qr-gradient-${qr.visualSettings.gradientType})` : (qr.visualSettings?.color || "#0F172A")}
                        bgColor={qr.visualSettings?.bgColor || "#ffffff"}
                        imageSettings={qr.visualSettings?.logoUrl ? {
                          src: qr.visualSettings.logoUrl,
                          x: undefined,
                          y: undefined,
                          height: 12,
                          width: 12,
                          excavate: true,
                        } : undefined}
                        level="H"
                        includeMargin={false}
                      />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-slate-900 text-lg flex items-center gap-3 leading-none mb-2">
                        {qr.title}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${qr.qrType === "WHATSAPP" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                        >
                          {qr.qrType}
                        </span>
                      </h4>
                      <a
                        href={qrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1.5 font-medium w-fit bg-indigo-50 px-3 py-1 rounded-lg transition-colors group/link"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        r/{qr.shortId}
                        <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-40 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 sm:gap-6 bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
                    <div className="flex flex-col items-start sm:items-end flex-1 sm:flex-none">
                      <span className="font-black text-slate-900 text-2xl leading-none mb-1">
                        {qr.scanCount}
                      </span>
                      <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">
                        Scans
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewAnalytics(qr.id)}
                        className="p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="View Analytics"
                      >
                        <BarChart3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(qr)}
                        className="p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(qr.id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
          >
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Edit QR Code</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {editingQR && (
              <form onSubmit={handleUpdate} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingQR.title}
                    onChange={(e) => setEditingQR({ ...editingQR, title: e.target.value } as QRCodeContext)}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all font-medium"
                  />
                </div>

                {editingQR.qrType === "URL" ? (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                      Destination URL
                    </label>
                    <input
                      type="url"
                      required
                      value={editingQR.targetUrl || ""}
                      onChange={(e) => setEditingQR({ ...editingQR, targetUrl: e.target.value } as QRCodeContext)}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all font-medium"
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        required
                        value={editingQR.whatsappNumber || ""}
                        onChange={(e) => setEditingQR({ ...editingQR, whatsappNumber: e.target.value } as QRCodeContext)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                        Custom Message (Optional)
                      </label>
                      <textarea
                        value={editingQR.whatsappText || ""}
                        onChange={(e) => setEditingQR({ ...editingQR, whatsappText: e.target.value } as QRCodeContext)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all font-medium resize-none h-24"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {updateLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
      {/* Analytics Modal */}
      {isAnalyticsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-200 flex flex-col"
          >
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                Scan Analytics
              </h3>
              <button
                onClick={() => {
                  setIsAnalyticsModalOpen(false);
                  setAnalyticsData(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {analyticsLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                  <p className="text-slate-500 font-medium">Fetching detailed insights...</p>
                </div>
              ) : analyticsData ? (
                <div className="space-y-8">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Scans</p>
                      <h4 className="text-2xl font-black text-slate-900">{analyticsData.totalScans}</h4>
                    </div>
                    {/* Add more summary card if needed */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Geography Section */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 font-bold text-slate-900">
                        <Globe className="w-5 h-5 text-indigo-500" />
                        Top Locations
                      </h4>
                      <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        {Object.entries(analyticsData.countryStats).length > 0 ? (
                          Object.entries(analyticsData.countryStats)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([country, count]) => (
                              <div key={country} className="space-y-1.5">
                                <div className="flex justify-between text-sm font-bold text-slate-700">
                                  <span className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 opacity-50" />
                                    {country}
                                  </span>
                                  <span>{count} scans</span>
                                </div>
                                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-500 rounded-full"
                                    style={{ width: `${(count / analyticsData.totalScans) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className="text-slate-400 text-sm italic">No location data available yet</p>
                        )}
                      </div>
                    </div>

                    {/* Devices Section */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 font-bold text-slate-900">
                        <Smartphone className="w-5 h-5 text-purple-500" />
                        Devices
                      </h4>
                      <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        {Object.entries(analyticsData.deviceStats).length > 0 ? (
                          Object.entries(analyticsData.deviceStats)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([device, count]) => (
                              <div key={device} className="space-y-1.5">
                                <div className="flex justify-between text-sm font-bold text-slate-700">
                                  <span>{device}</span>
                                  <span>{count} scans</span>
                                </div>
                                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-purple-500 rounded-full"
                                    style={{ width: `${(count / analyticsData.totalScans) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className="text-slate-400 text-sm italic">No device data available yet</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Browser/OS Mini Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900">Operating Systems</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(analyticsData.osStats).map(([os, count]) => (
                          <div key={os} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                            {os}: {count}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Logs Table */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Recent Activity</h4>
                    <div className="overflow-hidden border border-slate-100 rounded-2xl">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="px-6 py-3">Time</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3">Device</th>
                            <th className="px-6 py-3">IP Address</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {analyticsData.recentLogs.slice(0, 10).map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-700">
                                {new Date(log.scannedAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                              </td>
                              <td className="px-6 py-4 text-slate-600">
                                {log.city}, {log.country}
                              </td>
                              <td className="px-6 py-4 text-slate-600">
                                <span className="font-bold">{log.deviceType}</span>
                                <div className="text-[10px] opacity-60 uppercase">{log.os} / {log.browser}</div>
                              </td>
                              <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                                {log.ipAddress?.replace(/\d+$/, '***')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="py-20 text-center text-slate-500">
                  Failed to fetch analytics data.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Large Preview Modal */}
      {isPreviewModalOpen && previewQR && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 flex flex-col items-center p-12 text-center"
          >
            <div className="absolute top-6 right-6">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-900 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-8 space-y-2">
              <h3 className="text-2xl font-black text-slate-900">{previewQR.title}</h3>
              <p className="text-slate-500 font-medium text-sm">Scan with your phone camera</p>
            </div>

            <div className="p-8 bg-white rounded-[2rem] shadow-xl border-4 border-slate-50 mb-10">
              <QRCodeSVG
                id={`qr-preview-${previewQR.id}`}
                value={(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || `${window.location.protocol}//${window.location.hostname}:5000`) + `/r/${previewQR.shortId}`}
                size={320}
                level="H"
                includeMargin={true}
                fgColor={(previewQR.visualSettings?.gradientType && previewQR.visualSettings.gradientType !== "none") ? "#000000" : (previewQR.visualSettings?.color || "#000000")}
                bgColor={previewQR.visualSettings?.bgColor || "#FFFFFF"}
                imageSettings={previewQR.visualSettings?.logoUrl ? {
                  src: previewQR.visualSettings.logoUrl,
                  height: 60,
                  width: 60,
                  excavate: true,
                } : undefined}
              />
            </div>

            <button
              onClick={() => handleDownload(previewQR.id, previewQR.title)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Download className="w-6 h-6" />
              Download High-Res PNG
            </button>

            <p className="mt-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
              ID: {previewQR.shortId}
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
