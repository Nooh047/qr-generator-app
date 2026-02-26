import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { QRBuilderPage } from './pages/builder/QRBuilderPage';
import { QRGradients } from './components/QRGradients';
import { ParticleNetwork } from './components/ParticleNetwork';

// Global Layout wrapper for Navigation Sidebar/Headers across internal pages
const BaseLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
    {/* Global Animated Premium Interactive Canvas Background */}
    <div className="fixed inset-0 z-0 bg-slate-900 overflow-hidden">
      {/* Heavy noise overlay to give material texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay pointer-events-none z-10"></div>

      {/* Interactive geometric mouse particle network */}
      <ParticleNetwork />

      {/* Deep ambient glow layers */}
      <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/20 blur-[130px] pointer-events-none" />
      <div className="absolute top-[20%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-violet-600/20 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-slate-800/80 blur-[150px] pointer-events-none" />
    </div>

    {/* Glassmorphic Premium Header (Adjusted for dark mode base) */}
    <QRGradients />
    <header className="bg-white/40 backdrop-blur-2xl border-b border-white/60 shadow-[0_4px_30px_rgb(0,0,0,0.03)] p-4 font-semibold text-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-white/60 group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-black text-sm tracking-wider">QR</span>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 tracking-tight font-extrabold text-2xl drop-shadow-sm group-hover:from-indigo-600 transition-all duration-300">
            QR Engine
          </span>
        </div>
      </div>
    </header>

    <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 relative z-10">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Gateways */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Shared BaseLayout for internal pages */}
          <Route path="/app/*" element={
            <BaseLayout>
              <Routes>
                {/* Public Segment */}
                <Route path="builder" element={<QRBuilderPage />} />

                {/* Protected Segments */}
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                </Route>

                {/* Fallback internal routing maps implicitly back to Dashboard logic */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </BaseLayout>
          } />

          {/* Global Fallback Route logic bouncing to auth entry if unhandled completely */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
