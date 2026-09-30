import { Ionicons } from '@expo/vector-icons';

/**
 * Maps a backend device `type` string onto an icon the UI can render.
 *
 * The backend owns the device type; the app owns the presentation. Keeping the
 * mapping here means new device types can be supported without touching the
 * API layer.
 */

export type DeviceIconName = keyof typeof Ionicons.glyphMap;

const FALLBACK_ICON: DeviceIconName = 'hardware-chip-outline';

const ICON_BY_TYPE: Record<string, DeviceIconName> = {
    'smart light': 'bulb-outline',
    light: 'bulb-outline',
    lamp: 'bulb-outline',
    'smart bulb': 'bulb-outline',

    'smart fan': 'sync-outline',
    fan: 'sync-outline',

    'smart lock': 'lock-closed-outline',
    lock: 'lock-closed-outline',
    'door lock': 'lock-closed-outline',

    'smart plug': 'power-outline',
    plug: 'power-outline',
    outlet: 'power-outline',

    thermostat: 'thermometer-outline',
    'smart thermostat': 'thermometer-outline',

    'smart camera': 'videocam-outline',
    camera: 'videocam-outline',

    'smart speaker': 'volume-high-outline',
    speaker: 'volume-high-outline',

    'smart tv': 'tv-outline',
    tv: 'tv-outline',

    sensor: 'pulse-outline',
    'smart sensor': 'pulse-outline',
};

/** Keyword fallbacks, checked when there is no exact type match. */
const ICON_BY_KEYWORD: Array<[keyword: string, icon: DeviceIconName]> = [
    ['light', 'bulb-outline'],
    ['lamp', 'bulb-outline'],
    ['bulb', 'bulb-outline'],
    ['fan', 'sync-outline'],
    ['lock', 'lock-closed-outline'],
    ['plug', 'power-outline'],
    ['thermostat', 'thermometer-outline'],
    ['camera', 'videocam-outline'],
    ['speaker', 'volume-high-outline'],
    ['tv', 'tv-outline'],
    ['sensor', 'pulse-outline'],
];

export function resolveDeviceIcon(
    type: string | null | undefined
): DeviceIconName {
    if (!type) {
        return FALLBACK_ICON;
    }

    const key = type.trim().toLowerCase();

    const exactMatch = ICON_BY_TYPE[key];

    if (exactMatch) {
        return exactMatch;
    }

    const keywordMatch = ICON_BY_KEYWORD.find(([keyword]) =>
        key.includes(keyword)
    );

    return keywordMatch ? keywordMatch[1] : FALLBACK_ICON;
}
