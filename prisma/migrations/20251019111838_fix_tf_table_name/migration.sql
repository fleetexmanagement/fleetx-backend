/*
  Warnings:

  - You are about to drop the `TwoFactor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."TwoFactor";

-- CreateTable
CREATE TABLE "twoFactor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT[],

    CONSTRAINT "twoFactor_pkey" PRIMARY KEY ("id")
);
