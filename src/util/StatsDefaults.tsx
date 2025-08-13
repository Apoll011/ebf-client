import type {
    Engagement,
    EventSummary,
    GenderPerformanceAnalysis,
    PointsDistribution,
    TodaySummary
} from "../model/types.ts";

export const defaultEventSummary: EventSummary = {
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
export const defaultTodaySummary: TodaySummary = {
    present_count: 0, total_students: 0, attendance_rate: 0, points_awarded_today: 0, daily_goal_completion: 0,
    day: 0,
    date: "",
    event_day_name: "",
    top_performers_today: [],
    activities_status: {
        completed: 0,
        in_progress: 0,
        upcoming: 0
    }
};
export const defaultRegistrationStats: {
    total_students: number;
    by_gender: { male: number; female: number }
} = {total_students: 0, by_gender: {male: 0, female: 0}};
export const defaultEngagement: Engagement = {
    engagement_percent: 0, trend: 'stable', daily_average: 0, participation_rate: 0,
    event_day: "",
    days_elapsed: 0,
    max_possible_points: 0,
    awarded_points: 0,
    by_gender: {
        male: {
            engagement: 0,
            participation: 0
        },
        female: {
            engagement: 0,
            participation: 0
        }
    },
    benchmark: 0,
    performance: "above_benchmark"
};
export const defaultPointsDistribution: PointsDistribution = {
    distribution: [], average_points: 0, median_points: 0, top_score: 0,
    total_points_awarded: 0,
    days_elapsed: 0,
    by_gender: {
        male: {
            average: 0,
            median: 0
        },
        female: {
            average: 0,
            median: 0
        }
    }
};
export const defaultGenderPerformance: GenderPerformanceAnalysis = {
    male: {
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
    }
};