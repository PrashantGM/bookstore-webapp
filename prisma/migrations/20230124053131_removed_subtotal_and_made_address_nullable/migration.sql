/*
  Warnings:

  - You are about to drop the column `subtotal` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "subtotal",
ALTER COLUMN "delivery_address" DROP NOT NULL;
