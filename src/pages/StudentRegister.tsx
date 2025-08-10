import  { useState } from 'react';
import { useAuth } from "../api/useAuth.tsx";
import type {CreateStudentRequest, Gender} from "../model/types.ts";

const StudentRegistration = () => {
    const { api } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        parent_name: '',
        parent_phone: '',
        address: '',
        notes: ''
    });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            age: '',
            gender: '',
            parent_name: '',
            parent_phone: '',
            address: '',
            notes: ''
        });
    };

    const handleSubmit = async () => {

        if (!formData.name || !formData.age || !formData.gender || !formData.parent_name || !formData.parent_phone) {
            showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }

        // Phone validation for Cape Verde
        const phoneRegex = /^[95]\d{2}\s\d{2}\s\d{2}$/;
        if (!phoneRegex.test(formData.parent_phone)) {
            showNotification('Formato de telefone inválido. Use: 9XX XX XX ou 5XX XX XX', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const studentData: CreateStudentRequest = {
                name: formData.name,
                age: parseInt(formData.age),
                gender: formData.gender as Gender,
                parent_name: formData.parent_name,
                parent_phone: formData.parent_phone,
                address: formData.address || undefined,
                notes: formData.notes || undefined
            };

            await api.registerStudent(studentData);
            showNotification(`Aluno ${formData.name} registrado com sucesso!`);
            resetForm();
        } catch (error) {
            showNotification('Erro ao registrar aluno. Tente novamente.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const formatPhoneInput = (value) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '');

        // Format as XXX XX XX
        if (digits.length <= 3) return digits;
        if (digits.length <= 5) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
        return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)}`;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneInput(e.target.value);
        setFormData(prev => ({ ...prev, parent_phone: formatted }));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-light text-gray-900 mb-2">Registro de Alunos</h1>
                    <p className="text-gray-600">Adicione novos alunos ao sistema rapidamente</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Digite o nome completo do aluno"
                                />
                            </div>

                            {/* Age */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Idade *
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="18"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Idade"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gênero *
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="male">Masculino</option>
                                    <option value="female">Feminino</option>
                                </select>
                            </div>

                            {/* Parent Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome do Responsável *
                                </label>
                                <input
                                    type="text"
                                    name="parent_name"
                                    value={formData.parent_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Nome do pai/mãe ou responsável"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefone do Responsável *
                                </label>
                                <input
                                    type="text"
                                    name="parent_phone"
                                    value={formData.parent_phone}
                                    onChange={handlePhoneChange}
                                    maxLength="9"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="9XX XX XX ou 5XX XX XX"
                                />
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Endereço
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Endereço completo (opcional)"
                                />
                            </div>

                            {/* Notes */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Observações
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    placeholder="Informações adicionais sobre o aluno (opcional)"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="relative px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    'Registrar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all duration-300 ${
                    notification.type === 'error'
                        ? 'bg-red-50 border border-red-200 text-red-800'
                        : 'bg-green-50 border border-green-200 text-green-800'
                }`}>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                            notification.type === 'error' ? 'bg-red-400' : 'bg-green-400'
                        }`}></div>
                        <span className="font-medium">{notification.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentRegistration;