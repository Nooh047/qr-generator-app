import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, Users, ArrowLeft } from "lucide-react";

export const AboutPage = () => {
    return (
        <div className="relative min-h-screen bg-slate-900 text-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px]" />
            </div>

            <section className="relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 font-bold group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
                        REDEFINING THE <br />
                        <span className="text-indigo-400">QR EXPERIENCE.</span>
                    </h1>

                    <p className="text-slate-400 text-xl font-medium mb-16 leading-relaxed">
                        QR Engine was built on the principle that a QR code should be more than just a gateway.
                        It should be a powerful tool for engagement, data, and growth. We provide the most advanced tracking
                        capabilities in the industry, wrapped in a premium user experience.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                                <Target className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-black">Our Mission</h3>
                            <p className="text-slate-500 font-medium">
                                To democratize enterprise-grade analytics for creators and small businesses through
                                intelligent QR technology.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-black">Built for Professionals</h3>
                            <p className="text-slate-500 font-medium">
                                Whether you are a marketer, developer, or store owner, our tools are crafted
                                to scale with your ambitions.
                            </p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-24 p-12 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/20 text-center"
                    >
                        <h2 className="text-3xl font-black mb-6">Ready to empower your links?</h2>
                        <Link
                            to="/app/dashboard"
                            className="inline-flex px-10 py-5 bg-white text-slate-900 font-black text-lg rounded-2xl shadow-xl hover:bg-slate-100 transition-all"
                        >
                            Enter the Dashboard
                        </Link>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
};
