/*
  Warnings:

  - You are about to alter the column `status` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `dayOfWeek` on the `DoctorTiming` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `paymentStatus` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `paymentMethod` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.
  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Appointment` MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `DoctorTiming` MODIFY `dayOfWeek` ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL;

-- AlterTable
ALTER TABLE `Payment` MODIFY `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    MODIFY `paymentMethod` ENUM('CARD', 'UPI', 'NETBANKING', 'CASH') NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('DOCTOR', 'PATIENT', 'ADMIN', 'HOSPITAL') NOT NULL;
