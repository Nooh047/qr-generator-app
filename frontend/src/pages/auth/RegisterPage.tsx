import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/dataService";
import { QrCode, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register({ email, password });

      // Auto login user after successful backend registration
      localStorage.setItem("sb-access-token", response.session.access_token);
      localStorage.setItem("local-mock-user", JSON.stringify(response.user));
      window.dispatchEvent(new Event("storage"));

      setSuccess(true);
      setTimeout(() => {
        navigate("/app/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to register account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse">
      <div className="w-full md:w-1/2 bg-blue-600 p-8 md:p-16 flex flex-col justify-between text-white">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <QrCode className="w-8 h-8" />
          <span>DynamicQR</span>
        </div>

        <div className="my-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight max-w-lg">
            Start tracking conversions.
          </h1>
          <p className="text-blue-100 text-lg max-w-md">
            Join today to create routing intelligence bridging offline media
            straight into your system.
          </p>
        </div>

        <div className="text-sm font-medium text-blue-200">
          Powered by Supabase + React
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-white p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create an account
          </h2>
          <p className="text-gray-500 mb-8">
            Sign up below to access the Dynamic QR Engine.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {success ? (
            <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200">
              <h3 className="font-bold mb-2">Registration successful!</h3>
              <p className="text-sm mb-4">
                Please check your email to confirm your account.
              </p>
              <button
                onClick={() => navigate("/auth/login")}
                className="bg-green-600 text-white font-medium py-2 px-4 rounded-lg w-full"
              >
                Go to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow outline-none bg-gray-50 focus:bg-white"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow outline-none bg-gray-50 focus:bg-white"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-semibold shadow-sm shadow-blue-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Register securely"
                )}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-blue-600 hover:text-blue-500 hover:underline inline-flex items-center gap-1"
            >
              Log in <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
