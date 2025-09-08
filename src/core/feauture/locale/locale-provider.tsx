import React, { useState, useEffect } from 'react';
import { LocaleContext, Locale } from './locale-context';

interface LocaleProviderProps {
    children: React.ReactNode;
    defaultLocale?: Locale;
    storageKey?: string;
}

export function LocaleProvider({
    children,
    defaultLocale = 'ru',
    storageKey = 'clean-house-locale',
}: LocaleProviderProps) {
    const [locale, setLocale] = useState<Locale>(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored && (stored === 'ru' || stored === 'en')) {
                return stored as Locale;
            }
        } catch (error) {
            console.warn('Failed to read locale from localStorage:', error);
        }
        return defaultLocale;
    });

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, locale);
        } catch (error) {
            console.warn('Failed to save locale to localStorage:', error);
        }
    }, [locale, storageKey]);

    const value = {
        locale,
        setLocale,
    };

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
}
