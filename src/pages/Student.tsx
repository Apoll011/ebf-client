// @ts-nocheck
import { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Calendar,
    Phone,
    MapPin,
    User,
    Users,
    Award,
    CheckCircle,
    XCircle,
    Settings,
    BookOpen,
    MessageSquare,
    Trophy,
    Target,
    UserCheck,
    Gift
} from 'lucide-react';
import { useAuth } from "../hooks/useAuth.tsx";
import type {Student} from "../model/types.ts";
import {MainLayout} from "../layout/main.tsx";

const StudentInfo = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { api } = useAuth();

    const [student, setStudent] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingPoints, setIsUpdatingPoints] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedPoints, setSelectedPoints] = useState<{ PRESENCE?: boolean; BOOK?: boolean; VERSICLE?: boolean; PARTICIPATION?: boolean; GUEST?: boolean; GAME?: boolean; }>({});
    const [adjustmentData, setAdjustmentData] = useState({ amount: 0, reason: '', date: new Date().toISOString().split('T')[0] });
    const [notification, setNotification] = useState<{message: string, type: string} | null>(null);

    const pointCategories = [
        { key: 'presence', label: 'Presença', icon: UserCheck, color: 'emerald', points: 50 },
        { key: 'book', label: 'Trouxe Livro', icon: BookOpen, color: 'blue', points: 20 },
        { key: 'versicle', label: 'Versículo', icon: MessageSquare, color: 'violet', points: 30 },
        { key: 'participation', label: 'Participação', icon: Target, color: 'amber', points: 40 },
        { key: 'guest', label: 'Trouxe Convidado', icon: Gift, color: 'rose', points: 10 },
        { key: 'game', label: 'Jogo', icon: Trophy, color: 'indigo', points: 15 }
    ];

    if (!studentId) {
        navigate('/');
        return null;
    }

    useEffect(() => {
        if (studentId) {
            loadStudent();
        }
    }, [studentId]);

    const showNotification = (message: string, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const loadStudent = async () => {
        setIsLoading(true);
        try {
            const studentData = await api.getStudent(studentId);
            setStudent(studentData);
        } catch {
            showNotification('Erro ao carregar dados do aluno', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const updateStudentInBackground = async () => {
        try {
            const studentData = await api.getStudent(studentId);
            setStudent(studentData);
        } catch (error) {
            console.error('Failed to update student data:', error);
        }
    };

    const LoadingPlaceholder = () => (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                <div className="items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="mb-4 w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                        <div>
                                            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mb-3"></div>
                                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                        </div>

                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div>
                                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                                        <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div>
                                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                                        <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const NotFoundPlaceholder = () => (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Aluno não encontrado</h3>
                <p className="text-gray-500">ID: {studentId}</p>
            </div>
        </div>
    );


    if (isLoading) {
        return (
            <MainLayout>
                <LoadingPlaceholder />
            </MainLayout>
        );
    }

    if (!student) {
        return (
            <MainLayout>
                <NotFoundPlaceholder />
            </MainLayout>
        );
    }

    const getPointsForDate = async (date: string) => {
        const dayPoints = student?.points?.find(p => p.date === date);
        return dayPoints || {};
    };

    const openPointsModal = async () => {
        const points = await getPointsForDate(selectedDate);
        const booleanPoints = {};
        pointCategories.forEach(cat => {
            booleanPoints[cat.key.toLowerCase()] = Boolean(points[cat.key]);
        });
        setSelectedPoints(booleanPoints);
        setShowPointsModal(true);
    };

    const togglePoint = (category) => {
        setSelectedPoints(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const savePoints = async () => {
        setIsUpdatingPoints(true);
        try {
            const pointsData = {
                date: selectedDate,
                points: selectedPoints
            };
            console.log('Saving points:', pointsData);
            await api.awardPoints(student.id, pointsData);
            showNotification('Pontos atualizados com sucesso!');
            setShowPointsModal(false);
            await updateStudentInBackground();
        } catch {
            showNotification('Erro ao salvar pontos', 'error');
        } finally {
            setIsUpdatingPoints(false);
        }
    };

    const adjustPoints = async () => {
        setIsUpdatingPoints(true);
        try {
            await api.adjustPoints(student.id, adjustmentData);
            showNotification('Ajuste de pontos realizado com sucesso!');
            setShowAdjustModal(false);
            setAdjustmentData({ amount: 0, reason: '', date: new Date().toISOString().split('T')[0] });
            await updateStudentInBackground();
        } catch {
            showNotification('Erro ao ajustar pontos', 'error');
        } finally {
            setIsUpdatingPoints(false);
        }
    };

    const deleteStudent = async () => {
        setIsDeleting(true);
        try {
            await api.deleteStudent(student.id);
            navigate('/list');
        } catch {
            showNotification(`Erro ao Deletar ${student.name}`, 'error');
        } finally {
            setIsDeleting(false);
        }
    }

    const getWeekDates = () => {
        const today = new Date();
        const currentWeek = [];
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            currentWeek.push({
                date: date.toISOString().split('T')[0],
                day: date.getDate(),
                dayName: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
                isToday: date.toDateString() === today.toDateString()
            });
        }
        return currentWeek;
    };

    const getColorClass = (color, variant = 'bg') => {
        const colors = {
            emerald: {
                bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                button: 'bg-emerald-500 hover:bg-emerald-600',
                icon: 'text-emerald-600'
            },
            blue: {
                bg: 'bg-blue-50 text-blue-700 border-blue-200',
                button: 'bg-blue-500 hover:bg-blue-600',
                icon: 'text-blue-600'
            },
            violet: {
                bg: 'bg-violet-50 text-violet-700 border-violet-200',
                button: 'bg-violet-500 hover:bg-violet-600',
                icon: 'text-violet-600'
            },
            amber: {
                bg: 'bg-amber-50 text-amber-700 border-amber-200',
                button: 'bg-amber-500 hover:bg-amber-600',
                icon: 'text-amber-600'
            },
            rose: {
                bg: 'bg-rose-50 text-rose-700 border-rose-200',
                button: 'bg-rose-500 hover:bg-rose-600',
                icon: 'text-rose-600'
            },
            indigo: {
                bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                button: 'bg-indigo-500 hover:bg-indigo-600',
                icon: 'text-indigo-600'
            }
        };
        return colors[color]?.[variant] || colors.blue[variant];
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg border border-gray-200">
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                        <div className="items-center justify-between">
                                            <div className="mb-4 flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h1 className="text-2xl font-semibold text-gray-900">{student.name}</h1>
                                                    <p className="text-gray-600 text-sm">Turma: {student.group}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-gray-800 text-white px-6 w-[100%] py-3 rounded-lg">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold">{student.total_points}</div>
                                                        <div className="text-xs opacity-90">PONTOS TOTAIS</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
                                    <div className="space-y-3">
                                        <button
                                            onClick={openPointsModal}
                                            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center space-x-2"
                                        >
                                            <Award className="w-4 h-4" />
                                            <span>Atribuir Pontos</span>
                                        </button>
                                        <button
                                            onClick={() => setShowAdjustModal(true)}
                                            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Ajustar Pontos</span>
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="w-full bg-red-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-red-400 transition-colors duration-200 flex items-center justify-center space-x-2"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            <span>Deletar {student.name}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                                        <Calendar className="w-6 h-6 text-gray-600 mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">{student.age}</div>
                                        <div className="text-sm text-gray-600">anos</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                                        <User className="w-6 h-6 text-gray-600 mb-2" />
                                        <div className="text-lg font-semibold text-gray-900">{student.gender === 'male' ? 'Masculino' : 'Feminino'}</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                                        <Users className="w-6 h-6 text-gray-600 mb-2" />
                                        <div className="text-lg font-semibold text-gray-900">{student.group}</div>
                                        <div className="text-sm text-gray-600">Turma</div>
                                    </div>
                                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                                        <Calendar className="w-6 h-6 text-gray-600 mb-2" />
                                        <div className="text-sm font-semibold text-gray-900">
                                            {new Date(student.created_at).toLocaleDateString('pt-BR')}
                                        </div>
                                        <div className="text-xs text-gray-600">registro</div>
                                    </div>
                                </div>

                                {student.address && (
                                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <MapPin className="w-6 h-6 text-gray-600" />
                                            <h3 className="text-lg font-semibold text-gray-900">Endereço</h3>
                                        </div>
                                        <p className="text-gray-700">{student.address}</p>
                                    </div>
                                )}

                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">Informações do Responsável</h3>
                                            <p className="text-gray-600">Contatos e dados familiares</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600 mb-1 block">Nome Completo</label>
                                                <p className="text-lg font-semibold text-gray-900">{student.parent_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600 mb-1 block flex items-center space-x-2">
                                                    <Phone className="w-4 h-4" />
                                                    <span>Telefone</span>
                                                </label>
                                                <p className="text-lg font-semibold text-gray-900">{student.parent_phone}</p>
                                            </div>
                                        </div>

                                        {student.notes && (
                                            <div className="md:col-span-2">
                                                <label className="text-sm font-medium text-gray-600 mb-2 block">Observações</label>
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-gray-700 leading-relaxed">{student.notes}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
            </div>

            {showPointsModal && (
                <div className="fixed inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">Atribuir Pontos</h3>
                                        <button
                                            onClick={() => setShowPointsModal(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Week Days Selector */}
                                    <div className="grid grid-cols-7 gap-2 mb-4">
                                        {getWeekDates().map((day) => (
                                            <button
                                                key={day.date}
                                                onClick={() => setSelectedDate(day.date)}
                                                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                                                    selectedDate === day.date
                                                        ? 'bg-gray-800 text-white'
                                                        : day.isToday
                                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                <div className="text-center">
                                                    <div className="text-xs">{day.dayName}</div>
                                                    <div className="font-bold">{day.day}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pointCategories.map((category) => {
                                            const Icon = category.icon;
                                            return (
                                                <div
                                                    key={category.key}
                                                    onClick={() => togglePoint(category.key)}
                                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                        selectedPoints[category.key]
                                                            ? `${getColorClass(category.color)} border-current`
                                                            : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <Icon className={`w-5 h-5 ${selectedPoints[category.key] ? 'text-current' : 'text-gray-500'}`} />
                                                            <div>
                                                                <div className="font-semibold">{category.label}</div>
                                                                <div className="text-sm opacity-70">{category.points} pontos</div>
                                                            </div>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                            selectedPoints[category.key]
                                                                ? 'bg-current border-current text-white'
                                                                : 'border-gray-300'
                                                        }`}>
                                                            {selectedPoints[category.key] && (
                                                                <CheckCircle className="w-4 h-4 text-black" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-200 flex gap-3">
                                    <button
                                        onClick={() => setShowPointsModal(false)}
                                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={savePoints}
                                        disabled={isUpdatingPoints}
                                        className="flex-1 py-3 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {isUpdatingPoints ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Salvar Pontos</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
            )}

            {showAdjustModal && (
                <div className="fixed inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-gray-900">Ajustar Pontos</h3>
                                        <button
                                            onClick={() => setShowAdjustModal(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-1">Adicione ou remova pontos com justificativa</p>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade de Pontos</label>
                                        <input
                                            type="number"
                                            value={adjustmentData.amount}
                                            onChange={(e) => setAdjustmentData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                            placeholder="Use números negativos para remover"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                                        <input
                                            type="date"
                                            value={adjustmentData.date}
                                            onChange={(e) => setAdjustmentData(prev => ({ ...prev, date: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Motivo do Ajuste</label>
                                        <textarea
                                            value={adjustmentData.reason}
                                            onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent resize-none"
                                            rows={3}
                                            placeholder="Descreva o motivo do ajuste..."
                                        />
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-200 flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowAdjustModal(false);
                                            setAdjustmentData({ amount: 0, reason: '', date: new Date().toISOString().split('T')[0] });
                                        }}
                                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={adjustPoints}
                                        disabled={!adjustmentData.reason.trim() || adjustmentData.amount === 0 || isUpdatingPoints}
                                        className="flex-1 py-3 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        {isUpdatingPoints ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Settings className="w-4 h-4" />
                                                <span>Ajustar</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900">Queres deletar {student.name}</h3>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">Esta ação não pode ser desfeita</p>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                }}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={deleteStudent}
                                disabled={isDeleting}
                                className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isDeleting ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4" />
                                        <span>Deletar</span>
                                    </>
                                )}

                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg border transition-all duration-500 transform ${
                            notification.type === 'error'
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        }`}>
                    <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    notification.type === 'error'
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                    {notification.type === 'error' ? (
                                        <XCircle className="w-4 h-4" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{notification.message}</p>
                                </div>
                                <button
                                    onClick={() => setNotification(null)}
                                    className="text-current hover:bg-black/5 rounded-lg p-1 transition-colors"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                            </div>
                </div>
            )}
        </MainLayout>
    );
};

export default StudentInfo;