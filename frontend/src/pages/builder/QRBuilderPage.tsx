import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { qrService } from "../../services/dataService";
import { useAuth } from "../../contexts/AuthContext";
import {
  Link2,
  MessageCircle,
  Settings2,
  Palette,
  Loader2,
  ArrowLeft,
  Zap,
  CheckCircle2,
  Copy,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const QUICK_LOGOS = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><defs><linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23fed373"/><stop offset="25%" stop-color="%23f15245"/><stop offset="50%" stop-color="%23d92e7f"/><stop offset="75%" stop-color="%239b36b7"/><stop offset="100%" stop-color="%23515ecf"/></linearGradient></defs><path fill="url(%23ig-grad)" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="%2325D366" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="%23FFFC00" d="M448 385.2c0-8.6-6-15.6-14.3-17-7.7-1.3-16.5-2.7-25.9-4.2-28.5-4.7-65.4-10.8-80.1-14.9-6.3-1.8-9.4-5.3-7.5-11.8.8-2.8 2.6-5.4 5.2-7.8 7.2-6.7 15.5-14.3 22-21 9-9.1 14.8-18.4 17.1-27.1 2.3-8.8-.5-17.3-8.4-25.1-4.1-4-9-7-14.6-8.9-4.4-1.5-13.2-2-26.4-1.5-4.7.2-8-.1-9.9-.9-7.1-2.9-11.5-10-15.8-21.4-4-10.8-7.9-25.8-13.4-38.9-8.4-20-20.9-38.7-37-55.6C213.6 101.4 186.2 81 184 80c-5.7-2.6-12.6-4.5-20.6-5.8-36.8-6-77.9.6-118.8 19-38.3 17.2-69.6 40-90.8 66C-.6 195.4 33.7 265.4 33.7 265.4c2.8 7.7 7.7 10 13 11 11.2 2 15.6 1.8 19 1.6 4.3-.3 7.3-.8 9-1.5 5.2-2 10.1-5 14.8-8.9 4.3-3.6 7.4-8 9-12.9-.6.2-1.3.4-2.1.5-4.2.9-8.2 1.3-12.2 1.3-3.9 0-7.7-.4-11.4-1.2-4.1-.9-5.4-2.7-4.1-5.7.9-2.2 3-5.2 6.3-9 22.8-26.6 54.4-49.6 92-66.6 40-18 80-24.3 115.8-18.5 7.6 1.2 14.2 3 19.8 5.4 2.1 1 20 15 45.4 38.6 15.9 14.8 28.1 31.9 36  48.9 3.3 7 5.9 14.2 7.7 21-.2 1.4-1.1 2.5-3 3-1-.3-2.1-.5-3.1-.7-1-.2-2.1-.3-3.2-.5-9.6-1.6-20.6-3.4-30.8-3.4-5.3 0-10.9.5-16.4 1.4-5 .9-6.3 2.7-3.9 5.6.8 1 2 2.2 3.6 3.6 8 7 19.3 16.9 29.3 27.2 8.7 8.9 11 15.9 8.2 21.6-2.5 5.1-6.8 8.8-12.5 10.7-5.9 1.9-12.4 2.2-19.1 1h-1.6c-4.4 0-13 .7-21.7 1.8-8.7 1-17.7 2.4-21.8 3.5-.6.2-1.2.5-1.7 1-.7.7-1 1.6-1 2.7 0 2.2 1.9 4.3 5.4 6 12.8 6.3 43.1 11.1 76.5 16 9.3 1.4 18.2 2.7 26.2 4 9 1.5 15.6 8.5 15.6 17.4 0 .8-.1 1.6-.2 2.4-1.4 7.2-7.5 11.6-14.7 13.9-9 2.8-19.7 5.2-30.8 7.1-13.8 2.4-29.3 4-43 4.2-16.9.1-33.8-1.5-50.6-4.5-9.1-1.6-18.1-3.6-26.9-5.9-2.3-.6-5.1-.2-8.3 1.1-6 2.5-9.8 8.5-10.2 15-.5 7.7 4 14.6 11.2 17.5 9 3.6 18.5 6.4 28.2 8.2 14.2 2.6 28.7 4.1 43.4 4 14.6 0 29.3-1.6 44.1-4.4 13-2.5 25.4-5.5 36.8-8.9.1-.1.3-.1.4-.2 7.8-2.3 15-7.3 17.9-15.5 1.4-3.8 1.9-7.9 1.7-12.1z"/><path fill="%23FFFFFF" d="M375.3 355.2c-5.7-1.7-8.3-4.8-6.6-10.5.7-2.4 2.3-4.7 4.5-6.8 6.2-5.9 13.3-12.4 18.9-18.2 7.7-7.9 12.7-15.9 14.6-23.4 1.9-7.6-.4-14.9-7.2-21.7-3.5-3.4-7.7-6-12.5-7.7-3.8-1.3-11.3-1.7-22.6-1.3-4.1.2-6.9-.1-8.5-.8-6.1-2.5-9.9-8.6-13.6-18.5-3.4-9.3-6.8-22.3-11.5-33.6-7.2-17.3-18-33.5-31.9-48.2-30.6-32.5-54.2-50.1-56.1-51-4.9-2.2-10.8-3.9-17.7-5-31.6-5.2-67 .5-102.3 16.4-33 14.8-59.8 34.5-78.1 57-19.1 23.4-1.2 83.9-1.2 83.9 2.4 6.6 6.6 8.6 11.2 9.5 9.6 1.7 13.4 1.6 16.3 1.4 3.7-.3 6.3-.7 7.7-1.3 4.5-1.8 8.7-4.3 12.7-7.7 3.7-3.1 6.3-6.9 7.7-11.1-.5.2-1.1.3-1.8.4-3.6.8-7 1.1-10.5 1.1-3.4 0-6.6-.3-9.8-1-3.5-.8-4.6-2.3-3.6-4.9.8-1.9 2.6-4.5 5.4-7.8 19.6-22.9 46.8-42.8 79.2-57.5 34.4-15.5 68.8-21 99.6-15.9 6.5 1 12.2 2.6 17.1 4.7 1.8.9 17.2 12.9 39.1 33.3 13.7 12.8 24.2 27.5 31 42.1 2.8 6 5.1 12.2 6.6 18.1-.2 1.2-1 2.2-2.6 2.6-.9-.3-1.8-.4-2.7-.6-.9-.2-1.8-.3-2.7-.4-8.3-1.4-17.7-2.9-26.5-2.9-4.5 0-9.4.4-14.1 1.2-4.3.8-5.4 2.3-3.4 4.8.7.9 1.7 1.9 3.1 3.1 6.9 6 16.6 14.6 25.2 23.5 7.5 7.7 9.5 13.7 7 18.6-2.1 4.4-5.8 7.6-10.7 9.2-5.1 1.6-10.6 1.9-16.4.9h-1.4c-3.8 0-11.2.6-18.7 1.6-7.5.9-15.2 2.1-18.8 3-.5.2-1 .4-1.5.9-.6.6-.9 1.4-.9 2.3 0 1.9 1.6 3.7 4.6 5.2 11 5.4 37.1 9.6 65.8 13.8 8 1.2 15.6 2.3 22.5 3.5 7.8 1.3 13.4 7.3 13.4 15 0 .7-.1 1.4-.2 2.1-1.2 6.2-6.5 10-12.7 12-7.8 2.4-17 4.5-26.5 6.1-11.9 2.1-25.2 3.4-37 3.6-14.5.1-29.1-1.3-43.5-3.9-7.8-1.4-15.6-3.1-23.2-5.1-2-.5-4.4-.2-7.1 1-5.2 2.1-8.5 7.3-8.8 12.9-.4 6.7 3.5 12.6 9.6 15 7.8 3.1 15.9 5.5 24.3 7 12.2 2.2 24.7 3.5 37.3 3.5 12.6 0 25.2-1.4 38-3.8 11.2-2.1 21.9-4.7 31.7-7.7.1-.1.2-.1.3-.2 6.7-2 12.9-6.3 15.4-13.3 1.3-3.2 1.7-6.8 1.5-10.4z"/></svg>'
  },
  {
    id: 'twitter',
    name: 'X',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23000000" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.6 318.1 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="%230A66C2" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>'
  },
];

