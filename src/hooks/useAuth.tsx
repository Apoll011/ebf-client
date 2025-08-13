import React, {createContext, useContext, useState, useCallback, useEffect, type ReactNode} from 'react';
import { StudentManagementApi, StudentManagementApiError } from '../api/api.ts';
import type {User} from "../model/types.ts";

interface AuthContextType {
    api: StudentManagementApi;
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshUser: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [api] = useState(() => new StudentManagementApi());
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const authenticated = api.isAuthenticated();
                setIsAuthenticated(authenticated);

                if (authenticated) {
                    const currentUser = api.getCurrentUser();
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Failed to initialize auth state:', error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, [api]);

    const login = useCallback(async (username: string, password: string) => {
        if (isAuthenticated) {
            return { success: true };
        }

        setIsLoading(true);
        try {
            await api.login({ username, password });
            const currentUser = api.getCurrentUser();

            setIsAuthenticated(true);
            setUser(currentUser);

            return { success: true };
        } catch (error) {
            const errorMessage = error instanceof StudentManagementApiError
                ? error.message
                : 'Login failed';

            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setIsLoading(false);
        }
    }, [api, isAuthenticated]);

    const logout = useCallback(() => {
        try {
            api.logout();
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local state even if API call fails
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [api]);

    const refreshUser = useCallback(() => {
        try {
            if (isAuthenticated) {
                const currentUser = api.getCurrentUser();
                setUser(currentUser);
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
            // If we can't get user data, they might not be authenticated anymore
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [api, isAuthenticated]);

    const contextValue: AuthContextType = {
        api,
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        refreshUser
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};