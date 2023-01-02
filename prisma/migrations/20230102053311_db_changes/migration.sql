/*
  Warnings:

  - You are about to drop the column `userId` on the `books` table. All the data in the column will be lost.
  - Added the required column `bookId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_userId_fkey";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bookId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
