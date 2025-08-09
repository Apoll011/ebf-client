// types.ts

export type Gender = 'male' | 'female';
export type AgeGroup = '0-6' | '7-9' | '10-12' | '13-15' | 'custom';
export type SortBy = 'name' | 'age' | 'total_points' | 'created_at';
export type Order = 'asc' | 'desc';
export type PointCategory = 'PRESENCE' | 'BOOK' | 'VERSICLE' | 'PARTICIPATION' | 'GUEST' | 'GAME';
export type MilestoneStatus = 'completed' | 'upcoming';
export type Trend = 'increasing' | 'decreasing' | 'stable';
export type Performance = 'above_benchmark' | 'at_benchmark' | 'below_benchmark';

// Base Student Interface
export interface Student {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    group: AgeGroup;
    address?: string;
    parent_name: string;
    parent_phone: string;
    notes?: string;
    total_points: number;
    points: DailyPoints[];
    created_at: string;
    last_updated?: string;
}

// Student Registration Request
export interface CreateStudentRequest {
    name: string;
    age: number;
    gender: Gender;
    address?: string;
    parent_name: string;
    parent_phone: string;
    notes?: string;
}

// Update Student Request
export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {}

// Daily Points
export interface DailyPoints {
    date: string;
    PRESENCE?: number;
    BOOK?: number;
    VERSICLE?: number;
    PARTICIPATION?: number;
    GUEST?: number;
    GAME?: number;
}

// Points Award Request
export interface AwardPointsRequest {
    date: string;
    points: {
        PRESENCE?: boolean;
        BOOK?: boolean;
        VERSICLE?: boolean;
        PARTICIPATION?: boolean;
        GUEST?: boolean;
        GAME?: boolean;
    };
}

// Manual Point Adjustment
export interface PointAdjustmentRequest {
    amount: number;
    reason: string;
    date: string;
}

// Student List Item (simplified for lists)
export interface StudentListItem {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    group: AgeGroup;
    total_points: number;
}

// Query Parameters for Students List
export interface StudentsListQuery {
    age_group?: AgeGroup;
    gender?: Gender;
    min_age?: number;
    max_age?: number;
    sort_by?: SortBy;
    order?: Order;
}

// Class/Group Information
export interface ClassGroup {
    id: AgeGroup;
    name: string;
    description: string;
    min_age: number;
    max_age: number;
    student_count: number;
}

// Teacher Information
export interface Teacher {
    id: string;
    name: string;
    phone: string;
    email: string;
    specialization: string;
    years_experience: number;
}

// Event Summary Statistics
export interface EventSummary {
    event_name: string;
    start_date: string;
    end_date: string;
    current_day: number;
    total_days: number;
    total_registered: number;
    average_daily_attendance: number;
    total_points_awarded: number;
    completion_percentage: number;
}

// Event Progress
export interface Milestone {
    status: MilestoneStatus;
    attendance?: number;
    points?: number;
    projected_attendance?: number;
}

export interface EventProgress {
    days_completed: number;
    days_remaining: number;
    overall_progress: number;
    milestones: {
        day_1: Milestone;
        day_2: Milestone;
        day_3: Milestone;
        day_4: Milestone;
        day_5: Milestone;
        day_6: Milestone;
        day_7: Milestone;
    };
}

// Daily Attendance
export interface DailyAttendance {
    day: number;
    date: string;
    attendance_count: number;
    total_students: number;
    attendance_rate: number;
    male_attendance: number;
    female_attendance: number;
    late_arrivals: number;
}

// Gender Statistics
export interface GenderStats {
    present: number;
    total: number;
    rate: number;
}

export interface GenderCounts {
    male: number;
    female: number;
}

export interface GenderBreakdown {
    male: GenderStats;
    female: GenderStats;
}

// Class Statistics
export interface ClassStats {
    present: number;
    total: number;
    rate: number;
}

