import React, {useState} from "react";
import {MainLayout} from "../layout/main.tsx";
import {useAuth} from "../hooks/useAuth.tsx";
import type {RegistrationStats} from "../model/types";
import {dashboardCache, useWidgetDataWithCache} from "../hooks/useWidgetDataCached.ts";
import {
    ClassPerformanceWidget,
    DailyAttendanceWidget,
    DailyPointsTrendWidget,
    EngagementWidget,
    EventSummaryWidget,
    GenderPerformanceWidget,
    PointsCategoryWidget,
    PointsDistributionWidget,
    RegistrationWidget,
    SkeletonCard,
    SkeletonChart,
    TodayStatsWidget,
    TopPerformersWidget,
    WidgetWrapper
} from "../components/DashboardWidgets.tsx";
import {
    defaultEngagement,
    defaultEventSummary,
    defaultGenderPerformance,
    defaultPointsDistribution,
    defaultRegistrationStats,
    defaultTodaySummary
} from "../util/StatsDefaults.tsx";


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
        isLoadingPointsDistribution || isLoadingClassPerformance || isLoadingGenderPerformance;

    return (
        <MainLayout>
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing || isAnyLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <WidgetWrapper isLoading={isLoadingTopPerformers} skeleton={<SkeletonCard />}>
                        {topPerformers && <TopPerformersWidget data={topPerformers} />}
                    </WidgetWrapper>
                    <WidgetWrapper isLoading={isLoadingEngagement} skeleton={<SkeletonCard />}>
                        {engagement && <EngagementWidget data={engagement} />}
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