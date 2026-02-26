import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { QrCode, ArrowRight, Activity, Zap, Shield, Globe } from "lucide-react";

export const HomePage = () => {
    return (
        <div className="relative min-h-screen bg-slate-900 text-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px]" />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                        <Zap className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-bold text-slate-300 tracking-wide uppercase">Next Generation QR Engine</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                        GENERATE <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400">SMARTER</span> <br />
                        GROW FASTER.
                    </h1>

                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
                        Create premium, trackable QR codes with real-time deep analytics.
                        Know exactly who, where, and how your audience interacts with your brand.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/app/dashboard"
                            className="px-10 py-5 bg-white text-slate-900 font-black text-lg rounded-2xl shadow-2xl shadow-white/10 hover:bg-slate-100 transition-all flex items-center gap-3 group"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/about"
                            className="px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-md text-white font-black text-lg rounded-2xl hover:bg-white/10 transition-all"
                        >
                            Learn More
                        </Link>
                    </div>
                </motion.div>

                {/* Floating Preview Card Mock */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-24 relative max-w-5xl mx-auto"
                >
                    <div className="aspect-[16/9] rounded-[3rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl shadow-2xl flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-purple-600/10 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-12 bg-white rounded-[2.5rem] shadow-2xl transform hover:scale-105 transition-transform duration-500">
                            <QrCode className="w-48 h-48 text-slate-900" />
                        </div>

                        {/* Decorative small floated stats cards */}
                        <div className="absolute top-20 right-10 bg-white/10 backdrop-blur-2xl border border-white/20 p-4 rounded-2xl text-left hidden md:block animate-bounce shadow-xl">
                            <Activity className="w-6 h-6 text-emerald-400 mb-2" />
                            <p className="text-xs font-bold text-slate-400 uppercase">Live Scans</p>
                            <h4 className="text-xl font-black">2,481</h4>
                        </div>
                        <div className="absolute bottom-20 left-10 bg-white/10 backdrop-blur-2xl border border-white/20 p-4 rounded-2xl text-left hidden md:block animate-pulse shadow-xl">
                            <Globe className="w-6 h-6 text-indigo-400 mb-2" />
                            <p className="text-xs font-bold text-slate-400 uppercase">Countries</p>
                            <h4 className="text-xl font-black">42</h4>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Deep Analytics",
                            desc: "Track device type, location, browser, and even battery levels of your scanners.",
                            icon: <Activity className="w-8 h-8 text-indigo-400" />
                        },
                        {
                            title: "Instant Updates",
                            desc: "Change the destination URL or WhatsApp message of your QR code anytime, anywhere.",
                            icon: <Zap className="w-8 h-8 text-yellow-400" />
                        },
                        {
                            title: "Enterprise Security",
                            desc: "All links are scanned for malware and secured with military-grade encryption.",
                            icon: <Shield className="w-8 h-8 text-emerald-400" />
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden relative"
                        >
                            <div className="mb-6">{feature.icon}</div>
                            <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};
