/*
  Warnings:

  - Added the required column `endTime` to the `CodingPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `CodingPlan` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CodingPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CodingPlan" ("createdAt", "description", "dueDate", "id", "status", "title", "updatedAt") SELECT "createdAt", "description", "dueDate", "id", "status", "title", "updatedAt" FROM "CodingPlan";
DROP TABLE "CodingPlan";
ALTER TABLE "new_CodingPlan" RENAME TO "CodingPlan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
