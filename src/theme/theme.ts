import {
    DarkTheme,
    DefaultTheme,
    type Theme as NavigationTheme,
} from '@react-navigation/native';

/**
 * Design tokens for the app.
 *
 * Both palettes expose exactly the same keys, so screens only ever reference
 * semantic names (`surface`, `text`, `danger`, …) and automatically follow the
 * active theme. Never hard-code a colour in a screen — add a token here.
 */

export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
    /** Screen background. */
    background: string;
    /** Cards and other raised containers. */
    surface: string;
    /** Subtly different fill, e.g. icon circles. */
    surfaceMuted: string;
    /** Primary text. */
    text: string;
    /** Secondary text. */
    textMuted: string;
    /** Text and icons drawn on top of `primary` or `danger`. */
    onAccent: string;
    /** Accent for primary actions. */
    primary: string;
    /** Errors and destructive actions. */
    danger: string;
    /** Background for error banners. */
    dangerSurface: string;
    /** Text for notice/warning banners. */
    warning: string;
    /** Background for notice/warning banners. */
    warningSurface: string;
    /** Hairlines and separators. */
    border: string;
    /** Android ripple highlight drawn over `primary`/`danger`. */
    ripple: string;
};

export type Theme = {
    mode: ThemeMode;
    isDark: boolean;
    colors: ThemeColors;
};

export const lightColors: ThemeColors = {
    background: '#ffffff',
    surface: '#eeeeee',
    surfaceMuted: '#e1e5e9',
    text: '#111111',
    textMuted: '#555555',
    onAccent: '#ffffff',
    primary: '#0a84ff',
    danger: '#d32f2f',
    dangerSurface: '#fdecea',
    warning: '#8a6d00',
    warningSurface: '#fff3cd',
    border: '#d8dce0',
    ripple: '#ffffff55',
};

export const darkColors: ThemeColors = {
    background: '#0f1418',
    surface: '#1b2127',
    surfaceMuted: '#252d35',
    text: '#f1f4f7',
    textMuted: '#9aa5af',
    onAccent: '#ffffff',
    primary: '#3b9dff',
    danger: '#ff7a7a',
    dangerSurface: '#3a2020',
    warning: '#ffd36b',
    warningSurface: '#3a3320',
    border: '#2b343d',
    ripple: '#ffffff33',
};

export const themes: Record<ThemeMode, Theme> = {
    light: { mode: 'light', isDark: false, colors: lightColors },
    dark: { mode: 'dark', isDark: true, colors: darkColors },
};

export function getTheme(mode: ThemeMode): Theme {
    return themes[mode];
}

/**
 * Adapts a palette to the shape React Navigation expects, so the drawer,
 * header and navigation container follow the app theme too.
 */
export function toNavigationTheme(mode: ThemeMode): NavigationTheme {
    const base = mode === 'dark' ? DarkTheme : DefaultTheme;
    const { colors } = themes[mode];

    return {
        ...base,
        dark: mode === 'dark',
        colors: {
            ...base.colors,
            primary: colors.primary,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            notification: colors.danger,
        },
    };
}
