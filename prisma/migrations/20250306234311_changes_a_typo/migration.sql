/*
  Warnings:

  - You are about to drop the column `prefered` on the `Logo` table. All the data in the column will be lost.
  - You are about to drop the column `prefered` on the `Prompt` table. All the data in the column will be lost.
  - Added the required column `preferred` to the `Logo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferred` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Logo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "preferred" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Logo" ("createdAt", "id", "imageUrl", "updatedAt") SELECT "createdAt", "id", "imageUrl", "updatedAt" FROM "Logo";
DROP TABLE "Logo";
ALTER TABLE "new_Logo" RENAME TO "Logo";
CREATE TABLE "new_Prompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "preferred" BOOLEAN NOT NULL
);
INSERT INTO "new_Prompt" ("id", "text") SELECT "id", "text" FROM "Prompt";
DROP TABLE "Prompt";
ALTER TABLE "new_Prompt" RENAME TO "Prompt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
