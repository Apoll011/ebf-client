import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from "../api/useAuth.tsx";
import type {Student} from "../model/types.ts";

const StudentInfo = () => {
    const { studentId } = useParams();
    const { api } = useAuth();

    const [student, setStudent] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedPoints, setSelectedPoints] = useState<{ PRESENCE?: boolean; BOOK?: boolean; VERSICLE?: boolean; PARTICIPATION?: boolean; GUEST?: boolean; GAME?: boolean; }>({});
    const [adjustmentData, setAdjustmentData] = useState({ amount: 0, reason: '', date: new Date().toISOString().split('T')[0] });
    const [notification, setNotification] = useState<{message: string, type: string}>(null);

    const pointCategories = [
        { key: 'PRESENCE', label: 'Presença', icon: '👤', color: 'emerald', points: 10 },
        { key: 'BOOK', label: 'Trouxe Livro', icon: '📚', color: 'blue', points: 5 },
        { key: 'VERSICLE', label: 'Versículo', icon: '📖', color: 'violet', points: 15 },
        { key: 'PARTICIPATION', label: 'Participação', icon: '🙋', color: 'amber', points: 8 },
        { key: 'GUEST', label: 'Trouxe Convidado', icon: '👥', color: 'rose', points: 20 },
        { key: 'GAME', label: 'Jogo', icon: '🎮', color: 'indigo', points: 12 }
    ];

    useEffect(() => {
        if (studentId) {
            loadStudent();
        }
    }, [studentId]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const loadStudent = async () => {
        setIsLoading(true);
        try {
            console.log('Carregando dados do aluno...', studentId);
            const studentData = await api.getStudent(studentId);
            console.log(studentData);
            setStudent(studentData);
        } catch (error) {
            showNotification('Erro ao carregar dados do aluno', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="w-full justify-center flex">
                        <div className="w-20 h-20 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>

                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Carregando informações</h3>
                        <p className="text-slate-500">Aguarde um momento...</p>
                    </div>
                </div>
            </div>
        );

    }

    if (!student) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700">Aluno não encontrado</h3>
                    <p className="text-slate-500">ID: {studentId}</p>
                </div>
            </div>
        );
    }

    const getPointsForDate = async (studentId, date) => {
        const dayPoints = student?.points?.find(p => p.date === date);
        return dayPoints || {};
    };

    const openPointsModal = async () => {
        const points = await getPointsForDate(student.id, selectedDate);
        const booleanPoints = {};
        pointCategories.forEach(cat => {
            booleanPoints[cat.key] = Boolean(points[cat.key]);
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
        try {
            const pointsData = {
                date: selectedDate,
                points: selectedPoints
            };
            await api.awardPoints(student.id, pointsData);
            showNotification('Pontos atualizados com sucesso!');
            setShowPointsModal(false);
            await loadStudent(); //Todo Instead of loading the entire student again, we could just update the points in the state  or load the student  but on the background
        } catch (error) {
            showNotification('Erro ao salvar pontos', 'error');
        }
    };

    const adjustPoints = async () => {
        try {
            await api.adjustPoints(student.id, adjustmentData);
            showNotification('Ajuste de pontos realizado com sucesso!');
            setShowAdjustModal(false);
            setAdjustmentData({ amount: 0, reason: '', date: new Date().toISOString().split('T')[0] });
            await loadStudent();
        } catch (error) {
            showNotification('Erro ao ajustar pontos', 'error');
        }
    };

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

    const getTotalPointsForDate = (date) => {
        const dayPoints = student?.points?.find(p => p.date === date);
        if (!dayPoints) return 0;

        return pointCategories.reduce((total, category) => {
            return total + (dayPoints[category.key] || 0);
        }, 0);
    };

    const getColorClass = (color, variant = 'bg') => {
        const colors = {
            emerald: variant === 'bg' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500',
            blue: variant === 'bg' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500',
            violet: variant === 'bg' ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-violet-500',
            amber: variant === 'bg' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-500',
            rose: variant === 'bg' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-rose-500',
            indigo: variant === 'bg' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-indigo-500'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">{student.name}</h1>
                                <p className="text-slate-500 text-sm">ID: {student.id} • {student.group}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{student.total_points}</div>
                                    <div className="text-xs opacity-90">PONTOS TOTAIS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Info Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                                    <div className="text-3xl mb-2">🎂</div>
                                    <div className="text-2xl font-bold text-slate-800">{student.age}</div>
                                    <div className="text-sm text-slate-500">anos</div>
                                </div>
                                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                                    <div className="text-3xl mb-2">{student.gender === 'male' ? '👦' : '👧'}</div>
                                    <div className="text-lg font-semibold text-slate-800">{student.gender === 'male' ? 'Masculino' : 'Feminino'}</div>
                                </div>
                                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                                    <div className="text-3xl mb-2">👥</div>
                                    <div className="text-lg font-semibold text-slate-800">{student.group}</div>
                                    <div className="text-sm text-slate-500">grupo</div>
                                </div>
                                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                                    <div className="text-3xl mb-2">📅</div>
                                    <div className="text-sm font-semibold text-slate-800">
                                        {new Date(student.created_at).toLocaleDateString('pt-BR')}
                                    </div>
                                    <div className="text-xs text-slate-500">registro</div>
                                </div>
                            </div>

                            {student.address && (
                                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="text-2xl">🏠</div>
                                        <h3 className="text-lg font-semibold text-slate-800">Endereço</h3>
                                    </div>
                                    <p className="text-slate-700">{student.address}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-sm">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                                            👨‍👩‍👧‍👦
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">Informações do Responsável</h3>
                                            <p className="text-slate-500">Contatos e dados familiares</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-slate-500 mb-1 block">Nome Completo</label>
                                                <p className="text-lg font-semibold text-slate-800">{student.parent_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-500 mb-1 block">Telefone</label>
                                                <p className="text-lg font-semibold text-slate-800">{student.parent_phone}</p>
                                            </div>
                                        </div>

                                        {student.notes && (
                                            <div className="md:col-span-2">
                                                <label className="text-sm font-medium text-slate-500 mb-2 block">Observações</label>
                                                <div className="bg-slate-50 rounded-xl p-4">
                                                    <p className="text-slate-700 leading-relaxed">{student.notes}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Ações Rápidas</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={openPointsModal}
                                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                                    >
                                        <span>🏆</span>
                                        <span>Atribuir Pontos</span>
                                    </button>
                                    <button
                                        onClick={() => setShowAdjustModal(true)}
                                        className="w-full bg-slate-100 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-200 transition-all duration-300 flex items-center justify-center space-x-2"
                                    >
                                        <span>⚖️</span>
                                        <span>Ajustar Pontos</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

            {showPointsModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800">Atribuir Pontos</h3>
                            <p className="text-slate-500 text-sm">
                                {new Date(selectedDate).toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            {pointCategories.map((category) => (
                                <div
                                    key={category.key}
                                    onClick={() => togglePoint(category.key)}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                        selectedPoints[category.key]
                                            ? `${getColorClass(category.color)} border-current shadow-sm scale-[0.98]`
                                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{category.icon}</span>
                                            <div>
                                                <div className="font-semibold">{category.label}</div>
                                                <div className="text-sm opacity-70">{category.points} pontos</div>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                            selectedPoints[category.key]
                                                ? 'bg-current border-current text-white'
                                                : 'border-slate-300'
                                        }`}>
                                            {selectedPoints[category.key] && (
                                                <svg fill="#000000" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fill-rule="evenodd"></path> </g></svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => setShowPointsModal(false)}
                                className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all duration-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={savePoints}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300"
                            >
                                Salvar Pontos
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAdjustModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800">Ajustar Pontos Manualmente</h3>
                            <p className="text-slate-500 text-sm">Adicione ou remova pontos com justificativa</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Quantidade de Pontos</label>
                                <input
                                    type="number"
                                    value={adjustmentData.amount}
                                    onChange={(e) => setAdjustmentData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Use números negativos para remover"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Data</label>
                                <input
                                    type="date"
                                    value={adjustmentData.date}
                                    onChange={(e) => setAdjustmentData(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Motivo do Ajuste</label>
                                <textarea
                                    value={adjustmentData.reason}
                                    onChange={(e) => setAdjustmentData(prev => ({ ...prev, reason: e.target.value }))}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows={3}
                                    placeholder="Descreva o motivo do ajuste..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowAdjustModal(false);
                                    setAdjustmentData({ amount: 0, reason: '', date: new Date().toISOString().split('T')[0] });
                                }}
                                className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all duration-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={adjustPoints}
                                disabled={!adjustmentData.reason.trim() || adjustmentData.amount === 0}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Ajustar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-500 transform ${
                    notification.type === 'error'
                        ? 'bg-red-50/90 border-red-200 text-red-800'
                        : 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                }`}>
                    <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            notification.type === 'error'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-emerald-100 text-emerald-600'
                        }`}>
                            {notification.type === 'error' ? '⚠️' : '✅'}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className="text-current hover:bg-black/5 rounded-lg p-1 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentInfo;