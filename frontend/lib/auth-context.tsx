'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, refreshToken } from './api';
import { isTokenExpired } from './utils';

interface AuthContextValue {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);

    // Initial load from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (storedToken) setToken(storedToken);
        if (storedRefreshToken) setRefreshTokenValue(storedRefreshToken);
    }, []);

    // Rafraîchir automatiquement le token
    useEffect(() => {
        if (!refreshTokenValue) return;

        const interval = setInterval(async () => {
            if (token && isTokenExpired(token)) {
                try {
                    const { token: newToken } = await refreshToken(refreshTokenValue);
                    localStorage.setItem('token', newToken);
                    setToken(newToken);
                } catch (error) {
                    console.error('Erreur lors du rafraîchissement du token :', error);
                    logout();
                }
            }
        }, 5 * 60 * 1000); // Vérifie toutes les 5 minutes (ajustez si nécessaire)

        return () => clearInterval(interval);
    }, [token, refreshTokenValue]);

    const login = async (email: string, password: string) => {
        try {
            const { token, refresh_token } = await loginUser(email, password);
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refresh_token);
            setToken(token);
            setRefreshTokenValue(refresh_token);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setToken(null);
        setRefreshTokenValue(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
