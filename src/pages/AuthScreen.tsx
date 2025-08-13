import * as React from 'react';
import {useState} from 'react';
import {useAuth} from "../hooks/useAuth.tsx";
import {useNavigate} from "react-router-dom";
import {LoginForm} from "../components/LoginForm.tsx";
import {RegisterForm} from "../components/RegisterForm.tsx";

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [, setSuccess] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleToggle = () => {
        setIsLogin(!isLogin);
        setSuccess(false);
    };

    const handleSuccess = () => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };
    
    return (
        <div className="min-h-screen bg-[url('/wallpaper.webp')] bg-cover bg-no-repeat flex items-center justify-between p-6 relative">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all duration-300">
                    <div className="transition-opacity duration-500">
                        {isLogin ? (
                            <LoginForm onToggle={handleToggle} onSuccess={handleSuccess} />
                        ) : (
                            <RegisterForm onToggle={handleToggle} onSuccess={handleSuccess} />
                        )}
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-600">Por Tiago Inês @Embrace</p>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-4 right-4 w-12 h-12 flex items-center justify-center">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                >
                    <circle cx="50" cy="50" r="48" fill="white" />
                    <g style={{ transformOrigin: '50% 60%', animation: 'sway 3s ease-in-out infinite' }}>
                        <rect x="45" y="20" width="10" height="60" fill="#FFD700" />
                        <rect x="30" y="40" width="40" height="10" fill="#FFD700" />
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default AuthScreen;