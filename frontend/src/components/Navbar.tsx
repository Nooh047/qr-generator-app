import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Info, Home as HomeIcon, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const Navbar = () => {
    const { session } = useAuth();
    const location = useLocation();

    const navLinks = [
        { name: "Home", path: "/", icon: <HomeIcon className="w-4 h-4" /> },
        { name: "About", path: "/about", icon: <Info className="w-4 h-4" /> },
        ...(session ? [{ name: "Dashboard", path: "/app/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> }] : [])
    ];

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl">
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-2 text-sm font-bold transition-all ${location.pathname === link.path ? "text-white" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            {link.icon}
                            <span className="hidden sm:inline">{link.name}</span>
                        </Link>
                    ))}
                </div>

                {!session ? (
                    <Link
                        to="/auth/login"
                        className="bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-slate-100 transition-all shadow-xl shadow-white/10"
                    >
                        <LogIn className="w-4 h-4" />
                        Login
                    </Link>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border border-white/20 shadow-lg" />
                )}
            </div>
        </nav>
    );
};