export const QRBuilderPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQR, setGeneratedQR] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    qrType: "URL" as "URL" | "WHATSAPP",
    targetUrl: "",
    whatsappNumber: "",
    whatsappText: "",
    theme: "light",
    color: "#4F46E5",
    bgColor: "#ffffff",
    logoUrl: "",
    gradientType: "none",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await qrService.createQR({
        title: formData.title,
        qrType: formData.qrType,
        targetUrl: formData.qrType === "URL" ? formData.targetUrl : undefined,
        whatsappNumber:
          formData.qrType === "WHATSAPP" ? formData.whatsappNumber : undefined,
        whatsappText:
          formData.qrType === "WHATSAPP" ? formData.whatsappText : undefined,
        visualSettings: {
          theme: formData.theme,
          color: formData.color,
          bgColor: formData.bgColor,
          logoUrl: formData.logoUrl,
          gradientType: formData.gradientType,
        },
      });

      if (session) {
        navigate("/app/dashboard");
      } else {
        setGeneratedQR(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate Dynamic Link");
    } finally {
      setLoading(false);
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

  if (generatedQR) {
    // Generate an accessible network URL using the current host so mobile phones can resolve the backend on the same Wi-Fi
    const qrUrl = `${window.location.protocol}//${window.location.hostname}:5000/r/${generatedQR.shortId}`;
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-16"
      >
        <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-4 rounded-3xl shadow-lg border-4 border-white mb-6 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <QRCodeSVG
                value={qrUrl}
                size={200}
                fgColor={formData.gradientType !== "none" ? `url(#qr-gradient-${formData.gradientType})` : formData.color}
                bgColor={formData.bgColor}
                imageSettings={formData.logoUrl ? {
                  src: formData.logoUrl,
                  x: undefined,
                  y: undefined,
                  height: 48,
                  width: 48,
                  excavate: true,
                } : undefined}
                level="H"
                includeMargin={false}
                className="z-10 relative rounded-xl"
              />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              QR Link Ready!
            </h1>
            <p className="text-slate-500 font-medium mb-8">Your dynamic routing link is uniquely scannable below.</p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 w-full flex items-center justify-between gap-4 mb-8">
              <a href={qrUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline truncate w-full text-left">
                {qrUrl}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(qrUrl)}
                className="p-2.5 bg-white text-slate-500 hover:text-indigo-600 rounded-xl shadow-sm border border-slate-200 transition-colors flex shrink-0"
                title="Copy to clipboard"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 w-full">
              <Link to="/auth/register" className="flex-1 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3.5 rounded-2xl font-bold border border-slate-200 transition-all shadow-sm">
                Create Account
              </Link>
              <button onClick={() => setGeneratedQR(null)} className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-500/30 transition-all">
                Make Another
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="flex items-center gap-5 relative z-10 w-full">
          <Link
            to="/app/dashboard"
            className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all text-slate-500 hover:text-slate-700 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <Zap className="w-8 h-8 text-indigo-600" />
              Create Dynamic QR
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Configure your flexible routing endpoint
            </p>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          variants={itemVariants}
          className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-3 shadow-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden"
          >
            <div className="p-8 md:p-10 space-y-10">
              {/* Section 1: Basic Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    Basic Information
                  </h3>
                </div>
                <div className="max-w-2xl">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                    placeholder="e.g., Summer Promo 2026"
                  />
                </div>
              </section>

              {/* Section 2: Destination Type */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    Routing Destination
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, qrType: "URL" })}
                    className={`p-6 rounded-2xl border-2 flex items-center gap-4 transition-all ${formData.qrType === "URL" ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-md shadow-indigo-600/10" : "border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                  >
                    <div
                      className={`p-3 rounded-xl ${formData.qrType === "URL" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}
                    >
                      <Link2 className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-lg">Website URL</span>
                      <span className="text-xs opacity-80 font-medium">
                        Standard browser redirect
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, qrType: "WHATSAPP" })}
                    className={`p-6 rounded-2xl border-2 flex items-center gap-4 transition-all ${formData.qrType === "WHATSAPP" ? "border-emerald-600 bg-emerald-50/50 text-emerald-700 shadow-md shadow-emerald-600/10" : "border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                  >
                    <div
                      className={`p-3 rounded-xl ${formData.qrType === "WHATSAPP" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}
                    >
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-lg">WhatsApp Chat</span>
                      <span className="text-xs opacity-80 font-medium">
                        Direct app routing
                      </span>
                    </div>
                  </button>
                </div>

                <motion.div
                  key={formData.qrType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-50/80 p-8 rounded-3xl border border-slate-100 max-w-2xl"
                >
                  {formData.qrType === "URL" ? (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Target URL
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.targetUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, targetUrl: e.target.value })
                        }
                        className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium"
                        placeholder="https://example.com/promo"
                      />
                      <p className="text-sm font-medium text-slate-500 mt-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        The dynamic QR will instantly 302 redirect users to this
                        destination.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          WhatsApp Number
                        </label>
                        <PhoneInput
                          international
                          defaultCountry="US"
                          value={formData.whatsappNumber}
                          onChange={(value) =>
                            setFormData({
                              ...formData,
                              whatsappNumber: value ? value.toString() : "",
                            })
                          }
                          className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all text-slate-900 font-medium"
                          placeholder="e.g., +1 234 567 8900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Pre-filled Message{" "}
                          <span className="text-slate-400 font-normal">
                            (Optional)
                          </span>
                        </label>
                        <textarea
                          rows={2}
                          value={formData.whatsappText}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              whatsappText: e.target.value,
                            })
                          }
                          className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none text-slate-900 font-medium"
                          placeholder="Hi there! I'm interested in..."
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </section>

              {/* Section 3: Quick Templates */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    Quick Templates
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
                  {[
                    { id: 'modern', name: 'Modern Indigo', color: '#4F46E5', theme: 'light', gradient: 'from-indigo-500 to-violet-500' },
                    { id: 'sunset', name: 'Vibrant Sunset', color: '#F43F5E', theme: 'light', gradient: 'from-rose-500 to-orange-500' },
                    { id: 'eco', name: 'Emerald Minimal', color: '#10B981', theme: 'light', gradient: 'from-emerald-500 to-teal-500' },
                    { id: 'dark', name: 'Stealth Dark', color: '#0F172A', theme: 'dark', gradient: 'from-slate-800 to-slate-900' },
                  ].map((template) => {
                    const isSelected = formData.color === template.color && formData.theme === template.theme;
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: template.color, theme: template.theme })}
                        className={`relative overflow-hidden group p-4 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-indigo-600 shadow-md shadow-indigo-600/10' : 'border-slate-100 hover:border-slate-300'}`}
                      >
                        <div className={`w-full h-16 rounded-xl bg-gradient-to-br ${template.gradient} mb-3 shadow-inner`} />
                        <span className={`block text-sm font-bold truncate ${isSelected ? 'text-indigo-700' : 'text-slate-700 group-hover:text-slate-900'}`}>{template.name}</span>
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Section 4: Advanced Visual Identity */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    Advanced Customization
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Custom Center Logo <span className="text-slate-400 font-normal">(URL or Upload)</span>
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="url"
                          value={formData.logoUrl.startsWith('data:image') ? '' : formData.logoUrl}
                          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                          className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400"
                          placeholder="https://example.com/logo.png"
                        />
                        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 p-3.5 rounded-2xl border border-slate-200 transition-all flex items-center justify-center shadow-sm" title="Upload local image">
                          <Upload className="w-5 h-5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("File size must be less than 5MB");
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setFormData({ ...formData, logoUrl: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Sub-feature: Quick Preset Logos */}
                      <div className="mt-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Popular Logos</p>
                        <div className="flex flex-wrap gap-2">
                          {QUICK_LOGOS.map(logo => (
                            <button
                              key={logo.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, logoUrl: logo.url })}
                              className={`p-2 rounded-xl border flex items-center justify-center transition-all bg-white shadow-sm hover:scale-110 active:scale-95 ${formData.logoUrl === logo.url ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300'}`}
                              title={logo.name}
                            >
                              <img src={logo.url} alt={logo.name} className="w-5 h-5 object-contain" />
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, logoUrl: '' })}
                            className="p-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all shadow-sm"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Foreground Color
                        </label>
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value, gradientType: "none" })}
                            className="w-10 h-10 rounded-xl cursor-pointer border-0 p-1 bg-white shadow-sm"
                          />
                          <span className="text-slate-700 uppercase font-bold text-sm tracking-wider">{formData.color}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Background Color
                        </label>
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <input
                            type="color"
                            value={formData.bgColor}
                            onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                            className="w-10 h-10 rounded-xl cursor-pointer border-0 p-1 bg-white shadow-sm"
                          />
                          <span className="text-slate-700 uppercase font-bold text-sm tracking-wider">{formData.bgColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Foreground Gradient Fill
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'none', name: 'Solid Color', class: 'bg-slate-200' },
                        { id: 'sunset', name: 'Sunset', class: 'bg-gradient-to-br from-rose-500 to-orange-500' },
                        { id: 'ocean', name: 'Ocean', class: 'bg-gradient-to-br from-sky-500 to-indigo-500' },
                        { id: 'forest', name: 'Forest', class: 'bg-gradient-to-br from-emerald-500 to-teal-500' },
                        { id: 'cosmic', name: 'Cosmic', class: 'bg-gradient-to-br from-violet-500 to-fuchsia-500' },
                      ].map(grad => (
                        <button
                          key={grad.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, gradientType: grad.id })}
                          className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${formData.gradientType === grad.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                        >
                          <div className={`w-6 h-6 rounded-full shadow-sm ${grad.class}`} />
                          <span className={`text-sm font-bold truncate ${formData.gradientType === grad.id ? 'text-indigo-700' : 'text-slate-600'}`}>{grad.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="bg-slate-50/80 p-8 border-t border-slate-100 flex justify-end gap-4">
              <Link
                to="/app/dashboard"
                className="px-6 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-2xl transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-70 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-500/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Generate Routing Link
              </button>
            </div>
          </motion.form>
        </div>

        {/* Right Column: Live Preview Panel */}
        <div className="lg:col-span-1 sticky top-24">
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden p-8 flex flex-col items-center text-center relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />

            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8 relative z-10 w-full border-b border-slate-100 pb-4 text-left">
              Live Preview
            </h3>

            <div className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-100 mb-6 relative group overflow-hidden shadow-sm">
              <QRCodeSVG
                value={
                  formData.qrType === "URL"
                    ? (formData.targetUrl || "https://example.com/live-preview")
                    : (formData.whatsappNumber ? `https://wa.me/${formData.whatsappNumber.replace(/[^0-9]/g, '')}` : "https://wa.me/1234567890")
                }
                size={220}
                fgColor={formData.gradientType !== "none" ? `url(#qr-gradient-${formData.gradientType})` : formData.color}
                bgColor={formData.bgColor}
                imageSettings={formData.logoUrl ? {
                  src: formData.logoUrl,
                  x: undefined,
                  y: undefined,
                  height: 54,
                  width: 54,
                  excavate: true,
                } : undefined}
                level="H"
                includeMargin={false}
                className="z-10 relative rounded-2xl"
              />
            </div>

            <p className="text-sm text-slate-500 font-medium">
              This is a real-time reactive preview. The actual QR code will instantly navigate users to your configured destination upon creation.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
