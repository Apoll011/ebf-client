import { useState } from 'react';
import {StudentManagementApi, StudentManagementApiError} from './api.ts';

export const useAuth = () => {
    const [api] = useState(() => new StudentManagementApi());
    const [isAuthenticated, setIsAuthenticated] = useState(api.isAuthenticated());
    const [user, setUser] = useState(api.getCurrentUser());

    const login = async (username: string, password: string) => {
        if (isAuthenticated) {
            return { success: true, message: 'Already logged in' };
        }
        try {
            await api.login({ username, password });
            setIsAuthenticated(true);
            setUser(api.getCurrentUser());
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof StudentManagementApiError ? error.message : 'Login failed'
            };
        }
    };

    const logout = () => {
        api.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return {
        api,
        isAuthenticated,
        user,
        login,
        logout
    };
};