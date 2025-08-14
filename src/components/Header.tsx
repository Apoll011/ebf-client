import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Home, Users, UserPlus, LogOut, Monitor, User } from 'lucide-react';
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.tsx";
import {useLocalStorageToggle} from "../hooks/useLocalStorageToggle.ts";
import {Toggle} from "./Toggle.tsx";

interface HeaderProps {
    currentPath?: string;
}

const Header: React.FC<HeaderProps> = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const { user, logout } = useAuth();
    const { value: glassMode  } = useLocalStorageToggle('glass')

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

    const MenuOption = () => (
        <>
            <div className={`p-3 ${glassMode ? "glass-accent" : "bg-white"}`}>
                <div className="flex items-center space-x-3">
                    <div className={`${glassMode ? 'glass-badge' : ''} w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center`}>
                        <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-sm text-left">
                        <div className={`${glassMode ? 'text-white' : 'text-gray-900'} font-medium`}>{user.username}</div>
                        <div className={`${glassMode ? 'text-white/80' : 'text-gray-500'} text-xs`}>{getRoleName()}</div>
                    </div>
                </div>
            </div>


            <div className={`${glassMode ? 'glass-divider-thick ' : 'border-b border-gray-100 w-full'}`}></div>

            <div>
                <Toggle className="w-full flex items-center px-4 py-2 text-sm transition-colors" label={"Glass Mode"} storageKey={"glass"}/>
                <div className={`${glassMode ? 'glass-divider-thick' : 'border-b border-gray-100 w-full'} mb-2`}></div>

                <button
                    onClick={() => {
                        setIsUserMenuOpen(false);
                        handleNavigation('/screensaver');
                    }}
                    className={`w-full flex items-center px-4 py-2 text-sm ${glassMode ? 'glass-button text-white/80 mb-2' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                >
                    <Monitor className="h-4 w-4 mr-3" />
                    Screensaver
                </button>

                <button
                    onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                    }}
                    className={`w-full flex items-center px-4 py-2 text-sm  ${glassMode ? 'glass-button text-white/80' : 'text-red-600 hover:bg-gray-50'} transition-colors`}
                >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                </button>
            </div>
        </>

    );

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
        <>
            <header className={`${glassMode ? 'glass-card !p-1 mx-5 mb-2 top-5' : 'bg-white top-0'} shadow-sm border-b border-gray-200 sticky z-50`}>
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
                                <span className={`text-xl font-semibold ${glassMode ? 'text-white' : 'text-gray-900'}`}>Escola Biblica de Ferias</span>
                            </button>
                        </div>

                        <nav className="hidden md:flex w-[50%] items-center space-x-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return item.roles.includes(user.role as string) && (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavigation(item.href)}
                                        className={`flex items-center space-x-2 ${glassMode ? 'text-white/80' : ''} px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            item.current && glassMode
                                                ? 'glass-accent text-white-900'
                                                : item.current ? 'bg-gray-200 text-gray-900' : `${glassMode ? 'glass-hover-inner text-white/70' : 'text-white-600 hover:text-gray-900 hover:bg-gray-100'}`
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="hidden md:flex items-center space-x-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className={`flex items-center space-x-3 ${glassMode ? "glass-accent hover:p-2.5 transition-all duration-150 ease-in-out" : "hover:bg-gray-100 transition-colors duration-100 ease-in"} cursor-pointer rounded-lg p-2 `}
                                >
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className={`${glassMode ? 'glass-badge py-2 px-3' : ''} text-gray-700 font-medium text-sm`}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                    </div>
                                    <div className="text-sm text-left">
                                        <div className={`${glassMode ? 'text-white' : 'text-gray-900'} font-medium`}>{user.username}</div>
                                        <div className={`${glassMode ? 'text-white/80' : 'text-gray-500'} text-xs`}>{getRoleName()}</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className={`p-2 rounded-md   ${glassMode ? 'glass-button text-white' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
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
                            <div className={`px-2 pt-2 pb-3 space-y-1 ${glassMode ? "" : "border-t border-gray-200 bg-white"}`}>
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.name}
                                            onClick={() => handleNavigation(item.href)}
                                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors text-left ${
                                                item.current && glassMode
                                                    ? 'glass-accent text-white'
                                                    : item.current ? 'bg-gray-200 text-gray-900' : `${glassMode ? 'glass-hover-inner text-white/70' : 'text-white-600 hover:text-gray-900 hover:bg-gray-100'}`    
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span>{item.name}</span>
                                        </button>
                                    );
                                })}

                                <div className={`${glassMode ? 'glass-divider-thick ' : 'border-b border-gray-100 w-full'}`}></div>
                                <MenuOption />
                            </div>
                        </div>
                    )}
                </div>
            </header>
            {isUserMenuOpen && (
                <div ref={userMenuRef} className={`fixed right-6 mt-5 w-56 ${glassMode ? "glass-card top-20" : "bg-white top-12"} border border-gray-200 rounded-lg shadow-lg z-100 p-2`}>
                    <MenuOption />
                </div>
            )}
        </>

);
};

export default Header;