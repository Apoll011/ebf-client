import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Home, Users, UserPlus, LogOut, Monitor, User } from 'lucide-react';
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.tsx";

interface HeaderProps {
    currentPath?: string;
}

const Header: React.FC<HeaderProps> = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const { user, logout } = useAuth();

    const currentPath = useLocation().pathname;

    if (!user) {
        navigate('/login');
        return null;
    }

    const navigation = [
        {
            name: 'Dashboard',
            href: '/',
            icon: Home,
            current: currentPath === '/',
            roles: ["admin"]
        },
        {
            name: 'Lista de Estudantes',
            href: '/list',
            icon: Users,
            current: currentPath === '/list' || currentPath.startsWith("/student/"),
            roles: ["admin", "teacher"]
        },
        {
            name: 'Registrar',
            href: '/register',
            icon: UserPlus,
            current: currentPath === '/register',
            roles: ["admin", "teacher", "viewer"]
        }
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const getRoleName = () => {
        if (user.role === 'admin') {
            return 'Administrador';
        } else if (user.role == 'teacher') {
            return 'Professor';
        } else {
            return 'Visitante';
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <button
                            onClick={() => handleNavigation('/')}
                            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">EBF</span>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">Escola Biblica de Ferias</span>
                        </button>
                    </div>

                    <nav className="hidden md:flex w-[50%] items-center space-x-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return item.roles.includes(user.role as string) && (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.href)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        item.current
                                            ? 'bg-gray-200 text-gray-900'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-3 hover:bg-gray-100 cursor-pointer rounded-lg p-2 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-gray-700 font-medium text-sm">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-sm text-left">
                                    <div className="text-gray-900 font-medium">{user.username}</div>
                                    <div className="text-gray-500 text-xs">{getRoleName()}</div>
                                </div>
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <div className="p-3 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div className="text-sm">
                                                <div className="text-gray-900 font-medium">{user.username}</div>
                                                <div className="text-gray-500 text-xs">{getRoleName()}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                handleNavigation('/screensaver');
                                            }}
                                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Monitor className="h-4 w-4 mr-3" />
                                            Screensaver
                                        </button>

                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4 mr-3" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                            aria-label="Abrir menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 bg-white">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavigation(item.href)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors text-left ${
                                            item.current
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </button>
                                );
                            })}

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-3 px-3 mb-3">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-gray-700 font-medium text-sm">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-gray-900 font-medium">{user.username}</div>
                                        <div className="text-gray-500 text-xs">{getRoleName()}</div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <button
                                        onClick={() => {
                                            toggleMobileMenu();
                                            handleNavigation('/screensaver');
                                        }}
                                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <Monitor className="h-5 w-5" />
                                        <span>Screensaver</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            toggleMobileMenu();
                                            logout();
                                        }}
                                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;