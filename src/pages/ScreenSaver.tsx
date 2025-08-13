import { useState, useEffect } from 'react';
import { Calendar, Target, Trophy, PieChart, TrendingUp } from 'lucide-react';
import type {ClassPerformance, Engagement, EventProgress, EventSummary, PerformanceRanking} from "../model/types.ts";
import {useWidgetDataWithCache} from "../hooks/useWidgetDataCached.ts";
import {useAuth} from "../hooks/useAuth.tsx";

const EventSummaryWidget = ({ data, progress }: { data: EventSummary, progress: EventProgress | null }) => {
    return (
        <div className="glass-card rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white/90">Resumo do Evento</h3>
                <Calendar className="h-6 w-6 text-white/70" />
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

const EngagementWidget = ({ data }: { data: Engagement }) => {
    const getTrendIcon = () => {
        switch (data.trend) {
            case 'increasing': return <TrendingUp className="h-5 w-5 text-green-400" />;
            case 'decreasing': return <TrendingUp className="h-5 w-5 text-red-400 rotate-180" />;
            default: return <TrendingUp className="h-5 w-5 text-white/60" />;
        }
    };

    return (
        <div className="glass-card rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white/90">Engajamento</h3>
                <Target className="h-6 w-6 text-white/70" />
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

const TopPerformersWidget = ({ data }: { data: PerformanceRanking[] }) => {
    const topFive = data.slice(0, 5);

    return (
        <div className="glass-card rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-white/90">Melhores Alunos</h3>
                <Trophy className="h-6 w-6 text-white/70" />
            </div>
            <div className="space-y-4">
                {topFive.map((student, index) => (
                    <div key={student.student_id} className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
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

const ClassPerformanceWidget = ({ data }: { data: ClassPerformance[] }) => {
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
                <PieChart className="h-6 w-6 text-white/70" />
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
                                <span className="text-sm font-medium text-white">{classData.average_attendance_rate.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-white/70">Pontos Médios:</span>
                                <span className="text-sm font-medium text-white">{classData.average_points.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-white/70">Engajamento:</span>
                                <span className="text-sm font-medium text-white">{classData.engagement_score.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Screensaver = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    const { api } = useAuth();

    const [forceRefreshStates, setForceRefreshStates] = useState({
        eventSummary: false,
        eventProgress: false,
        topPerformers: false,
        engagement: false,
        classPerformance: false
    });

    const { data: eventSummary, isLoading: isLoadingEventSummary } = useWidgetDataWithCache(
        'eventSummary',
        () => api.getEventSummary(),
        {
            event_name: '',
            start_date: '',
            end_date: '',
            current_day: 0,
            total_days: 0,
            total_registered: 0,
            average_daily_attendance: 0,
            total_points_awarded: 0,
            completion_percentage: 0
        },
        forceRefreshStates.eventSummary
    );

    const { data: eventProgress, isLoading: isLoadingEventProgress } = useWidgetDataWithCache(
        'eventProgress',
        () => api.getEventProgress(),
        null,
        forceRefreshStates.eventProgress
    );

    const { data: topPerformers, isLoading: isLoadingTopPerformers } = useWidgetDataWithCache(
        'topPerformers',
        () => api.getTopPerformers(10),
        [],
        forceRefreshStates.topPerformers
    );

    const { data: engagement, isLoading: isLoadingEngagement } = useWidgetDataWithCache(
        'engagement',
        () => api.getEngagement(),
        {
            engagement_percent: 0,
            awarded_points: 0,
            participation_rate: 0,
            event_day: '',
            days_elapsed: 0,
            max_possible_points: 0,
            daily_average: 0,
            by_gender: {
                male: {engagement: 0, participation: 0},
                female: {engagement: 0, participation: 0}
            },
            benchmark: 0,
            performance: 'above_benchmark',
            trend: 'increasing'
        } as Engagement,
        forceRefreshStates.engagement
    );

    const { data: classPerformance, isLoading: isLoadingClassPerformance } = useWidgetDataWithCache(
        'classPerformance',
        () => api.getClassPerformance(),
        [],
        forceRefreshStates.classPerformance
    );

    const isAnyLoading = isLoadingEventSummary && isLoadingEventProgress &&
        isLoadingTopPerformers && isLoadingEngagement && isLoadingClassPerformance;

    const widgets = [
        {
            id: 'event-summary',
            key: 'eventSummary',
            component: <EventSummaryWidget data={eventSummary} progress={eventProgress} />
        },
        {
            id: 'engagement',
            key: 'engagement',
            component: <EngagementWidget data={engagement} />
        },
        {
            id: 'top-performers',
            key: 'topPerformers',
            component: <TopPerformersWidget data={topPerformers} />
        },
        {
            id: 'class-performance',
            key: 'classPerformance',
            component: <ClassPerformanceWidget data={classPerformance} />
        }
    ];

    const refreshNextWidgets = (currentIndex: number) => {
        const widgetKeys = widgets.map(w => w.key);
        const nextIndex2 = (currentIndex + 2) % widgets.length;

        const nextKey2 = widgetKeys[nextIndex2] as 'eventSummary' | 'eventProgress' | 'topPerformers' | 'engagement' | 'classPerformance' ;

        setForceRefreshStates(prev => ({
            ...prev,
            [nextKey2]: !prev[nextKey2] as boolean
        }));
    };

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timeInterval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                const newSlideIndex = (currentSlide + 1) % widgets.length;
                setCurrentSlide(newSlideIndex);
                refreshNextWidgets(newSlideIndex);
                setIsVisible(true);
            }, 150);
        }, 15 * 1000);

        return () => clearInterval(interval);
    }, [currentSlide, widgets.length]);

    const timeString = currentTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const dateString = currentTime.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                backgroundImage: "url('/wallpaper.webp')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="w-full max-w-5xl">
                <div className="text-center mb-5">
                    <div className="relative">
                        <h1 className="text-7xl font-extralight text-white mb-4 tracking-wider">
                            {timeString}
                        </h1>
                    </div>
                    <p className="text-2xl text-white/80 capitalize font-light tracking-wide">
                        {dateString}
                    </p>
                </div>

                {!isAnyLoading && (
                    <div className="relative min-h-[400px] flex items-center justify-center">
                        <div
                            className={`w-full transition-all duration-150 ease-in-out ${
                                isVisible
                                    ? 'opacity-100 transform translate-y-0 scale-100'
                                    : 'opacity-0 transform translate-y-4 scale-95'
                            }`}
                        >
                            <div className="flex justify-center">
                                <div className="w-full max-w-2xl">
                                    {widgets[currentSlide].component}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isAnyLoading && (isLoadingEventSummary || isLoadingEventProgress) && (
                    <div className="text-center text-white/70">
                        <div className="inline-flex items-center space-x-3">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                            <span className="text-xl font-light">Loading dashboard...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Screensaver;