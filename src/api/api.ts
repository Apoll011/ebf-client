// student-management-api.ts

// student-management-api.ts
import type // Authentication interfaces
{
    // Authentication interfaces
    LoginRequest,
    LoginResponse,
    RefreshTokenResponse,
    User,

    // Main interfaces
    Student,
    StudentListItem,
    CreateStudentRequest,
    UpdateStudentRequest,
    StudentsListQuery,

    // Points interfaces
    AwardPointsRequest,
    PointAdjustmentRequest,

    // Class interfaces
    ClassGroup,
    Teacher,

    // Statistics interfaces
    EventSummary,
    EventProgress,
    DailyAttendance,
    TodayDetailedStats,
    RegistrationStats,
    RegistrationDemographics,
    TodaySummary,
    TodayStudents,
    Engagement,
    PerformanceRanking,
    ClassPerformance,
    PointsCategorySummary,
    DailyPointsTrend,
    PointsDistribution,
    GenderPerformanceAnalysis,
    EventPredictions,

    // Configuration interfaces
    PointSystem,
    SystemConfig,

    // Query interfaces
    AttendanceQuery,
    EngagementQuery,
    PerformanceRankingsQuery,
    PointsSummaryQuery,
    DailyPointsQuery,

    // Utility types
    AgeGroup,
    Gender,
    ApiError, AuthUser,
} from '../model/types.ts';

export class StudentManagementApiError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;
    public readonly details?: any;

    constructor(statusCode: number, error: ApiError['error']) {
        super(error.message);
        this.name = 'StudentManagementApiError';
        this.statusCode = statusCode;
        this.errorCode = error.code;
        this.details = error.details;
    }
}

export class StudentManagementApi {
    private baseUrl: string;
    private defaultHeaders: HeadersInit;
    private authToken: string | null = null;
    private refreshToken: string | null = null;
    private user: User | null = null;
    private tokenExpiresAt: Date | null = null;
    private refreshPromise: Promise<void> | null = null;

    // Storage keys for persisting auth state
    private readonly TOKEN_STORAGE_KEY = 'sms_auth_token';
    private readonly REFRESH_TOKEN_STORAGE_KEY = 'sms_refresh_token';
    private readonly USER_STORAGE_KEY = 'sms_user';
    private readonly TOKEN_EXPIRES_STORAGE_KEY = 'sms_token_expires';

