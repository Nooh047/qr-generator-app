import { useEffect, useState } from "react";
import { analyticsService } from "../../services/dataService";
import type { AnalyticsSummary } from "../../types";
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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await analyticsService.getDashboardSummary();
        setData(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

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
            data?.qrCodes.map((qr, index) => {
              const qrUrl = `${window.location.protocol}//${window.location.hostname}:5000/r/${qr.shortId}`;

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
                      className={`p-2.5 rounded-2xl border shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${qr.qrType === "WHATSAPP" ? "bg-emerald-50/80 border-emerald-100" : "bg-white/80 border-slate-200/60"}`}
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
                    <button className="text-white bg-slate-900 hover:bg-slate-800 font-bold px-4 py-2 rounded-xl transition-all shadow-sm shrink-0">
                      Details
                    </button>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
