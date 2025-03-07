/*
  Warnings:

  - Added the required column `prefered` to the `Logo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Logo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    "prefered" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Logo" ("createdAt", "id", "imageUrl", "updatedAt") SELECT "createdAt", "id", "imageUrl", "updatedAt" FROM "Logo";
DROP TABLE "Logo";
ALTER TABLE "new_Logo" RENAME TO "Logo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