    constructor(
        baseUrl: string = 'https://ebf-api.onrender.com/',
        defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
        },
        autoLoadStoredAuth: boolean = true
    ) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.defaultHeaders = defaultHeaders;

        // Auto-load stored authentication state
        if (autoLoadStoredAuth && typeof window !== 'undefined') {
            this.loadStoredAuth();
        }
    }

    // ===================
    // AUTHENTICATION METHODS
    // ===================

    /**
     * Login with username and password using OAuth2 token endpoint
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            // Prepare form data for OAuth2 token request
            const formData = new URLSearchParams();
            formData.append('grant_type', 'password');
            formData.append('username', credentials.username);
            formData.append('password', credentials.password);
            formData.append('scope', credentials.scope || '');
            formData.append('client_id', credentials.client_id || 'string');
            formData.append('client_secret', credentials.client_secret || '');

            const response = await this.request<LoginResponse>('/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
                body: formData.toString(),
                skipAuth: true, // Skip auth for login request
            });

            // Store authentication data
            this.setAuthData(response, credentials.username);

            return response;
        } catch (error) {
            this.clearAuthData();
            throw error;
        }
    }

    /**
     * Logout (client-side only - clears local auth data)
     */
    logout(): void {
        this.clearAuthData();
    }

    /**
     * Refresh the authentication token
     */
    async refreshAuthToken(): Promise<void> {
        if (!this.refreshToken) {
            throw new StudentManagementApiError(401, {
                code: 'NO_REFRESH_TOKEN',
                message: 'No refresh token available',
            });
        }

        // Prevent multiple refresh requests
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = this.performTokenRefresh();
        try {
            await this.refreshPromise;
        } finally {
            this.refreshPromise = null;
        }
    }

    private async performTokenRefresh(): Promise<void> {
        try {
            const formData = new URLSearchParams();
            formData.append('grant_type', 'refresh_token');
            formData.append('refresh_token', this.refreshToken!);

            const response = await this.request<RefreshTokenResponse>('/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
                body: formData.toString(),
                skipAuth: true,
            });

            // Update auth data with new token
            this.authToken = response.access_token;

            // Calculate new expiration time
            const expiresInSeconds = response.expires_in || 3600;
            this.tokenExpiresAt = new Date(Date.now() + expiresInSeconds * 1000);

            if (response.refresh_token) {
                this.refreshToken = response.refresh_token;
            }

            this.storeAuthData();
        } catch (error) {
            console.warn('Failed to refresh auth token:', error);
            this.clearAuthData();
            throw new StudentManagementApiError(401, {
                code: 'TOKEN_REFRESH_FAILED',
                message: 'Failed to refresh authentication token',
            });
        }
    }

    /**
     * Check if user is currently authenticated
     */
    isAuthenticated(): boolean {
        return this.authToken !== null && !this.isTokenExpired();
    }

    /**
     * Check if token is expired
     */
    private isTokenExpired(): boolean {
        if (!this.tokenExpiresAt) return true;
        return new Date() >= this.tokenExpiresAt;
    }

    /**
     * Check if token needs refresh (within 5 minutes of expiry)
     */
    private needsTokenRefresh(): boolean {
        if (!this.tokenExpiresAt) return false;
        const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
        return this.tokenExpiresAt <= fiveMinutesFromNow;
    }

    /**
     * Get current user information
     */
    getCurrentUser(): User | null {
        return this.user;
    }

    /**
     * Get current auth token
     */
    getAuthToken(): string | null {
        return this.authToken;
    }

    /**
     * Set authentication data from OAuth2 login response
     */
    private setAuthData(loginResponse: LoginResponse, username: string): void {
        this.authToken = loginResponse.access_token;
        this.refreshToken = loginResponse.refresh_token || null;

        // Create user object from available data
        this.user = {
            username: username,
            // Additional user data would come from a separate user info endpoint if needed
        };

        // Calculate token expiration (default to 1 hour if not provided)
        const expiresInSeconds = loginResponse.expires_in || 3600;
        this.tokenExpiresAt = new Date(Date.now() + expiresInSeconds * 1000);

        this.storeAuthData();
    }

    /**
     * Clear authentication data
     */
    private clearAuthData(): void {
        this.authToken = null;
        this.refreshToken = null;
        this.user = null;
        this.tokenExpiresAt = null;

        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.TOKEN_STORAGE_KEY);
            localStorage.removeItem(this.REFRESH_TOKEN_STORAGE_KEY);
            localStorage.removeItem(this.USER_STORAGE_KEY);
            localStorage.removeItem(this.TOKEN_EXPIRES_STORAGE_KEY);
        }
    }

    /**
     * Store auth data in localStorage
     */
    private storeAuthData(): void {
        if (typeof window === 'undefined') return;

        try {
            if (this.authToken) {
                localStorage.setItem(this.TOKEN_STORAGE_KEY, this.authToken);
            }
            if (this.refreshToken) {
                localStorage.setItem(this.REFRESH_TOKEN_STORAGE_KEY, this.refreshToken);
            }
            if (this.user) {
                localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(this.user));
            }
            if (this.tokenExpiresAt) {
                localStorage.setItem(this.TOKEN_EXPIRES_STORAGE_KEY, this.tokenExpiresAt.toISOString());
            }
        } catch (error) {
            console.warn('Failed to store auth data:', error);
        }
    }

    /**
     * Load stored auth data from localStorage
     */
    private loadStoredAuth(): void {
        if (typeof window === 'undefined') return;

        try {
            const token = localStorage.getItem(this.TOKEN_STORAGE_KEY);
            const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_STORAGE_KEY);
            const userStr = localStorage.getItem(this.USER_STORAGE_KEY);
            const expiresStr = localStorage.getItem(this.TOKEN_EXPIRES_STORAGE_KEY);

            if (token && userStr && expiresStr) {
                this.authToken = token;
                this.refreshToken = refreshToken;
                this.user = JSON.parse(userStr);
                this.tokenExpiresAt = new Date(expiresStr);

                // Clear auth if token is already expired
                if (this.isTokenExpired() && !this.refreshToken) {
                    this.clearAuthData();
                }
            }
        } catch (error) {
            console.warn('Failed to load stored auth data:', error);
            this.clearAuthData();
        }
    }

    // ===================
    // ENHANCED REQUEST METHOD
    // ===================
    // Enhanced helper method for making API requests with auth
    private async request<T>(
        endpoint: string,
        options: RequestInit & { skipAuth?: boolean } = {}
    ): Promise<T> {
        const { skipAuth, ...fetchOptions } = options;

        // Handle authentication
        if (!skipAuth) {
            // Check if we need to refresh the token
            if (this.isAuthenticated() && this.needsTokenRefresh() && this.refreshToken) {
                try {
                    await this.refreshAuthToken();
                } catch (error) {
                    console.log("Failed to refresh token, clearing auth data:", error);
                }
            }

            // Check if we're authenticated for protected endpoints
            if (!this.isAuthenticated()) {
                throw new StudentManagementApiError(401, {
                    code: 'NOT_AUTHENTICATED',
                    message: 'Authentication required. Please login first.',
                });
            }
        }

        const url = `${this.baseUrl}${endpoint}`;
        const headers: HeadersInit = {
            ...this.defaultHeaders,
            ...fetchOptions.headers,
        };

        // Add auth header if we have a token and not skipping auth
        if (!skipAuth && this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        const config: RequestInit = {
            ...fetchOptions,
            headers,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                // Handle 401 Unauthorized - might need token refresh
                if (response.status === 401 && !skipAuth && this.refreshToken) {
                    try {
                        await this.refreshAuthToken();
                        // Retry the request with new token
                        const retryHeaders = {
                            ...headers,
                            'Authorization': `Bearer ${this.authToken}`,
                        };
                        const retryResponse = await fetch(url, { ...config, headers: retryHeaders });

                        if (retryResponse.ok) {
                            if (retryResponse.status === 204) {
                                return {} as T;
                            }
                            return await retryResponse.json();
                        }
                    } catch (refreshError) {
                        console.log("Failed to refresh token, clearing auth data:", refreshError);
                        this.clearAuthData();
                    }
                }

                let errorData: ApiError;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = {
                        error: {
                            code: 'UNKNOWN_ERROR',
                            message: `HTTP ${response.status}: ${response.statusText}`,
                        },
                    };
                }

                // Clear auth data on 401 errors
                if (response.status === 401) {
                    this.clearAuthData();
                }

                throw new StudentManagementApiError(response.status, errorData.error);
            }

            // Handle 204 No Content responses
            if (response.status === 204) {
                return {} as T;
            }

            return await response.json();
        } catch (error) {
            if (error instanceof StudentManagementApiError) {
                throw error;
            }
            throw new StudentManagementApiError(500, {
                code: 'NETWORK_ERROR',
                message: error instanceof Error ? error.message : 'Network error occurred',
            });
        }
    }

    private buildQueryString(params: Record<string, any>): string {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const query = searchParams.toString();
        return query ? `?${query}` : '';
    }

    async createUser(userData: AuthUser): Promise<User> {
        return this.request<User>('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // ===================
    // STUDENT MANAGEMENT
    // ===================

    /**
     * Register a new student
     */
    async registerStudent(studentData: CreateStudentRequest): Promise<Student> {
        const queryString = this.buildQueryString({
            student: studentData
        });
        return this.request<Student>(`/students${queryString}`);
    }

    /**
     * Get all students with optional filtering
     */
    async getStudents(query?: StudentsListQuery): Promise<StudentListItem[]> {
        const queryString = query ? this.buildQueryString(query) : '';
        return this.request<StudentListItem[]>(`/students${queryString}`);
    }

    /**
     * Get detailed student information
     */
    async getStudent(id: string): Promise<Student> {
        return this.request<Student>(`/students/${id}`);
    }

    /**
     * Update student information
     */
    async updateStudent(id: string, updates: UpdateStudentRequest): Promise<Student> {
        return this.request<Student>(`/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    /**
     * Delete a student
     */
    async deleteStudent(id: string): Promise<void> {
        await this.request<void>(`/students/${id}`, {
            method: 'DELETE',
        });
    }

    // ===================
    // POINTS MANAGEMENT
    // ===================

    /**
     * Award daily points to a student
     */
    async awardPoints(studentId: string, pointsData: AwardPointsRequest): Promise<Student> {
        return this.request<Student>(`/students/${studentId}/points`, {
            method: 'POST',
            body: JSON.stringify(pointsData),
        });
    }

    /**
     * Manually adjust student points
     */
    async adjustPoints(studentId: string, adjustment: PointAdjustmentRequest): Promise<Student> {
        return this.request<Student>(`/students/${studentId}/points/adjust`, {
            method: 'PATCH',
            body: JSON.stringify(adjustment),
        });
    }

    // ===================
    // CLASS & TEACHER MANAGEMENT
    // ===================

    /**
     * Get all class groups
     */
    async getClasses(): Promise<ClassGroup[]> {
        return this.request<ClassGroup[]>('/classes');
    }

    /**
     * Get teachers for a specific class
     */
    async getClassTeachers(classId: AgeGroup): Promise<Teacher[]> {
        return this.request<Teacher[]>(`/classes/${classId}/teachers`);
    }

    // ===================
    // STATISTICS & ANALYTICS
    // ===================

    // Event Overview
    /**
     * Get event summary statistics
     */
    async getEventSummary(): Promise<EventSummary> {
        return this.request<EventSummary>('/stats/event/summary');
    }

    /**
     * Get event progress information
     */
    async getEventProgress(): Promise<EventProgress> {
        return this.request<EventProgress>('/stats/event/progress');
    }

    // Daily Event Statistics
    /**
     * Get daily attendance statistics
     */
    async getDailyAttendance(query?: AttendanceQuery): Promise<DailyAttendance[]> {
        const queryString = query ? this.buildQueryString(query) : '';
        return this.request<DailyAttendance[]>(`/stats/attendance/daily${queryString}`);
    }

    /**
     * Get today's detailed statistics
     */
    async getTodayDetailedStats(): Promise<TodayDetailedStats> {
        return this.request<TodayDetailedStats>('/stats/today/detailed');
    }

    // Registration Statistics
    /**
     * Get total registration statistics
     */
    async getRegistrationStats(): Promise<RegistrationStats> {
        return this.request<RegistrationStats>('/stats/registrations');
    }

    /**
     * Get registration demographics
     */
    async getRegistrationDemographics(): Promise<RegistrationDemographics> {
        return this.request<RegistrationDemographics>('/stats/registrations/demographics');
    }

    // Current Day Statistics
    /**
     * Get today's summary
     */
    async getTodaySummary(): Promise<TodaySummary> {
        return this.request<TodaySummary>('/stats/today/summary');
    }

    /**
     * Get students present today
     */
    async getTodayStudents(): Promise<TodayStudents> {
        return this.request<TodayStudents>('/stats/today/students');
    }

    // Engagement & Performance
    /**
     * Get event engagement statistics
     */
    async getEngagement(query?: EngagementQuery): Promise<Engagement> {
        const queryString = query ? this.buildQueryString(query) : '';
        return this.request<Engagement>(`/stats/engagement${queryString}`);
    }

    /**
     * Get student performance rankings
     */
    async getPerformanceRankings(query?: PerformanceRankingsQuery): Promise<PerformanceRanking[]> {
        const queryString = query ? this.buildQueryString(query) : '';
        return this.request<PerformanceRanking[]>(`/stats/performance/rankings${queryString}`);
    }

    /**
     * Get class performance comparison
     */
    async getClassPerformance(): Promise<ClassPerformance[]> {
        return this.request<ClassPerformance[]>('/stats/performance/classes');
    }

    // Points Analytics
    /**
     * Get points summary by category
     */
    async getPointsSummary(query?: PointsSummaryQuery): Promise<PointsCategorySummary[]> {
        const queryString = query ? this.buildQueryString(query) : '';
        return this.request<PointsCategorySummary[]>(`/stats/points/summary${queryString}`);
    }

    /**
     * Get daily points trends
     */
    async getDailyPointsTrends(query?: DailyPointsQuery): Promise<DailyPointsTrend[]> {
        const queryString = query ? this.buildQueryString(query) : '';
        return this.request<DailyPointsTrend[]>(`/stats/points/daily${queryString}`);
    }

    /**
     * Get event points distribution
     */
    async getPointsDistribution(): Promise<PointsDistribution> {
        return this.request<PointsDistribution>('/stats/points/distribution');
    }

    // Event Analytics
    /**
     * Get gender performance analysis
     */
    async getGenderPerformanceAnalysis(): Promise<GenderPerformanceAnalysis> {
        return this.request<GenderPerformanceAnalysis>('/stats/performance/');
    }

    /**
     * Get event predictions
     */
    async getEventPredictions(): Promise<EventPredictions> {
        return this.request<EventPredictions>('/stats/event/predictions');
    }

    // ===================
    // CONSTANTS & CONFIGURATION
    // ===================

    /**
     * Get point system values
     */
    async getPointSystem(): Promise<PointSystem> {
        return this.request<PointSystem>('/constants/points');
    }

    /**
     * Get system configuration
     */
    async getSystemConfig(): Promise<SystemConfig> {
        return this.request<SystemConfig>('/constants/config');
    }

    // ===================
    // CONVENIENCE METHODS
    // ===================

    /**
     * Get all students in a specific age group
     */
    async getStudentsByAgeGroup(ageGroup: AgeGroup): Promise<StudentListItem[]> {
        return this.getStudents({ age_group: ageGroup });
    }

    /**
     * Get all students of a specific gender
     */
    async getStudentsByGender(gender: Gender): Promise<StudentListItem[]> {
        return this.getStudents({ gender });
    }

    /**
     * Get top performing students
     */
    async getTopPerformers(limit: number = 10): Promise<PerformanceRanking[]> {
        return this.getPerformanceRankings({ limit });
    }

    /**
     * Get students with custom age range
     */
    async getStudentsByCustomAgeRange(minAge: number, maxAge: number): Promise<StudentListItem[]> {
        return this.getStudents({
            age_group: 'custom',
            min_age: minAge,
            max_age: maxAge,
        });
    }

    /**
     * Get attendance for a specific day
     */
    async getAttendanceForDay(day: number): Promise<DailyAttendance[]> {
        return this.getDailyAttendance({ day });
    }

    /**
     * Get today's attendance
     */
    async getTodayAttendance(): Promise<DailyAttendance[]> {
        return this.getDailyAttendance({ day: 'today' });
    }

    /**
     * Get engagement for a specific class
     */
    async getClassEngagement(classId: AgeGroup): Promise<Engagement> {
        return this.getEngagement({ class_id: classId });
    }

    /**
     * Get points summary for today
     */
    async getTodayPointsSummary(): Promise<PointsCategorySummary[]> {
        return this.getPointsSummary({ day: 1 }); // Assuming current day
    }

    /**
     * Get overall points summary
     */
    async getOverallPointsSummary(): Promise<PointsCategorySummary[]> {
        return this.getPointsSummary({ day: 'overall' });
    }

    /**
     * Update base URL (useful for switching environments)
     */
    setBaseUrl(newBaseUrl: string): void {
        this.baseUrl = newBaseUrl.replace(/\/$/, '');
    }

    /**
     * Update default headers (useful for adding auth tokens)
     */
    setDefaultHeaders(headers: HeadersInit): void {
        this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    }

    /**
     * Get current base URL
     */
    getBaseUrl(): string {
        return this.baseUrl;
    }
}

// Create a default instance
export const studentApi = new StudentManagementApi();

// Export the class and default instance
export default StudentManagementApi;