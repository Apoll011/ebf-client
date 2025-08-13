import { Eye, EyeOff, Loader, AlertCircle, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import {useAuth} from "../hooks/useAuth.tsx";

export const LoginForm = ({onToggle, onSuccess}: { onToggle: () => void, onSuccess: () => void }) => {
    const {login, isLoading} = useAuth();
    const [formData, setFormData] = useState({username: '', password: ''});
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!formData.username || !formData.password) {
            setError('Preencha todos os campos');
            return;
        }

        setError('');

        try {
            const result = await login(formData.username, formData.password);
            console.log('Login result:', result);
            if (result.success) {
                onSuccess?.();
            } else {
                setError('Credenciais inválidas');
            }
        } catch {
            setError('Um erro Ocorreu. Tente novamente.');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit().then();
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-2xl font-light text-gray-800 mb-2">Entre no Portal EBF</h1>
            </div>

            {error && (
                <div className="flex items-center space-x-2 mb-4 text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0"/>
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        onKeyUp={handleKeyPress}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400 pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    </button>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full py-4 mb-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isLoading ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin"/>
                            <span>Entrando...</span>
                        </>
                    ) : (
                        <>
                            <span>Entrar</span>
                            <ArrowRight
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"/>
                        </>
                    )}
                </button>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={onToggle}
                        className="text-gray-600 hover:text-gray-800  cursor-pointer text-sm transition-colors"
                    >

                        Não tem uma conta? <span className="font-medium">Crie Uma</span>
                    </button>
                </div>
            </div>
        </div>
    );
};