import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/dataService";
import { QrCode, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });

      // Navigate implicitly handles checking the auth context and allowing access to dashboard
      localStorage.setItem("sb-access-token", response.session.access_token);
      localStorage.setItem("local-mock-user", JSON.stringify(response.user));
      window.dispatchEvent(new Event("storage"));
      navigate("/app/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "tween", stiffness: 300, damping: 24 }, // Strict spring variations map slightly differently, simplifying nicely.
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 font-sans">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[140px] animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "4s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-auto p-6"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center mb-10"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-300 mt-2 text-center text-sm">
              Sign in to manage your dynamic QR fleet.
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm font-medium backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-400 text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none backdrop-blur-sm"
                  placeholder="you@company.com"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-400 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none backdrop-blur-sm"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                disabled={loading}
                type="submit"
                className="relative w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-xl font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Log in securely"
                  )}
                </span>
              </button>
            </motion.div>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-sm text-slate-400"
          >
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="font-semibold text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1 transition-colors"
            >
              Create a free account <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};
