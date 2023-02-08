-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_at" TIMESTAMP(3),
ADD COLUMN     "reset_token" TEXT;