export interface ClassBreakdown {
    '0-6': ClassStats;
    '7-9': ClassStats;
    '10-12': ClassStats;
    '13-15': ClassStats;
}

// Today's Detailed Statistics
export interface TodayDetailedStats {
    day: number;
    date: string;
    event_progress: number;
    attendance: {
        present_count: number;
        total_students: number;
        attendance_rate: number;
        by_gender: GenderBreakdown;
        by_class: ClassBreakdown;
    };
    points_awarded_today: number;
    activities_completed: number;
    upcoming_activities: number;
}

// Registration Statistics
export interface RegistrationStats {
    total_students: number;
    active_participants: number;
    inactive_participants: number;
    by_gender: GenderCounts;
    by_class: {
        '0-6': number;
        '7-9': number;
        '10-12': number;
        '13-15': number;
    };
    registration_completion_rate: number;
}

// Demographics
export interface AgeDistribution {
    age: number;
    count: number;
    percentage: number;
}

export interface GenderDistribution {
    count: number;
    percentage: number;
}

export interface ClassDistribution {
    count: number;
    percentage: number;
}

export interface RegistrationDemographics {
    age_distribution: AgeDistribution[];
    gender_distribution: {
        male: GenderDistribution;
        female: GenderDistribution;
    };
    class_distribution: {
        '0-6': ClassDistribution;
        '7-9': ClassDistribution;
        '10-12': ClassDistribution;
        '13-15': ClassDistribution;
    };
}

// Top Performer
export interface TopPerformer {
    student_id: string;
    name: string;
    gender: Gender;
    class: AgeGroup;
    points_today: number;
}

// Activity Status
export interface ActivityStatus {
    completed: number;
    in_progress: number;
    upcoming: number;
}

// Today's Summary
export interface TodaySummary {
    day: number;
    date: string;
    event_day_name: string;
    present_count: number;
    total_students: number;
    attendance_rate: number;
    points_awarded_today: number;
    daily_goal_completion: number;
    top_performers_today: TopPerformer[];
    activities_status: ActivityStatus;
}

// Present Student
export interface PresentStudent {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    class: AgeGroup;
    points_today: number;
    arrival_time: string;
}

// Today's Students
export interface TodayStudents {
    present_count: number;
    present_students: PresentStudent[];
    absent_count: number;
    absence_rate: number;
    late_arrivals: number;
}

// Engagement Statistics
export interface EngagementByGender {
    engagement: number;
    participation: number;
}

export interface Engagement {
    event_day: string;
    days_elapsed: number;
    max_possible_points: number;
    awarded_points: number;
    engagement_percent: number;
    daily_average: number;
    participation_rate: number;
    trend: Trend;
    by_gender: {
        male: EngagementByGender;
        female: EngagementByGender;
    };
    benchmark: number;
    performance: Performance;
}

// Performance Ranking
export interface PerformanceRanking {
    rank: number;
    student_id: string;
    name: string;
    age: number;
    gender: Gender;
    class: AgeGroup;
    total_points: number;
    days_attended: number;
    attendance_rate: number;
    avg_daily_points: number;
}

// Class Performance
export interface ClassGenderBreakdown {
    count: number;
    avg_points: number;
}

export interface ClassPerformance {
    class_id: AgeGroup;
    class_name: string;
    student_count: number;
    average_attendance_rate: number;
    average_points: number;
    engagement_score: number;
    daily_participation: number;
    gender_breakdown: {
        male: ClassGenderBreakdown;
        female: ClassGenderBreakdown;
    };
}

// Points Summary by Category
export interface PointsCategorySummary {
    category: PointCategory;
    total_points: number;
    times_awarded: number;
    percentage_of_total: number;
    daily_average: number;
}

// Daily Points Breakdown
export interface DailyPointsBreakdown {
    PRESENCE: number;
    BOOK: number;
    VERSICLE: number;
    PARTICIPATION: number;
    GUEST: number;
    GAME: number;
}

export interface DailyPointsByGender {
    male: number;
    female: number;
}

