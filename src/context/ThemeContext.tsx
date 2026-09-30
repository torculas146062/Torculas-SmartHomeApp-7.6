import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    getTheme,
    Theme,
    ThemeColors,
    ThemeMode,
    toNavigationTheme,
} from '../theme/theme';

/**
 * Theme state for the whole app.
 *
 * The preference is either an explicit `'light'`/`'dark'` choice or `'system'`,
 * in which case the app follows the OS appearance. It is persisted with
 * AsyncStorage so the choice survives restarts; if storage is unavailable the
 * theme simply falls back to the in-memory value.
 */

export type ThemePreference = ThemeMode | 'system';

const STORAGE_KEY = 'smarthome.theme-preference';

type ThemeContextType = {
    /** Resolved theme (never `'system'`). */
    theme: Theme;
    colors: ThemeColors;
    mode: ThemeMode;
    isDark: boolean;
    /** Raw preference, which may be `'system'`. */
    preference: ThemePreference;
    /** False until the persisted preference has been read. */
    isReady: boolean;
    navigationTheme: ReturnType<typeof toNavigationTheme>;
    setPreference: (preference: ThemePreference) => Promise<void>;
    setDarkMode: (enabled: boolean) => Promise<void>;
    toggleDarkMode: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);

function isThemePreference(value: unknown): value is ThemePreference {
    return (
        value === 'light' ||
        value === 'dark' ||
        value === 'system'
    );
}

export function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const systemScheme = useColorScheme();

    const [preference, setPreferenceState] =
        useState<ThemePreference>('system');

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {

        let cancelled = false;

        (async () => {
            try {
                const stored = await AsyncStorage.getItem(
                    STORAGE_KEY
                );

                if (!cancelled && isThemePreference(stored)) {
                    setPreferenceState(stored);
                }
            } catch {
                // Storage can be unavailable (private browsing, restricted
                // device). The app keeps working, it just forgets the choice.
            } finally {
                if (!cancelled) {
                    setIsReady(true);
                }
            }
        })();

        return () => {
            cancelled = true;
        };

    }, []);

    const mode: ThemeMode =
        preference === 'system'
            ? systemScheme === 'dark'
                ? 'dark'
                : 'light'
            : preference;

    const setPreference = useCallback(
        async (next: ThemePreference) => {

            setPreferenceState(next);

            try {
                await AsyncStorage.setItem(STORAGE_KEY, next);
            } catch {
                // Non-fatal: the theme still applies for this session.
            }

        },
        []
    );

    const setDarkMode = useCallback(
        (enabled: boolean) =>
            setPreference(enabled ? 'dark' : 'light'),
        [setPreference]
    );

    const toggleDarkMode = useCallback(
        () =>
            setPreference(mode === 'dark' ? 'light' : 'dark'),
        [setPreference, mode]
    );

    const theme = getTheme(mode);

    const navigationTheme = useMemo(
        () => toNavigationTheme(mode),
        [mode]
    );

    return (
        <ThemeContext.Provider
            value={{
                theme,
                colors: theme.colors,
                mode,
                isDark: theme.isDark,
                preference,
                isReady,
                navigationTheme,
                setPreference,
                setDarkMode,
                toggleDarkMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {

    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useTheme must be used inside ThemeProvider'
        );
    }

    return context;
}

/**
 * Builds a themed `StyleSheet` once per theme variant.
 *
 * ```ts
 * const useStyles = createThemedStyles((c) => StyleSheet.create({ ... }));
 *
 * function Screen() {
 *     const styles = useStyles();
 *     const { colors } = useTheme();   // for JSX props such as icon colours
 * }
 * ```
 *
 * Styles are cached per mode, so switching themes does not rebuild the sheet
 * on every render and `c` is never captured by a stale closure.
 */
export function createThemedStyles<T>(
    factory: (colors: ThemeColors) => T
): () => T {

    const cache = new Map<ThemeMode, T>();

    return function useThemedStyles(): T {

        const { mode, colors } = useTheme();

        const cached = cache.get(mode);

        if (cached) {
            return cached;
        }

        const styles = factory(colors);

        cache.set(mode, styles);

        return styles;
    };
}
