import React, { useState } from "react";
import { MainLayout } from "../layout/main.tsx";
import { useAuth } from "../hooks/useAuth.tsx";
import type {
    EventSummary,
    EventProgress,
    TodayDetailedStats,
    RegistrationStats,
    RegistrationDemographics,
    TodaySummary,
    Engagement,
    PerformanceRanking,
    ClassPerformance,
    PointsCategorySummary,
    DailyPointsTrend,
    PointsDistribution,
    GenderPerformanceAnalysis,
    EventPredictions, DailyAttendance
} from "../model/types";

import { Calendar, Users, Trophy, TrendingUp, Award, Target, Activity, BarChart3, PieChart, UserCheck, Star, User } from "lucide-react";
import {dashboardCache, useWidgetDataWithCache} from "../hooks/useWidgetDataCached.ts";
import {useNavigate} from "react-router-dom";

const SkeletonCard = ({ className = "" }) => (
    <div className={`bg-white rounded-xl border border-gray-100 p-6 h-full ${className}`}>
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
    </div>
);

const SkeletonChart = ({ className = "" }) => (
    <div className={`bg-white rounded-xl border border-gray-100 p-6 h-full ${className}`}>
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="flex items-end space-x-2 h-32">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className={`bg-gray-200 rounded-t w-full`} style={{height: `${Math.random() * 100 + 20}%`}}></div>
                ))}
            </div>
        </div>
    </div>
);

const WidgetWrapper = ({ children, isLoading, skeleton }: { children: React.ReactNode, isLoading: boolean, skeleton: React.ReactNode }) => {
    return (
        <div className="transition-opacity duration-500 ease-in-out h-full">
            {isLoading ? skeleton : children}
        </div>
    );
};


