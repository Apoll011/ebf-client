import {useEffect, useState} from "react";

const CACHE_DURATION = 12 * 60 * 60 * 1000;

interface CacheItem<T> {
    data: T;
    timestamp: number;
}

class DashboardCache {
    private cache = new Map<string, CacheItem<unknown>>();

    set<T>(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) return null;

        const isExpired = Date.now() - item.timestamp > CACHE_DURATION;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return item.data as T;
    }

    clear(): void {
        this.cache.clear();
    }

    delete(key: string): void {
        this.cache.delete(key);
    }
}

export const dashboardCache = new DashboardCache();

export const useWidgetDataWithCache = <T>(
    key: string,
    apiCall: () => Promise<T>,
    defaultValue: T,
    forceRefresh: boolean = false
) => {
    const [data, setData] = useState<T>(defaultValue);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!forceRefresh) {
                const cachedData = dashboardCache.get<T>(key);
                if (cachedData !== null) {
                    setData(cachedData);
                    return;
                }
            }

            setIsLoading(true);
            setError(null);

            try {
                const result = await apiCall();
                setData(result);
                dashboardCache.set(key, result);
            } catch (err) {
                setError(err as Error);
                console.error(`Error fetching ${key}:`, err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData().then();
    }, [key, forceRefresh]);

    return { data, isLoading, error };
};
