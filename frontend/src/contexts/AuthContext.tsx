import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = () => {
            const token = localStorage.getItem('sb-access-token');
            const storedUser = localStorage.getItem('local-mock-user');

            if (token && storedUser) {
                // Mock Supabase session structures using standard raw primitives mapped loosely
                setSession({
                    access_token: token,
                    user: JSON.parse(storedUser)
                } as any);
                setUser(JSON.parse(storedUser));
            } else {
                setSession(null);
                setUser(null);
            }
            setLoading(false);
        };

        checkSession();
        // Listen exclusively to native storage trigger bounds
        window.addEventListener('storage', checkSession);

        return () => window.removeEventListener('storage', checkSession);
    }, []);

    const signOut = async () => {
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('local-mock-user');
        setSession(null);
        setUser(null);
        // Force state update reliably across browser tabs locally
        window.dispatchEvent(new Event('storage'));
    };

    // We expose a secondary `signInLocal` method here or handle entirely via intercept.
    // For now we map standard.
    return (
        <AuthContext.Provider value={{ session, user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
