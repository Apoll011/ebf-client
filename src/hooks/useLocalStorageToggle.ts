import { useState, useEffect } from 'react';

export const useLocalStorageToggle = (key: string) => {
    const [value, setValue] = useState<boolean>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : false;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return false;
        }
    });

    const toggle = () => {
        setValue(prevValue => {
            const newValue = !prevValue;
            try {
                localStorage.setItem(key, JSON.stringify(newValue));
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
            return newValue;
        });
    };

    const setToggleValue = (newValue: boolean) => {
        setValue(newValue);
        try {
            localStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setValue(JSON.parse(e.newValue));
                } catch (error) {
                    console.warn(`Error parsing localStorage value for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return { value, toggle, setValue: setToggleValue };
};