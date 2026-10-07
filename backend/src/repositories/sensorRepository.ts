import type { ResultSetHeader } from 'mysql2';
import { pool } from '../db/pool.js';
import type { SensorReadingRow } from '../types/database.js';

/**
 * Data access for the `sensor_readings` table. The only place sensor SQL lives.
 */

const READING_COLUMNS =
    'id, temperature, humidity, light_level, recorded_at';

export async function findLatest(): Promise<SensorReadingRow | null> {
    const [rows] = await pool.query<SensorReadingRow[]>(
        `SELECT ${READING_COLUMNS}
           FROM sensor_readings
          ORDER BY recorded_at DESC, id DESC
          LIMIT 1`
    );

    return rows[0] ?? null;
}

export async function findById(
    id: number
): Promise<SensorReadingRow | null> {
    const [rows] = await pool.query<SensorReadingRow[]>(
        `SELECT ${READING_COLUMNS} FROM sensor_readings WHERE id = ? LIMIT 1`,
        [id]
    );

    return rows[0] ?? null;
}

export type NewSensorReading = {
    temperature: number;
    humidity: number;
    lightLevel: number;
};

/** Inserts a reading and returns the stored row (with server timestamps). */
export async function insert(
    reading: NewSensorReading
): Promise<SensorReadingRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO sensor_readings (temperature, humidity, light_level)
         VALUES (?, ?, ?)`,
        [reading.temperature, reading.humidity, reading.lightLevel]
    );

    return findById(result.insertId);
}