const EventSummaryWidget = ({ data, progress }: { data: EventSummary, progress: EventProgress | null }) => {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Resumo do Evento</h3>
                <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-3">
                <div>
                    <h4 className="text-xl font-bold text-gray-900">{data.event_name}</h4>
                    <p className="text-sm text-gray-600">
                        Dia {data.current_day} de {data.total_days} • {data.completion_percentage}% concluído
                    </p>
                </div>
                {progress && (
                    <div className="mt-2 pt-4">
                        <div className="flex justify-between space-x-1">
                            {Object.entries(progress.milestones).map(([day, milestone]) => (
                                <div key={day} className="text-center w-full">
                                    <div className={`w-full h-2 rounded-full ${milestone.status === 'completed' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                    <p className="text-xs mt-1 text-gray-500">Dia {day.split('_')[1]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{data.total_registered}</p>
                        <p className="text-xs text-gray-600">Inscritos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{data.average_daily_attendance}</p>
                        <p className="text-xs text-gray-600">Presença Média</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{data.total_points_awarded}</p>
                        <p className="text-xs text-gray-600">Pontos Totais</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TodayStatsWidget = ({ data, detailedData }: { data: TodaySummary, detailedData: TodayDetailedStats | null }) => {
    const classColors: { [key: string]: string } = { '0-6': 'bg-blue-400', '7-9': 'bg-green-400', '10-12': 'bg-yellow-400', '13-15': 'bg-red-400' };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Estatísticas de Hoje</h3>
                <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{data.attendance_rate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Taxa de Presença</p>
                    <p className="text-xs text-gray-500">{data.present_count} de {data.total_students} alunos</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{data.points_awarded_today}</p>
                    <p className="text-xs text-gray-600">Pontos Hoje</p>
                </div>
                {detailedData && <div className="mt-2">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Presença por Classe Hoje</h4>
                    <div className="space-y-2">
                        {Object.entries(detailedData.attendance.by_class).map(([classGroup, stats]) => (
                            <div key={classGroup}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-medium text-gray-700">{classGroup} anos</span>
                                    <span className="text-gray-500">{stats.present} / {stats.total}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div className={`${classColors[classGroup as keyof typeof classColors] || 'bg-gray-400'} h-1.5 rounded-full transition-all duration-500 ease-out`} style={{ width: `${stats.rate}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>}
            </div>
        </div>
    );
};

const TopPerformersWidget = ({ data }: { data: PerformanceRanking[] }) => {
    const topThree = data.slice(0, 3);
    const navigate = useNavigate();

    const handleStudentClick = (studentId: string) => {
        navigate(`/student/${studentId}`)
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Melhores Alunos</h3>
                <Trophy className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="space-y-3">
                {topThree.map((student, index) => (
                    <div key={student.student_id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                        }`}>
                            {index + 1}
                        </div>
                        <div className="flex-1 cursor-pointer" onClick={() => handleStudentClick(student.student_id)}>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">
                                {student.class} • {student.total_points} pontos
                            </p>
                        </div>
                    </div>
                ))}
                 {topThree.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Ainda não há dados de performance.</p>}
            </div>
        </div>
    );
};

const chartColors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#6366f1'];
const getColor = (index: number) => chartColors[index % chartColors.length];

const RegistrationWidget = ({ data, demographics }: { data: RegistrationStats, demographics: RegistrationDemographics | null }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Registros</h3>
                <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-4">
                <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{data.total_students}</p>
                    <p className="text-sm text-gray-600">Total de Alunos</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{data.by_gender.male}</p>
                        <p className="text-xs text-gray-600">Meninos</p>
                    </div>
                    <div className="text-center p-3 bg-pink-50 rounded-lg">
                        <p className="text-lg font-bold text-pink-600">{data.by_gender.female}</p>
                        <p className="text-xs text-gray-600">Meninas</p>
                    </div>
                </div>
                {demographics && (
                    <div className="mt-2 space-y-3 pt-2 border-t">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Distribuição por Classe</h4>
                            <div className="w-full bg-gray-200 rounded-full h-6 flex overflow-hidden">
                                {Object.entries(demographics.class_distribution).map(([classGroup, dist], index) => (
                                    <div key={classGroup} className="text-white text-center"  style={{ width: `${dist.percentage}%`, backgroundColor: getColor(index) }} title={`${classGroup}: ${dist.percentage.toFixed(1)}%`}>   {classGroup}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const EngagementWidget = ({ data }: { data: Engagement }) => {
    const getTrendIcon = () => {
        switch (data.trend) {
            case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
            case 'decreasing': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
            default: return <TrendingUp className="h-4 w-4 text-gray-600" />;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Engajamento</h3>
                <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-4">
                <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">{data.engagement_percent.toFixed(1)}%</p>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                        {getTrendIcon()}
                        <p className="text-sm text-gray-600">Engajamento</p>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-out" style={{width: `${data.engagement_percent}%`}}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                        <p className="text-lg font-bold text-gray-900">{data.daily_average}</p>
                        <p className="text-xs text-gray-600">Média Diária</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-900">{data.participation_rate.toFixed(1)}%</p>
                        <p className="text-xs text-gray-600">Participação</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PointsCategoryWidget = ({ data }: { data: PointsCategorySummary[] }) => {
    const categoryNames: { [key: string]: string } = {
        PRESENCE: 'Presença',
        BOOK: 'Bíblia',
        VERSICLE: 'Versículo',
        PARTICIPATION: 'Participação',
        GUEST: 'Convidado',
        GAME: 'Jogos'
    };

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pontos por Categoria</h3>
                <BarChart3 className="h-5 w-5 text-gray-600" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.map((category, index) => (
                    <div key={category.category} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className={`w-10 h-10 ${colors[index % colors.length]} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                            <Award className="h-5 w-5 text-white" />
                        </div>
                        <p className="font-medium text-gray-900 text-sm">{categoryNames[category.category] || category.category}</p>
                        <p className="text-lg font-bold text-gray-900">{category.total_points}</p>
                        <p className="text-xs text-gray-600">{category.percentage_of_total.toFixed(1)}%</p>
                    </div>
                ))}
                 {data.length === 0 && <p className="col-span-full text-sm text-gray-500 text-center py-4">Nenhuma categoria de pontos encontrada.</p>}
            </div>
        </div>
    );
};

const ClassPerformanceWidget = ({ data }: { data: ClassPerformance[] }) => {
    const classNames: { [key: string]: string } = {
        '0-6': 'Pequenos (0-6)',
        '7-9': 'Primários (7-9)',
        '10-12': 'Juniores (10-12)',
        '13-15': 'Juvenis (13-15)'
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance por Classe</h3>
                <PieChart className="h-5 w-5 text-gray-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.map((classData) => (
                    <div key={classData.class_id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <h4 className="font-medium text-gray-900 mb-3">{classNames[classData.class_id] || classData.class_id}</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Alunos:</span>
                                <span className="text-sm font-medium">{classData.student_count}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Presença:</span>
                                <span className="text-sm font-medium">{classData.average_attendance_rate.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pontos Médios:</span>
                                <span className="text-sm font-medium">{classData.average_points.toFixed(0)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out" style={{width: `${classData.engagement_score}%`}}></div>
                            </div>
                        </div>
                    </div>
                ))}
                 {data.length === 0 && <p className="md:col-span-2 text-sm text-gray-500 text-center py-4">Dados de performance por classe indisponíveis.</p>}
            </div>
        </div>
    );
};

const EventPredictionsWidget = ({ data }: { data: EventPredictions }) => {
    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Predições</h3>
                <Star className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{data.completion_forecast.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Previsão de Conclusão</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-lg font-bold text-gray-900">{data.projected_final_attendance}</p>
                        <p className="text-xs text-gray-600">Presença Final</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-lg font-bold text-gray-900">{data.remaining_days}</p>
                        <p className="text-xs text-gray-600">Dias Restantes</p>
                    </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">
                        Participantes em Risco: <span className="font-bold">{data.at_risk_participants.likely_to_drop}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export const DailyAttendanceWidget = ({ data }: { data: DailyAttendance[] }) => {
    const today = new Date().toISOString().split("T")[0];

    const getColor = (rate: number) => {
        if (rate >= 90) return "text-green-500";
        if (rate >= 70) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Presença Diária</h3>
                <Calendar className="h-5 w-5 text-gray-600" />
            </div>

            {data.length > 0 ? (
                <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {data.map(day => (
                        <div
                            key={day.day}
                            className={`flex-shrink-0 w-32 bg-gray-50 rounded-lg border transition-all duration-300 p-4 flex flex-col items-center
                                ${day.date === today ? "shadow-md border-blue-400" : "border-gray-200"}`}
                        >
                            {/* Circular progress */}
                            <div className="relative w-20 h-20 flex items-center justify-center">
                                <svg className="absolute inset-0" viewBox="0 0 36 36">
                                    <path
                                        className="text-gray-200"
                                        strokeWidth="3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                        className={getColor(day.attendance_rate)}
                                        strokeWidth="3.5"
                                        strokeDasharray={`${day.attendance_rate}, 100`}
                                        fill="none"
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                                <span className="text-sm font-semibold">
                                    {day.attendance_rate}%
                                </span>
                            </div>

                            <p className={`mt-2 text-sm font-medium ${day.date === today ? "text-blue-600 font-semibold" : "text-gray-700"}`}>
                                Dia {day.day}
                            </p>

                            <p className="text-xs text-gray-500 mb-1">
                                {day.attendance_count}/{day.total_students}
                            </p>

                            <div className="mt-1 text-xs text-gray-500 space-y-0.5 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    Meninos <User className="h-3 w-3 text-blue-500" /> {day.male_attendance}
                                </span>
                                <span className="flex items-center justify-center gap-1">
                                    Meninas <User className="h-3 w-3 text-pink-500" /> {day.female_attendance}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 text-center flex-1 flex items-center justify-center">
                    Ainda não há dados de presença.
                </p>
            )}
        </div>
    );
};


const DailyPointsTrendWidget = ({ data }: { data: DailyPointsTrend[] }) => {
    const MAX_BAR_HEIGHT = 170;
    const maxPoints = data.reduce((max, d) => Math.max(max, d.total_points), 0);
    const scale = maxPoints > 0 ? MAX_BAR_HEIGHT / maxPoints : 1;

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tendência Diária de Pontos</h3>
                <TrendingUp className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex items-end h-48 space-x-2 border-b border-l border-gray-200 p-2">
                {data.length === 0 && (
                    <p className="w-full text-sm text-gray-500 text-center self-center">Ainda não há dados de pontos.</p>
                )}
                {data.map(day => {
                    const barHeight = day.total_points * scale;

                    return (
                        <div key={day.day} className="w-full flex flex-col justify-end items-center group">
                            <div
                                className="bg-green-500 rounded-t transition-all duration-300 ease-out group-hover:bg-green-600"
                                style={{ height: `${barHeight}px`, minHeight: '4px', width: '16px' }} // minHeight to keep visibility
                                title={`${day.total_points} pontos`}
                            ></div>
                            <p className="text-xs text-gray-500 mt-1">Dia {day.day}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const PointsDistributionWidget = ({ data }: { data: PointsDistribution }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Distribuição de Pontos</h3>
                <PieChart className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex items-end h-40 space-x-2">
                {data.distribution.map(range => (
                    <div key={range.range} className="w-full text-center group">
                        <div className="bg-indigo-400 rounded-t transition-all duration-300 ease-out group-hover:bg-indigo-500" style={{ height: `${range.percentage}%` }} title={`${range.student_count} alunos`}></div>
                        <p className="text-xs text-gray-500 mt-1">{range.range}</p>
                    </div>
                ))}
                 {data.distribution.length === 0 && <p className="w-full text-sm text-gray-500 text-center self-center">Não há distribuição de pontos para mostrar.</p>}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div>
                    <p className="text-xl font-bold text-indigo-600">{data.average_points.toFixed(0)}</p>
                    <p className="text-xs text-gray-600">Média</p>
                </div>
                <div>
                    <p className="text-xl font-bold text-indigo-600">{data.median_points}</p>
                    <p className="text-xs text-gray-600">Mediana</p>
                </div>
                <div>
                    <p className="text-xl font-bold text-indigo-600">{data.top_score}</p>
                    <p className="text-xs text-gray-600">Máx.</p>
                </div>
            </div>
        </div>
    );
};

const GenderPerformanceWidget = ({ data }: { data: GenderPerformanceAnalysis }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance por Gênero</h3>
                <UserCheck className="h-5 w-5 text-pink-600" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-bold text-blue-600">{data.male.total_students} Meninos</h4>
                    <p className="text-2xl font-bold">{data.male.average_points.toFixed(0)}</p>
                    <p className="text-xs text-gray-600 mb-2">Pontos Médios</p>
                    <p className="text-lg font-bold">{data.male.engagement_score}%</p>
                    <p className="text-xs text-gray-600">Engajamento Média</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <h4 className="font-bold text-pink-600">{data.female.total_students} Meninas</h4>
                    <p className="text-2xl font-bold">{data.female.average_points.toFixed(0)}</p>
                    <p className="text-xs text-gray-600 mb-2">Pontos Médios</p>
                    <p className="text-lg font-bold">{data.female.engagement_score}%</p>
                    <p className="text-xs text-gray-600">Engajamento Média</p>
                </div>
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Diferença de Pontos: <span className="font-bold">{data.comparison.points_difference.toFixed(0)}</span></p>
            </div>
        </div>
    );
};

const defaultEventSummary: EventSummary = {
    event_name: 'N/A',
    current_day: 0,
    total_days: 0,
    completion_percentage: 0,
    total_registered: 0,
    average_daily_attendance: 0,
    total_points_awarded: 0,
    start_date: "",
    end_date: ""
};
const defaultTodaySummary: TodaySummary = {
    present_count: 0, total_students: 0, attendance_rate: 0, points_awarded_today: 0, daily_goal_completion: 0,
    day: 0,
    date: "",
    event_day_name: "",
    top_performers_today: [],
    activities_status:  {
        completed: 0,
        in_progress: 0,
        upcoming: 0
    }
};
const defaultRegistrationStats: { total_students: number; by_gender: { male: number; female: number } } = { total_students: 0, by_gender: { male: 0, female: 0 } };
const defaultEngagement: Engagement = {
    engagement_percent: 0, trend: 'stable', daily_average: 0, participation_rate: 0,
    event_day: "",
    days_elapsed: 0,
    max_possible_points: 0,
    awarded_points: 0,
    by_gender: {
        male:  {
            engagement: 0,
            participation: 0
        },
        female:  {
            engagement: 0,
            participation: 0
        }
    },
    benchmark: 0,
    performance: "above_benchmark"
};
const defaultEventPredictions: EventPredictions = {
    completion_forecast: 0, projected_final_attendance: 0, remaining_days: 0, at_risk_participants: {
        likely_to_drop: 0,
        low_attendance: 0,
        low_engagement: 0
    },
    projected_total_points: 0,
    success_indicators:  {
        on_track_for_goals: false,
        engagement_trending: "",
        attendance_stability: ""
    },
    final_day_projections:  {
        expected_attendance: 0,
        celebration_readiness: 0
    }
};
const defaultPointsDistribution: PointsDistribution = {
    distribution: [], average_points: 0, median_points: 0, top_score: 0,
    total_points_awarded: 0,
    days_elapsed: 0,
    by_gender: {
        male:  {
            average: 0,
            median: 0
        },
        female:  {
            average: 0,
            median: 0
        }
    }
};
const defaultGenderPerformance: GenderPerformanceAnalysis = { male: {
        average_points: 0, average_attendance_rate: 0,
        total_students: 0,
        engagement_score: 0,
        top_performer: {
            name: "",
            points: 0
        }
    }, female: {
        average_points: 0, average_attendance_rate: 0,
        total_students: 0,
        engagement_score: 0,
        top_performer: {
            name: "",
            points: 0
        }
    }, comparison: {
        points_difference: 0,
        attendance_difference: 0,
        engagement_difference: 0
    } };


const DashboardPage: React.FC = () => {
    const { api } = useAuth();
    const [forceRefresh, setForceRefresh] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { data: eventSummary, isLoading: isLoadingEventSummary } = useWidgetDataWithCache(
        'eventSummary',
        () => api.getEventSummary(),
        defaultEventSummary,
        forceRefresh
    );

    const { data: eventProgress, isLoading: isLoadingEventProgress } = useWidgetDataWithCache(
        'eventProgress',
        () => api.getEventProgress(),
        null,
        forceRefresh
    );

    const { data: dailyAttendance, isLoading: isLoadingDailyAttendance } = useWidgetDataWithCache(
        'dailyAttendance',
        () => api.fetchAttendanceDays(),
        [],
        forceRefresh
    );

    const { data: todayStats, isLoading: isLoadingTodayStats } = useWidgetDataWithCache(
        'todayStats',
        () => api.getTodaySummary(),
        defaultTodaySummary,
        forceRefresh
    );

    const { data: todayDetailedStats, isLoading: isLoadingTodayDetailedStats } = useWidgetDataWithCache(
        'todayDetailedStats',
        () => api.getTodayDetailedStats(),
        null,
        forceRefresh
    );

    const { data: topPerformers, isLoading: isLoadingTopPerformers } = useWidgetDataWithCache(
        'topPerformers',
        () => api.getTopPerformers(10),
        [],
        forceRefresh
    );

    const { data: registrationStats, isLoading: isLoadingRegistrationStats } = useWidgetDataWithCache(
        'registrationStats',
        () => api.getRegistrationStats(),
        defaultRegistrationStats,
        forceRefresh
    );

    const { data: registrationDemographics, isLoading: isLoadingRegistrationDemographics } = useWidgetDataWithCache(
        'registrationDemographics',
        () => api.getRegistrationDemographics(),
        null,
        forceRefresh
    );

    const { data: engagement, isLoading: isLoadingEngagement } = useWidgetDataWithCache(
        'engagement',
        () => api.getEngagement(),
        defaultEngagement,
        forceRefresh
    );

    const { data: pointsCategory, isLoading: isLoadingPointsCategory } = useWidgetDataWithCache(
        'pointsCategory',
        () => api.getPointsSummary(),
        [],
        forceRefresh
    );

    const { data: dailyPointsTrends, isLoading: isLoadingDailyPointsTrends } = useWidgetDataWithCache(
        'dailyPointsTrends',
        () => api.getDailyPointsTrends(),
        [],
        forceRefresh
    );

    const { data: pointsDistribution, isLoading: isLoadingPointsDistribution } = useWidgetDataWithCache(
        'pointsDistribution',
        () => api.getPointsDistribution(),
        defaultPointsDistribution,
        forceRefresh
    );

    const { data: classPerformance, isLoading: isLoadingClassPerformance } = useWidgetDataWithCache(
        'classPerformance',
        () => api.getClassPerformance(),
        [],
        forceRefresh
    );

    const { data: genderPerformance, isLoading: isLoadingGenderPerformance } = useWidgetDataWithCache(
        'genderPerformance',
        () => api.getGenderPerformanceAnalysis(),
        defaultGenderPerformance,
        forceRefresh
    );

    const { data: predictions, isLoading: isLoadingPredictions } = useWidgetDataWithCache(
        'predictions',
        () => api.getEventPredictions(),
        defaultEventPredictions,
        forceRefresh
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        dashboardCache.clear();
        setForceRefresh(prev => !prev);

        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    const isAnyLoading = isLoadingEventSummary || isLoadingEventProgress ||
        isLoadingDailyAttendance || isLoadingTodayStats || isLoadingTodayDetailedStats ||
        isLoadingTopPerformers || isLoadingRegistrationStats || isLoadingRegistrationDemographics ||
        isLoadingEngagement || isLoadingPointsCategory || isLoadingDailyPointsTrends ||
        isLoadingPointsDistribution || isLoadingClassPerformance || isLoadingGenderPerformance ||
        isLoadingPredictions;

    // @ts-ignore
    return (
        <MainLayout>
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing || isAnyLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg
                            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {refreshing ? 'Carregando...' : 'Carregar'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-2">
                        <WidgetWrapper isLoading={isLoadingEventSummary || isLoadingEventProgress} skeleton={<SkeletonCard />}>
                            {eventSummary && <EventSummaryWidget data={eventSummary} progress={eventProgress} />}
                        </WidgetWrapper>
                    </div>
                    <div className="lg:col-span-1">
                        <WidgetWrapper isLoading={isLoadingTodayStats || isLoadingTodayDetailedStats} skeleton={<SkeletonCard />}>
                            {todayStats && <TodayStatsWidget data={todayStats} detailedData={todayDetailedStats} />}
                        </WidgetWrapper>
                    </div>
                    <div className="lg:col-span-1">
                        <WidgetWrapper isLoading={isLoadingRegistrationStats || isLoadingRegistrationDemographics} skeleton={<SkeletonCard />}>
                            {registrationStats && <RegistrationWidget data={registrationStats as RegistrationStats} demographics={registrationDemographics} />}
                        </WidgetWrapper>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <WidgetWrapper isLoading={isLoadingTopPerformers} skeleton={<SkeletonCard />}>
                        {topPerformers && <TopPerformersWidget data={topPerformers} />}
                    </WidgetWrapper>
                    <WidgetWrapper isLoading={isLoadingEngagement} skeleton={<SkeletonCard />}>
                        {engagement && <EngagementWidget data={engagement} />}
                    </WidgetWrapper>
                    <WidgetWrapper isLoading={isLoadingPredictions} skeleton={<SkeletonCard />}>
                        {predictions && <EventPredictionsWidget data={predictions} />}
                    </WidgetWrapper>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <WidgetWrapper isLoading={isLoadingDailyAttendance} skeleton={<SkeletonChart />}>
                        {dailyAttendance && <DailyAttendanceWidget data={dailyAttendance} />}
                    </WidgetWrapper>
                    <WidgetWrapper isLoading={isLoadingDailyPointsTrends} skeleton={<SkeletonChart />}>
                        {dailyPointsTrends && <DailyPointsTrendWidget data={dailyPointsTrends} />}
                    </WidgetWrapper>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <WidgetWrapper isLoading={isLoadingPointsCategory} skeleton={<SkeletonChart />}>
                        {pointsCategory && <PointsCategoryWidget data={pointsCategory} />}
                    </WidgetWrapper>
                    <WidgetWrapper isLoading={isLoadingPointsDistribution} skeleton={<SkeletonChart />}>
                        {pointsDistribution && <PointsDistributionWidget data={pointsDistribution} />}
                    </WidgetWrapper>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <WidgetWrapper isLoading={isLoadingClassPerformance} skeleton={<SkeletonChart />}>
                            {classPerformance && <ClassPerformanceWidget data={classPerformance} />}
                        </WidgetWrapper>
                    </div>
                    <WidgetWrapper isLoading={isLoadingGenderPerformance} skeleton={<SkeletonCard />}>
                        {genderPerformance && <GenderPerformanceWidget data={genderPerformance} />}
                    </WidgetWrapper>
                </div>
            </div>
        </MainLayout>
    );
};
export default DashboardPage;
