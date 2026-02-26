import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import Pages
import { HomePage } from './pages/home/HomePage';
import { AboutPage } from './pages/home/AboutPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { QRBuilderPage } from './pages/builder/QRBuilderPage';
import { QRGradients } from './components/QRGradients';
import { ParticleNetwork } from './components/ParticleNetwork';
import { Navbar } from './components/Navbar';

// Global Layout wrapper for Navigation Sidebar/Headers across internal pages
const AppLayout = ({ children }: { children: React.ReactNode }) => (
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

    <QRGradients />
    <Navbar />

    <main className="flex-1 relative z-10">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Main Public Home & About */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Authentication Gateways */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />

            {/* Internal App Routes */}
            <Route path="/app/*" element={
              <div className="max-w-7xl mx-auto w-full p-4 md:p-8 pt-24">
                <Routes>
                  <Route path="builder" element={<QRBuilderPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                  </Route>
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </div>
            } />

            {/* Global Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
