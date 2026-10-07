-- ---------------------------------------------------------------------------
-- Smart Home IoT backend — database schema
--
-- Usage:  mysql -u root -p < sql/schema.sql
-- ---------------------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS `smarthome`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `smarthome`;

-- Devices the app can list and toggle.
CREATE TABLE IF NOT EXISTS `devices` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(120) NOT NULL,
  `type`       VARCHAR(60)  NOT NULL,
  `status`     TINYINT(1)   NOT NULL DEFAULT 0,
  `room`       VARCHAR(80)      NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_devices_room` (`room`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Time-series of sensor snapshots; the newest row backs `GET /api/sensors/latest`.
CREATE TABLE IF NOT EXISTS `sensor_readings` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `temperature` FLOAT        NOT NULL,
  `humidity`    FLOAT        NOT NULL,
  `light_level` INT          NOT NULL,
  `recorded_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sensor_readings_recorded_at` (`recorded_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
