import type {
    ClassPerformance,
    DailyAttendance,
    DailyPointsTrend,
    Engagement,
    EventProgress,
    EventSummary,
    GenderPerformanceAnalysis,
    PerformanceRanking,
    PointsCategorySummary,
    PointsDistribution,
    RegistrationDemographics,
    RegistrationStats,
    TodayDetailedStats,
    TodaySummary
} from "../model/types.ts";
import { Calendar, Users, Trophy, TrendingUp, Award, Target, Activity, BarChart3, PieChart, UserCheck, User } from "lucide-react";
import {useNavigate} from "react-router-dom";


export const SkeletonCard = ({className = ""}) => (
    <div className={`bg-white rounded-xl border border-blue-200 p-6 h-full ${className}`}>
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
    </div>
);
export const SkeletonChart = ({className = ""}) => (
    <div className={`bg-white rounded-xl border border-blue-200 p-6 h-full ${className}`}>
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="flex items-end space-x-2 h-32">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className={`bg-gray-200 rounded-t w-full`}
                         style={{height: `${Math.random() * 100 + 20}%`}}></div>
                ))}
            </div>
        </div>
    </div>
);
export const WidgetWrapper = ({children, isLoading, skeleton}: {
    children: React.ReactNode,
    isLoading: boolean,
    skeleton: React.ReactNode
}) => {
    return (
        <div className="transition-opacity duration-500 ease-in-out h-full">
            {isLoading ? skeleton : children}
        </div>
    );
};
export const EventSummaryWidget = ({data, progress}: { data: EventSummary, progress: EventProgress | null }) => {
    return (
        <div className="bg-white rounded-xl border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Resumo do Evento</h3>
                <Calendar className="h-5 w-5 text-blue-600"/>
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
                                    <div
                                        className={`w-full h-2 rounded-full ${milestone.status === 'completed' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                    <p className="text-xs mt-1 text-gray-500">Dia {day.split('_')[1]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{data.total_registered}</p>
                        <p className="text-xs text-gray-600">Inscritos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold ">{data.average_daily_attendance.toFixed(1)}</p>
                        <p className="text-xs text-gray-600">Presença Média</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold ">{data.total_points_awarded}</p>
                        <p className="text-xs text-gray-600">Pontos Totais</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export const TodayStatsWidget = ({data, detailedData}: {
    data: TodaySummary,
    detailedData: TodayDetailedStats | null
}) => {
    return (
        <div className="bg-white rounded-xl border border-blue-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Estatísticas de Hoje</h3>
                <Activity className="h-5 w-5 text-green-600"/>
            </div>
            <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-gray-200">
                    <p className="text-3xl font-bold">{data.attendance_rate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Taxa de Presença</p>
                    <p className="text-xs text-gray-500">{data.present_count} de {data.total_students} alunos</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
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
                                    <div
                                        className={`bg-gray-700 h-1.5 rounded-full transition-all duration-500 ease-out`}
                                        style={{width: `${stats.rate}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>}
            </div>
        </div>
    );
};
export const TopPerformersWidget = ({data}: { data: PerformanceRanking[] }) => {
    const topThree = data.slice(0, 5);
    const navigate = useNavigate();

    const handleStudentClick = (studentId: string) => {
        navigate(`/student/${studentId}`)
    }

    return (
        <div className="bg-white rounded-xl border border-blue-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Melhores Alunos</h3>
                <Trophy className="h-5 w-5 text-yellow-600"/>
            </div>
            <div className="space-y-3">
                {topThree.map((student, index) => (
                    <div key={student.student_id}
                         className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
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
                {topThree.length === 0 &&
                    <p className="text-sm text-gray-500 text-center py-4">Ainda não há dados de performance.</p>}
            </div>
        </div>
    );
};

const chartColors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#6366f1'];
const getColor = (index: number) => chartColors[index % chartColors.length];

export const RegistrationWidget = ({data, demographics}: {
    data: RegistrationStats,
    demographics: RegistrationDemographics | null
}) => {
    return (
        <div className="bg-white rounded-xl border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Registros</h3>
                <Users className="h-5 w-5 text-blue-600"/>
            </div>
            <div className="space-y-4">
                <div className="text-center">
                    <p className="text-3xl font-bold ">{data.total_students}</p>
                    <p className="text-sm text-gray-600">Total de Alunos</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-gray-200">
                        <p className="text-lg font-bold text-blue-600">{data.by_gender.male}</p>
                        <p className="text-xs text-gray-600">Meninos</p>
                    </div>
                    <div className="text-center p-3 bg-pink-50 rounded-lg border border-gray-200">
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
                                    <div key={classGroup} className="text-white text-center"
                                         style={{width: `${dist.percentage}%`, backgroundColor: getColor(index)}}
                                         title={`${classGroup}: ${dist.percentage.toFixed(1)}%`}>   {classGroup}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export const EngagementWidget = ({data}: { data: Engagement }) => {
    const getTrendIcon = () => {
        switch (data.trend) {
            case 'increasing':
                return <TrendingUp className="h-4 w-4 text-green-600"/>;
            case 'decreasing':
                return <TrendingUp className="h-4 w-4 text-red-600 rotate-180"/>;
            default:
                return <TrendingUp className="h-4 w-4 text-gray-600"/>;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Engajamento</h3>
                <Target className="h-5 w-5 text-purple-600"/>
            </div>
            <div className="space-y-4">
                <div className="text-center">
                    <p className="text-3xl font-bold">{data.engagement_percent.toFixed(1)}%</p>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                        {getTrendIcon()}
                        <p className="text-sm text-gray-600">Engajamento</p>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-700 h-2 rounded-full transition-all duration-500 ease-out"
                         style={{width: `${data.engagement_percent}%`}}></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                        <p className="text-lg font-bold text-gray-900">{data.awarded_points}</p>
                        <p className="text-xs text-gray-600">Pontos Atribuidos</p>
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
export const PointsCategoryWidget = ({data}: { data: PointsCategorySummary[] }) => {
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
        <div className="bg-white rounded-xl border border-blue-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pontos por Categoria</h3>
                <BarChart3 className="h-5 w-5 text-gray-600"/>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.map((category, index) => (
                    <div key={category.category}
                         className="text-center p-4 bg-gray-50 border border-gray-200 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                        <div
                            className={`w-10 h-10 ${colors[index % colors.length]} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                            <Award className="h-5 w-5 text-white"/>
                        </div>
                        <p className="font-medium text-gray-900 text-sm">{categoryNames[category.category] || category.category}</p>
                        <p className="text-lg font-bold text-gray-900">{category.total_points}</p>
                        <p className="text-xs text-gray-600">{category.percentage_of_total.toFixed(1)}%</p>
                    </div>
                ))}
                {data.length === 0 &&
                    <p className="col-span-full text-sm text-gray-500 text-center py-4">Nenhuma categoria de pontos
                        encontrada.</p>}
            </div>
        </div>
    );
};
export const ClassPerformanceWidget = ({data}: { data: ClassPerformance[] }) => {
    const classNames: { [key: string]: string } = {
        '0-6': 'Pequenos (0-6)',
        '7-9': 'Primários (7-9)',
        '10-12': 'Juniores (10-12)',
        '13-15': 'Adolescentes (13-15)'
    };

    return (
        <div className="bg-white rounded-xl border border-blue-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance por Classe</h3>
                <PieChart className="h-5 w-5 text-gray-600"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.map((classData) => (
                    <div key={classData.class_id}
                         className="p-4 bg-gray-50 rounded-lg hover:bg-gray-200 border border-gray-200 transition-colors duration-200">
                        <h4 className="font-medium text-gray-900 mb-3">{classNames[classData.class_id] || classData.class_id}</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Alunos:</span>
                                <span className="text-sm font-medium">{classData.student_count}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Presença:</span>
                                <span
                                    className="text-sm font-medium">{classData.average_attendance_rate.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pontos Médios:</span>
                                <span className="text-sm font-medium">{classData.average_points.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm mr-1 text-gray-600">Engajamento:</span>
                                <span className="text-sm font-medium">{classData.engagement_score.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                ))}
                {data.length === 0 &&
                    <p className="md:col-span-2 text-sm text-gray-500 text-center py-4">Dados de performance por classe
                        indisponíveis.</p>}
            </div>
        </div>
    );
};
export const DailyAttendanceWidget = ({data}: { data: DailyAttendance[] }) => {
    const today = new Date().toISOString().split("T")[0];

    const getColor = (rate: number) => {
        if (rate >= 90) return "text-green-500";
        if (rate >= 70) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="bg-white rounded-xl border border-blue-200 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Presença Diária</h3>
                <Calendar className="h-5 w-5 text-gray-600"/>
            </div>

            {data.length > 0 ? (
                <div
                    className="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {data.map(day => (
                        <div
                            key={day.day}
                            className={`flex-shrink-0 w-32 bg-gray-50 rounded-lg border transition-all duration-300 p-4 flex flex-col items-center
                                ${day.date === today ? "shadow-md border-blue-400" : "border-gray-200"}`}
                        >
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

                            <p className={`mt-2 text-sm font-medium ${day.date === today ? "text-black-600 font-semibold" : "text-gray-700"}`}>
                                Dia {day.day}
                            </p>

                            <p className="text-xs text-gray-500 mb-1">
                                {day.attendance_count}/{day.total_students}
                            </p>

                            <div className="mt-1 text-xs text-gray-500 space-y-0.5 text-center">
                                <span className="flex items-center justify-center gap-1">
                                    Meninos <User className="h-3 w-3 text-blue-500"/> {day.male_attendance}
                                </span>
                                <span className="flex items-center justify-center gap-1">
                                    Meninas <User className="h-3 w-3 text-pink-500"/> {day.female_attendance}
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
export const DailyPointsTrendWidget = ({data}: { data: DailyPointsTrend[] }) => {
    const MAX_BAR_HEIGHT = 170;
    const maxPoints = data.reduce((max, d) => Math.max(max, d.total_points), 0);
    const scale = maxPoints > 0 ? MAX_BAR_HEIGHT / maxPoints : 1;

    return (
        <div className="bg-white rounded-xl border border-blue-200 p-6 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tendência Diária de Pontos</h3>
                <TrendingUp className="h-5 w-5 text-gray-600"/>
            </div>
            <div className="flex items-end h-48 space-x-2 border-b border-l border-gray-200 p-2">
                {data.length === 0 && (
                    <p className="w-full text-sm text-gray-500 text-center self-center">Ainda não há dados de
                        pontos.</p>
                )}
                {data.map(day => {
                    const barHeight = day.total_points * scale;

                    return (
                        <div key={day.day} className="w-full flex flex-col justify-end items-center group">
                            <div
                                className="bg-gray-800 rounded-t-xl transition-all duration-300 ease-out group-hover:bg-gray-900"
                                style={{
                                    height: `${barHeight}px`,
                                    minHeight: '4px',
                                    width: '50%'
                                }} // minHeight to keep visibility
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
export const PointsDistributionWidget = ({data}: { data: PointsDistribution }) => {
    return (
        <div className="bg-white rounded-xl border border-blue-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Distribuição de Pontos</h3>
                <PieChart className="h-5 w-5 text-gray-600"/>
            </div>
            <div className="flex items-end mt-15 h-40 space-x-2">
                {data.distribution.length > 0 ? (
                    data.distribution.map(range => (
                        <div key={range.range} className="flex-1 text-center group">
                            <div
                                className="bg-gray-600 rounded-t transition-all duration-300 ease-out group-hover:bg-gray-800 mx-auto text-white align-center items-center justify-center flex"
                                style={{
                                    height: `${range.percentage / 100 * 200 + 6}px`,
                                    width: "80%"
                                }}
                                title={`${range.student_count} alunos`}
                            > {range.percentage == 0 ? '' : range.percentage}{range.percentage == 0 ? '' : '%'} </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">{range.range}</p>
                        </div>
                    ))
                ) : (
                    <p className="w-full text-sm text-gray-500 text-center self-center">
                        Não há distribuição de pontos para mostrar.
                    </p>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                <div>
                    <p className="text-xl font-bold text-indigo-600">{data.average_points.toFixed(0)}</p>
                    <p className="text-xs text-gray-600">Média</p>
                </div>
                <div>
                    <p className="text-xl font-bold text-indigo-600">{data.median_points}</p>
                    <p className="text-xs text-gray-600">Mediana</p>
                </div>
            </div>
        </div>
    );
};
export const GenderPerformanceWidget = ({data}: { data: GenderPerformanceAnalysis }) => {
    return (
        <div className="bg-white rounded-xl border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance por Gênero</h3>
                <UserCheck className="h-5 w-5 text-pink-600"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-blue-600">{data.male.total_students} Meninos</h4>
                    <p className="text-2xl font-bold">{data.male.average_points.toFixed(0)}</p>
                    <p className="text-xs text-gray-600 mb-2">Pontos Médios</p>
                    <p className="text-lg font-bold">{data.male.engagement_score}%</p>
                    <p className="text-xs text-gray-600">Média de Engajamento</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-pink-600">{data.female.total_students} Meninas</h4>
                    <p className="text-2xl font-bold">{data.female.average_points.toFixed(0)}</p>
                    <p className="text-xs text-gray-600 mb-2">Pontos Médios</p>
                    <p className="text-lg font-bold">{data.female.engagement_score}%</p>
                    <p className="text-xs text-gray-600">Média de Engajamento</p>
                </div>
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Diferença de Pontos: <span
                    className="font-bold">{data.comparison.points_difference.toFixed(0)}</span></p>
            </div>
        </div>
    );
};