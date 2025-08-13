import type {ClassPerformance, Engagement, EventProgress, EventSummary, PerformanceRanking} from "../model/types.ts";
import { Calendar, Target, Trophy, PieChart, TrendingUp } from 'lucide-react';

export const EventSummaryWidget = ({data, progress}: { data: EventSummary, progress: EventProgress | null }) => {
    return (
        <div className="glass-card rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white/90">Resumo do Evento</h3>
                <Calendar className="h-6 w-6 text-white/70"/>
            </div>
            <div className="space-y-6">
                <div>
                    <h4 className="text-2xl font-semibold text-white mb-2">{data.event_name}</h4>
                    <p className="text-white/70">
                        Dia {data.current_day} de {data.total_days} • {data.completion_percentage}% concluído
                    </p>
                </div>
                {progress && (
                    <div className="pt-4">
                        <div className="flex justify-between space-x-2">
                            {Object.entries(progress.milestones).map(([day, milestone]) => (
                                <div key={day} className="text-center flex-1">
                                    <div className={`h-2 rounded-full ${
                                        milestone.status === 'completed'
                                            ? 'bg-white/80'
                                            : 'bg-white/20'
                                    }`}></div>
                                    <p className="text-xs mt-2 text-white/60">Dia {day.split('_')[1]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-3 gap-6 pt-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-white">{data.total_registered}</p>
                        <p className="text-sm text-white/70 mt-1">Inscritos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-white">{data.average_daily_attendance.toFixed(1)}</p>
                        <p className="text-sm text-white/70 mt-1">Presença Média</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-white">{data.total_points_awarded}</p>
                        <p className="text-sm text-white/70 mt-1">Pontos Totais</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export const EngagementWidget = ({data}: { data: Engagement }) => {
    const getTrendIcon = () => {
        switch (data.trend) {
            case 'increasing':
                return <TrendingUp className="h-5 w-5 text-green-400"/>;
            case 'decreasing':
                return <TrendingUp className="h-5 w-5 text-red-400 rotate-180"/>;
            default:
                return <TrendingUp className="h-5 w-5 text-white/60"/>;
        }
    };

    return (
        <div className="glass-card rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white/90">Engajamento</h3>
                <Target className="h-6 w-6 text-white/70"/>
            </div>
            <div className="space-y-6">
                <div className="text-center">
                    <p className="text-4xl font-bold text-white mb-2">{data.engagement_percent.toFixed(1)}%</p>
                    <div className="flex items-center justify-center space-x-2">
                        {getTrendIcon()}
                        <p className="text-white/70">Engajamento</p>
                    </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                    <div
                        className="bg-white/80 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{width: `${data.engagement_percent}%`}}
                    ></div>
                </div>
                <div className="grid grid-cols-2 gap-6 text-center pt-4">
                    <div>
                        <p className="text-2xl font-bold text-white">{data.awarded_points}</p>
                        <p className="text-sm text-white/70 mt-1">Pontos Atribuidos</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{data.participation_rate.toFixed(1)}%</p>
                        <p className="text-sm text-white/70 mt-1">Participação</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export const TopPerformersWidget = ({data}: { data: PerformanceRanking[] }) => {
    const topFive = data.slice(0, 5);

    return (
        <div className="glass-card rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white/90">Melhores Alunos</h3>
                <Trophy className="h-6 w-6 text-white/70"/>
            </div>
            <div className="space-y-4">
                {topFive.map((student, index) => (
                    <div key={student.student_id}
                         className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500/80 text-yellow-900' :
                                index === 1 ? 'bg-gray-400/80 text-gray-900' :
                                    'bg-orange-400/80 text-orange-900'
                        }`}>
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-white">{student.name}</p>
                            <p className="text-sm text-white/70">
                                {student.class} • {student.total_points} pontos
                            </p>
                        </div>
                    </div>
                ))}
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
        <div className="glass-card rounded-2xl p-4 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white/90">Performance por Classe</h3>
                <PieChart className="h-6 w-6 text-white/70"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {data.map((classData) => (
                    <div key={classData.class_id} className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                        <h4 className="font-medium text-white mb-4">{classNames[classData.class_id] || classData.class_id}</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-white/70">Alunos:</span>
                                <span className="text-sm font-medium text-white">{classData.student_count}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-white/70">Presença:</span>
                                <span
                                    className="text-sm font-medium text-white">{classData.average_attendance_rate.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-white/70">Pontos Médios:</span>
                                <span
                                    className="text-sm font-medium text-white">{classData.average_points.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-white/70">Engajamento:</span>
                                <span
                                    className="text-sm font-medium text-white">{classData.engagement_score.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};