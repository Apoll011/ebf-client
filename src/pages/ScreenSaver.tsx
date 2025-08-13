import {useEffect, useState} from 'react';
import {useWidgetDataWithCache} from "../hooks/useWidgetDataCached.ts";
import {useAuth} from "../hooks/useAuth.tsx";
import {ProtectedRoute} from "../components/ProtectedRoute.tsx";
import {defaultEngagement, defaultEventSummary} from "../util/StatsDefaults.tsx";
import {
    ClassPerformanceWidget,
    EngagementWidget,
    EventSummaryWidget,
    TopPerformersWidget
} from "../components/ScreensaverWidgets.tsx";
import {useNavigate} from "react-router-dom";

const Screensaver = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    const navigate = useNavigate();

    const { api, logout, user } = useAuth();

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
        defaultEventSummary,
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
        defaultEngagement,
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
        <ProtectedRoute ignoreViewer={true}>
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
                                <span className="text-xl font-light">Carregando...</span>
                            </div>
                        </div>
                    )}
                    <div className="text-center fixed right-3 bottom-2 text-white/70">
                        {user?.role !== 'viewer' && (
                            <button onClick={() => navigate('/')} className="font-light hover:font-bold cursor-pointer mr-4">Dashboard</button>
                        )}
                        <button onClick={() => logout()} className="font-light hover:font-bold cursor-pointer">Logout</button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Screensaver;