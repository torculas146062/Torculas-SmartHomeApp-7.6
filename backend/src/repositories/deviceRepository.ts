import type { ResultSetHeader } from 'mysql2';
import { pool } from '../db/pool.js';
import type { DeviceRow } from '../types/database.js';

/**
 * Data access for the `devices` table.
 *
 * This is the ONLY layer allowed to contain SQL for devices. Controllers and
 * routes call the service layer, never this module directly.
 */

const DEVICE_COLUMNS = 'id, name, type, status, room, created_at, updated_at';

export async function findAll(): Promise<DeviceRow[]> {
    const [rows] = await pool.query<DeviceRow[]>(
        `SELECT ${DEVICE_COLUMNS} FROM devices ORDER BY id ASC`
    );

    return rows;
}

export async function findById(id: number): Promise<DeviceRow | null> {
    const [rows] = await pool.query<DeviceRow[]>(
        `SELECT ${DEVICE_COLUMNS} FROM devices WHERE id = ? LIMIT 1`,
        [id]
    );

    return rows[0] ?? null;
}

/**
 * Persists a new power state and returns the refreshed row, or `null` when no
 * device matched `id`.
 */
export async function updateStatus(
    id: number,
    status: boolean
): Promise<DeviceRow | null> {
    await pool.execute<ResultSetHeader>(
        'UPDATE devices SET status = ? WHERE id = ?',
        [status ? 1 : 0, id]
    );

    // MySQL reports 0 affected rows both for "not found" and "value unchanged",
    // so the refreshed row (null when absent) is the source of truth.
    return findById(id);
}
