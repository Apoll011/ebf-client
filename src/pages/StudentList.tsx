import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Users,
    ArrowUpDown,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Printer,
    Award,
    XCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import type {AgeGroup, Gender, Order, SortBy, StudentListItem, StudentsListQuery} from '../model/types';
import {MainLayout} from "../layout/MainLayout.tsx";
import {generatePDFContent} from "../util/print.ts";
import {useLocalStorageToggle} from "../hooks/useLocalStorageToggle.ts";

const StudentListPage: React.FC = () => {
    const navigate = useNavigate();
    const { api } = useAuth();

    const [students, setStudents] = useState<StudentListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoadingAgeActions, setIsLoadingAgeActions] = useState(false);
    const [notification, setNotification] = useState<{message: string, type: string} | null>(null);
    const [filters, setFilters] = useState<StudentsListQuery>({
        sort_by: 'name',
        order: 'asc'
    });
    const { value: glassMode  } = useLocalStorageToggle('glass')

    const showNotification = (message: string, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const studentsPerPage = 25;

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const studentsData = await api.getStudents(filters);
                setStudents(studentsData);
            } catch (error) {
                console.error('Failed to fetch students:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents().then();
    }, [filters, api]);

    const filteredStudents = useMemo(() => {
        if (!searchTerm) return students;
        return students.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    const handleStudentClick = (studentId: string) => {
        navigate(`/student/${studentId}`);
    };

    const handleFilterChange = (key: keyof StudentsListQuery, value: AgeGroup | Gender | SortBy | Order | number | string | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === '' ? undefined : value
        }));
        setCurrentPage(0);
    };

    const handleSortChange = (sortBy: SortBy) => {
        setFilters(prev => ({
            ...prev,
            sort_by: sortBy,
            order: prev.sort_by === sortBy && prev.order === 'asc' ? 'desc' : 'asc'
        }));
        setCurrentPage(0);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const clearFilters = () => {
        setFilters({ sort_by: 'name', order: 'asc' });
        setSearchTerm('');
        setCurrentPage(0);
    };

    const getStudentsForAgeGroupActions = async () => {
        if (!filters.age_group) {
            return [];
        }
        setIsLoadingAgeActions(true);
        const students = await api.getStudents({
            age_group: filters.age_group,
            sort_by: 'name',
            order: 'asc'
        });
        setIsLoadingAgeActions(false);
        return students;
    }

    const handlePrintPlanilha = async () => {
        const studentsForAgeGroup: StudentListItem[] = await getStudentsForAgeGroupActions();
        if (studentsForAgeGroup.length === 0 || !filters.age_group) {
            showNotification('Nenhum estudante encontrado para a turma selecionada.', 'error');
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            showNotification('Popup bloqueado! Por favor, permita popups para imprimir.', 'error');
            return;
        }

        const htmlContent = generatePDFContent(studentsForAgeGroup, filters.age_group);

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
            }, 250);
        };
    };


    const handleAssignPoints = async () => {
        const studentsForAgeGroup = await getStudentsForAgeGroupActions();
        if (studentsForAgeGroup.length === 0) {
            alert('Nenhum estudante encontrado para a turma selecionada.');
            return;
        }
        console.log('Atribuir pontos para estudantes:', studentsForAgeGroup);
    };

    const getGenderLabel = (gender: Gender) => {
        return gender === 'male' ? 'Masculino' : 'Feminino';
    };

    const getAgeGroupLabel = (group: AgeGroup) => {
        const labels = {
            '0-6': '0-6 anos',
            '7-9': '7-9 anos',
            '10-12': '10-12 anos',
            '13-15': '13-15 anos',
            'custom': 'Personalizado'
        };
        return labels[group];
    };

    const totalStudents = filteredStudents.length;
    const totalPages = Math.ceil(totalStudents / studentsPerPage);
    const startIndex = currentPage * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, endIndex);

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className={`${glassMode ? 'glass-card' : 'bg-white'} rounded-lg shadow-sm border border-gray-200 mb-6`}>
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Procurar estudantes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`${glassMode ? 'glass-input' : ''} w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none`}
                                />
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${glassMode ? 'glass-button' : ''}`}
                            >
                                <Filter className="h-4 w-4" />
                                <span>Filtros</span>
                                <ChevronDown className={`h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {filters.age_group && (
                                <button
                                    onClick={handlePrintPlanilha}
                                    className={`flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors shadow-sm ${glassMode ? 'glass-button-accent' : ''}`}
                                >
                                    <Printer className="h-4 w-4" />
                                    <span>Imprimir Planilha</span>
                                </button>
                            )}
                            {filters.age_group && (
                                <button
                                    onClick={handleAssignPoints}
                                    className={`flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors shadow-sm ${glassMode ? 'glass-button-accent' : ''}`}
                                >
                                    <Award className="h-4 w-4" />
                                    <span>Atribuir Pontos do Dia</span>
                                </button>
                            )}
                        </div>
                        {showFilters && (
                            <>
                                <div className={`!mt-10 ${glassMode ? 'glass-divider-thick' : 'border-b border-gray-100 w-full'} `}></div>
                                <div className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium ${glassMode ? 'text-white/80' : 'text-gray-700'} mb-1`}>
                                                Turmas
                                            </label>
                                            <select
                                                value={filters.age_group || ''}
                                                onChange={(e) => handleFilterChange('age_group', e.target.value)}
                                                className={`${glassMode ? 'glass-select' : ''} w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none`}
                                            >
                                                <option value="">Todos as Turmas</option>
                                                <option value="0-6">0-6 anos</option>
                                                <option value="7-9">7-9 anos</option>
                                                <option value="10-12">10-12 anos</option>
                                                <option value="13-15">13-15 anos</option>
                                                <option value="custom">Personalizado</option>
                                            </select>
                                        </div>

                                        {/* Gender Filter */}
                                        <div>
                                            <label className={`block text-sm font-medium ${glassMode ? 'text-white/80' : 'text-gray-700'} mb-1`}>
                                                Gênero
                                            </label>
                                            <select
                                                value={filters.gender || ''}
                                                onChange={(e) => handleFilterChange('gender', e.target.value)}
                                                className={`${glassMode ? 'glass-select' : ''} w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none`}
                                            >
                                                <option value="">Todos os gêneros</option>
                                                <option value="male">Masculino</option>
                                                <option value="female">Feminino</option>
                                            </select>
                                        </div>

                                        {/* Min Age Filter */}
                                        <div>
                                            <label className={`block text-sm font-medium ${glassMode ? 'text-white/80' : 'text-gray-700'} mb-1`}>
                                                Idade Mínima
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="18"
                                                value={filters.min_age || ''}
                                                onChange={(e) => handleFilterChange('min_age', parseInt(e.target.value) || undefined)}
                                                className={`${glassMode ? 'glass-input' : ''} w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none`}
                                                placeholder="Ex: 10"
                                            />
                                        </div>

                                        {/* Max Age Filter */}
                                        <div>
                                            <label className={`block text-sm font-medium ${glassMode ? 'text-white/80' : 'text-gray-700'} mb-1`}>
                                                Idade Máxima
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="18"
                                                value={filters.max_age || ''}
                                                onChange={(e) => handleFilterChange('max_age', parseInt(e.target.value) || undefined)}
                                                className={`${glassMode ? 'glass-input' : ''} w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none`}
                                                placeholder="Ex: 15"
                                            />
                                        </div>
                                    </div>

                                    {/* Clear Filters */}
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={clearFilters}
                                            className={`text-sm ${glassMode ? 'text-white/70' : 'text-gray-700'} hover:text-gray-900 underline`}
                                        >
                                            Limpar filtros
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                { loading && (
                    <>
                        <div className={glassMode ? 'glass-card glass-pulse' : 'bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse'}>
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className={`h-5 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded w-48`}></div>
                                    <div className="flex items-center space-x-4">
                                        <div className={`h-4 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded w-16`}></div>
                                        <div className={`h-4 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded w-12`}></div>
                                        <div className={`h-4 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded w-14`}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, idx) => (
                                    <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-white">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <div className={`h-4 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded w-3/4 mb-2`}></div>
                                                <div className={`h-3 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded w-1/2`}></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className={`h-5 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded w-16`}></div>
                                            <div className={`h-4 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded w-10`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className={`h-4 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded w-48`}></div>
                                    <div className="flex items-center space-x-2">
                                        <div className={`h-8 w-8 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded`}></div>
                                        <div className={`h-4 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded w-20`}></div>
                                        <div className={`h-8 w-8 ${glassMode ? 'glass-skeleton' : 'bg-gray-200' } rounded`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                )}
                { !loading && (
                    <div className={glassMode ? 'glass-card' : 'bg-white rounded-lg shadow-sm border border-gray-200'}>
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className={`text-lg font-medium ${glassMode ? 'text-white' : 'text-gray-900'} `}>
                                    Lista de Estudantes ({totalStudents} total)
                                </h2>
                                <div className={`flex items-center space-x-4 text-sm ${glassMode ? 'text-white/80' : 'text-gray-500'} `}>
                                    <span>Ordenar por:</span>
                                    <button
                                        onClick={() => handleSortChange('name')}
                                        className={`flex items-center space-x-1 hover:text-gray-900 ${
                                            filters.sort_by === 'name' ? glassMode ? 'text-white font-medium' : 'text-gray-900 font-medium' : ''
                                        }`}
                                    >
                                        <span>Nome</span>
                                        {filters.sort_by === 'name' && (
                                            <ArrowUpDown className="h-3 w-3" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('age')}
                                        className={`flex items-center space-x-1 hover:text-gray-900 ${
                                            filters.sort_by === 'age' ? glassMode ? 'text-white font-medium' : 'text-gray-900 font-medium' : ''
                                        }`}
                                    >
                                        <span>Idade</span>
                                        {filters.sort_by === 'age' && (
                                            <ArrowUpDown className="h-3 w-3" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleSortChange('total_points')}
                                        className={`flex items-center space-x-1 hover:text-gray-900 ${
                                            filters.sort_by === 'total_points' ? glassMode ? 'text-white font-medium' : 'text-gray-900 font-medium' : ''
                                        }`}
                                    >
                                        <span>Pontos</span>
                                        {filters.sort_by === 'total_points' && (
                                            <ArrowUpDown className="h-3 w-3" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {currentStudents.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className={`mx-auto h-12 w-12 ${glassMode ? 'text-white/70' : 'text-gray-400'}`} />
                                    <h3 className={`mt-2 text-sm font-medium ${glassMode ? 'text-white' : 'text-gray-900'}`}>Nenhum estudante encontrado</h3>
                                    <p className={`mt-1 text-sm ${glassMode ? 'text-white/70' : 'text-gray-500'}`}>
                                        Tente ajustar os filtros ou termo de busca.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {currentStudents.map((student) => (
                                        <div
                                            key={student.id}
                                            onClick={() => handleStudentClick(student.id)}
                                            className={`p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all cursor-pointer hover:scale-105 ${glassMode ? 'glass-accent': 'bg-white'}`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`text-sm font-medium ${glassMode ? 'text-white' : 'text-gray-900'} truncate`}>
                                                        {student.name}
                                                    </h3>
                                                    <p className={`text-xs ${glassMode ? 'text-white/70' : 'text-gray-500'}`}>
                                                        {student.age} anos • {getGenderLabel(student.gender)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className={`${glassMode ? 'glass-accent' : ''} inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800`}>
                                                    {getAgeGroupLabel(student.group)}
                                                </span>
                                                <span className={`text-sm font-medium ${glassMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {student.total_points} pts
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className={`text-sm ${glassMode ? 'text-white/80' : 'text-gray-700'}`}>
                                        Mostrando {startIndex + 1} até {Math.min(endIndex, totalStudents)} de {totalStudents} estudantes
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 0}
                                            className={`p-2 border border-gray-300 rounded-md ${glassMode ? 'glass-button !p-3' : 'hover:bg-gray-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>

                                        <span className={`text-sm ${glassMode ? 'text-white/80' : 'text-gray-700'}`}>
                    Página {currentPage + 1} de {totalPages}
                  </span>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages - 1}
                                            className={`p-2 border border-gray-300 rounded-md ${glassMode ? 'glass-button !p-3' : 'hover:bg-gray-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                { isLoadingAgeActions && (
                    <div className="fixed inset-0 bg-opacity-20 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50">
                        <div className={`${glassMode ? 'glass-modal' : 'bg-white'} p-8 rounded-lg shadow-lg flex flex-col items-center`}>
                            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${glassMode ? 'border-gray-300' : 'border-gray-900'}`}></div>
                            <p className={`mt-4 text-lg font-semibold ${glassMode ? 'text-white' : ''}`}>Carregando Dados...</p>
                        </div>
                    </div>
                )}

                {notification && (
                    <div className={`fixed ${glassMode ? 'top-25' : 'top-20'} right-6 z-50 p-4 rounded-lg shadow-lg border transition-all duration-500 transform ${
                        glassMode ? 'glass-accent' : notification.type === 'error'
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                        <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${glassMode ? 'glass-badge' : ''} ${
                                notification.type === 'error'
                                    ? '!bg-red-100 !text-red-600'
                                    : '!bg-emerald-100 !text-emerald-600'
                            }`}>
                                {notification.type === 'error' ? (
                                    <XCircle className="w-4 h-4" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className={`font-medium text-sm ${glassMode ? 'text-white/80' : ''}`}>{notification.message}</p>
                            </div>
                            <button
                                onClick={() => setNotification(null)}
                                className={`text-current hover:bg-black/5 rounded-lg p-1 transition-colors ${glassMode ? 'text-white/80' : ''}`}
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default StudentListPage;