// Daily Points Trends
export interface DailyPointsTrend {
    day: number;
    date: string;
    total_points: number;
    unique_students: number;
    average_per_student: number;
    breakdown: DailyPointsBreakdown;
    by_gender: DailyPointsByGender;
}

// Points Distribution Range
export interface PointsDistributionRange {
    range: string;
    student_count: number;
    percentage: number;
}

export interface PointsDistributionByGender {
    average: number;
    median: number;
}

// Points Distribution
export interface PointsDistribution {
    total_points_awarded: number;
    days_elapsed: number;
    distribution: PointsDistributionRange[];
    median_points: number;
    average_points: number;
    top_score: number;
    by_gender: {
        male: PointsDistributionByGender;
        female: PointsDistributionByGender;
    };
}

// Gender Performance Analysis
export interface GenderPerformanceStats {
    total_students: number;
    average_attendance_rate: number;
    average_points: number;
    engagement_score: number;
    top_performer: {
        name: string;
        points: number;
    };
}

export interface GenderComparison {
    attendance_difference: number;
    points_difference: number;
    engagement_difference: number;
}

export interface GenderPerformanceAnalysis {
    male: GenderPerformanceStats;
    female: GenderPerformanceStats;
    comparison: GenderComparison;
}

// Event Predictions
export interface AtRiskParticipants {
    low_attendance: number;
    low_engagement: number;
    likely_to_drop: number;
}

export interface SuccessIndicators {
    on_track_for_goals: boolean;
    engagement_trending: string;
    attendance_stability: string;
}

export interface FinalDayProjections {
    expected_attendance: number;
    celebration_readiness: number;
}

export interface EventPredictions {
    remaining_days: number;
    projected_final_attendance: number;
    projected_total_points: number;
    completion_forecast: number;
    at_risk_participants: AtRiskParticipants;
    success_indicators: SuccessIndicators;
    final_day_projections: FinalDayProjections;
}

// Point System Configuration
export interface PointValue {
    value: number;
    description: string;
    category: string;
}

export interface PointSystem {
    PRESENCE: PointValue;
    BOOK: PointValue;
    VERSICLE: PointValue;
    PARTICIPATION: PointValue;
    GUEST: PointValue;
    GAME: PointValue;
}

// System Configuration
export interface SystemConfig {
    age_groups: {
        '0-6': string;
        '7-9': string;
        '10-12': string;
        '13-15': string;
    };
    attendance_threshold: number;
    engagement_benchmark: number;
    max_daily_points: number;
    system_version: string;
}

// Authentication interfaces
export interface LoginRequest {
    username: string;
    password: string;
    scope?: string;
    client_id?: string;
    client_secret?: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in?: number;
    refresh_token?: string;
    scope?: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface RefreshTokenResponse {
    access_token: string;
    token_type: string;
    expires_in?: number;
    refresh_token?: string;
}

export interface User {
    id?: string;
    username: string;
    role?: string;
}

export type UserRole = 'admin' | 'teacher' | 'viewer';

export interface AuthUser {
    username: string,
    password: string,
    role: UserRole
}

// API Error Response
export interface ApiError {
    error: {
        code: string;
        message: string;
        details?: {
            field?: string;
            value?: any;
        };
    };
}

// Query Parameters for various endpoints
export interface AttendanceQuery {
    day?: number | 'today';
    class_id?: AgeGroup;
}

export interface EngagementQuery {
    day?: number | 'overall';
    class_id?: AgeGroup;
    gender?: Gender;
}

export interface PerformanceRankingsQuery {
    class_id?: AgeGroup;
    gender?: Gender;
    day?: number | 'overall';
    limit?: number;
}

export interface PointsSummaryQuery {
    day?: number | 'overall';
    class_id?: AgeGroup;
    gender?: Gender;
}

export interface DailyPointsQuery {
    include_projections?: boolean;
    class_id?: AgeGroup;
}