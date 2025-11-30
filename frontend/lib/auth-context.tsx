'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {loginUser, refreshToken, useApi} from './api';
import { isTokenExpired } from './utils';
import {config} from "zod/v4";
import {SettingsDto} from "@/components/object/SettingsDto";

type userType = {
    language: string;
    id: number,
    name: string,
    avatar: string,
    numberOfMachine: number,
    createdAt: string,
    location: string,
    responseRate: number,
    isVerified: boolean,
    email: string,
    newMessages: number,
    settings: SettingsDto
};

interface AuthContextValue {
    token: string | null;
    user: userType | null; // Information utilisateur
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: (userType: userType) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);
    const [user, setUser] = useState<userType | null>(null);

    // Initial load from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user'); // Stocker l'utilisateur également

        if (storedToken){
            setToken(storedToken);
            setUser(storedUser ? JSON.parse(storedUser) : null);
        }

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
                    logout();
                }
            }
        }, 5 * 60 * 1000); // Vérifie toutes les 5 minutes (ajustez si nécessaire)

        return () => clearInterval(interval);
    }, [token, refreshTokenValue]);

    const login = async (email: string, password: string) => {
        try {
            const { token, refresh_token, user } = await loginUser(email, password);

            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('user', JSON.stringify(user)); // Stocker une structure utilisateur
            setToken(token);
            setUser(user);
            setRefreshTokenValue(refresh_token);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setRefreshTokenValue(null);
        window.location.href = '/';
    };

    const refreshUser = (user: userType) => {
        localStorage.setItem('user', JSON.stringify(user)); // Stocker une structure utilisateur
        setUser(user)
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout, refreshUser}}>
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
