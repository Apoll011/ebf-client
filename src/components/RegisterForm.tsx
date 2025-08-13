import {AlertCircle, ArrowRight, Eye, EyeOff, Loader} from 'lucide-react';
import {useAuth} from "../hooks/useAuth.tsx";
import type {UserRole} from "../model/types.ts";
import {useState} from "react";

export const RegisterForm = ({onToggle, onSuccess}: { onToggle: () => void, onSuccess: () => void }) => {
    const {api, login} = useAuth();
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

    const roles: { value: UserRole, label: string }[] = [
        {value: 'viewer', label: 'Visualizador'},
        {value: 'teacher', label: 'Responsavel'},
        {value: 'admin', label: 'Administrador'}
    ];

    const handleRoleChange = (role: UserRole) => {
        setFormData({...formData, role});
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
            if (result.username) {
                login(formData.username, formData.password).then(() => onSuccess?.());
            } else {
                setError('Registracão falhou. Tente novamente.');
            }
        } catch {
            setError('Registracão falhou. Tente novamente.');
        } finally {
            setLoading(false);
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
                <h1 className="text-2xl font-light text-white mb-2">Crie uma Conta no Portal EBF</h1>
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
                        placeholder="Usuário"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-4 glass-input border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-4 glass-input border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    </button>
                </div>

                <div className="relative">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirmar Password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        onKeyPress={handleKeyPress}
                        className="w-full px-4 py-4 glass-input border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    </button>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm text-white/90 font-medium">Responsabilidade</label>
                    <div className="grid grid-cols-3 gap-2">
                        {roles.map((role) => (
                            <button
                                key={role.value}
                                type="button"
                                onClick={() => handleRoleChange(role.value)}
                                className={`px-3 py-2 text-[0.7rem] rounded-lg transition-all duration-200 !p-2 ${
                                    formData.role === role.value
                                        ? 'glass-button-accent'
                                        : 'glass-button '
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
                            onChange={(e) => setFormData({...formData, passcode: e.target.value})}
                            onKeyPress={handleKeyPress}
                            className="w-full px-4 py-4 glass-input border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-all duration-200 text-gray-700 placeholder-gray-400"
                        />
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 mb-1 glass-button-accent text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin"/>
                            <span>Criando Conta...</span>
                        </>
                    ) : (
                        <>
                            <span>Criar conta</span>
                            <ArrowRight
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"/>
                        </>
                    )}
                </button>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={onToggle}
                        className="text-white/80 hover:text-white hover:cursor-pointer text-sm transition-colors"
                    >
                        Já tem uma conta? <span className="font-medium">Cadastre-se</span>
                    </button>
                </div>
            </div>
        </div>
    );
};