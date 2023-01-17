/*
  Warnings:

  - Added the required column `quantity` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "total_amount" DOUBLE PRECISION NOT NULL;
