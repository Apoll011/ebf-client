import { useState } from 'react';
import { Eye, EyeOff, Loader, AlertCircle, ArrowRight } from 'lucide-react';
import {useAuth} from "../api/useAuth.tsx";
import type {UserRole} from "../model/types.ts";
import * as React from "react";
import {useNavigate} from "react-router-dom";

const LoginForm = ({ onToggle, onSuccess }: {onToggle: () => void, onSuccess: () => void}) => {
    const { login, isLoading } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
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
            }
            else {
                setError('Credenciais inválidas');
            }
        } catch (err) {
            setError('Um erro Ocorreu. Tente novamente.');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-2xl font-light text-gray-800 mb-2">Entre no Portal EBF</h1>
            </div>

            {error && (
                <div className="flex items-center space-x-2 mb-4 text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400 pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full py-4 mb-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isLoading ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>Entrando...</span>
                        </>
                    ) : (
                        <>
                            <span>Entrar</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                    )}
                </button>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={onToggle}
                        className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
                    >

                        Não tem uma conta? <span className="font-medium">Crie Uma</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const RegisterForm = ({ onToggle, onSuccess }: {onToggle: () => void, onSuccess: () => void}) => {
    const { api } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'viewer',
        passcode: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPasscode, setShowPasscode] = useState(false);

    const roles: {value: UserRole, label: string}[] = [
        { value: 'viewer', label: 'Visualizador' },
        { value: 'teacher', label: 'Responsavel' },
        { value: 'admin', label: 'Administrador' }
    ];

    const handleRoleChange = (role: UserRole) => {
        setFormData({ ...formData, role });
        setShowPasscode(role !== 'viewer');
    };

    const handleSubmit = async () => {
        if (!formData.username || !formData.password || !formData.confirmPassword) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password deve ter pelo menos 6 caracteres');
            return;
        }

        if ((formData.role === 'teacher' || formData.role === 'admin') && formData.passcode !== 'jesus') {
            setError('Passcode incorreto para esta função');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await api.createUser({
                username: formData.username,
                password: formData.password,
                role: formData.role as UserRole
            });
            console.log('Registration result:', result);
            if (result.username) {
                onSuccess?.();
            }
            else {
                setError('Registracão falhou. Tente novamente.');
            }
        } catch (err) {
            setError('Registracão falhou. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-2xl font-light text-gray-800 mb-2">Crie uma Conta</h1>
            </div>

            {error && (
                <div className="flex items-center space-x-2 mb-4 text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400 pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <div className="relative">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirmar Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400 pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm text-gray-700 font-medium">Responsabilidade</label>
                    <div className="grid grid-cols-3 gap-2">
                        {roles.map((role) => (
                            <button
                                key={role.value}
                                type="button"
                                onClick={() => handleRoleChange(role.value)}
                                className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                    formData.role === role.value
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>
                </div>

                {showPasscode && (
                    <div className="relative animate-slideIn">
                        <input
                            type="password"
                            placeholder="Passcode"
                            value={formData.passcode}
                            onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                            onKeyPress={handleKeyPress}
                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400"
                        />
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 mb-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>Criando Conta...</span>
                        </>
                    ) : (
                        <>
                            <span>Criar conta</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                    )}
                </button>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={onToggle}
                        className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
                    >
                        Já tem uma conta? <span className="font-medium">Cadastre-se</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all duration-300">
                    <div className="transition-opacity duration-500">
                        {isLogin ? (
                            <LoginForm onToggle={handleToggle} onSuccess={handleSuccess} />
                        ) : (
                            <RegisterForm onToggle={handleToggle} onSuccess={handleSuccess} />
                        )}
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-xs text-gray-400">Por Tiago Ines @Embrace</p>
                </div>
            </div>

            <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default AuthScreen;