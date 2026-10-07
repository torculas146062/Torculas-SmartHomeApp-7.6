-- ---------------------------------------------------------------------------
-- Smart Home IoT backend — development seed data
--
-- Run AFTER sql/schema.sql:
--   mysql -u root -p < sql/seed.sql
--
-- Re-runnable: both tables are truncated first. These devices mirror the ones
-- the app ships with in `src/services/mock/IoTMockService.ts`.
-- ---------------------------------------------------------------------------

USE `smarthome`;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `sensor_readings`;
TRUNCATE TABLE `devices`;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `devices` (`id`, `name`, `type`, `status`, `room`) VALUES
  (1, 'Living Room Light', 'Smart Light',  1, 'Living Room'),
  (2, 'Bedroom Fan',       'Smart Fan',    0, 'Bedroom'),
  (3, 'Front Door Lock',   'Smart Lock',   1, 'Entryway'),
  (4, 'Kitchen Sensor Hub','Smart Sensor', 1, 'Kitchen'),
  (5, 'Backyard Camera',   'Smart Camera', 0, 'Backyard');

INSERT INTO `sensor_readings` (`temperature`, `humidity`, `light_level`, `recorded_at`) VALUES
  (27, 61, 540, NOW() - INTERVAL 30 MINUTE),
  (28, 63, 610, NOW() - INTERVAL 15 MINUTE),
  (29, 58, 720, NOW());
