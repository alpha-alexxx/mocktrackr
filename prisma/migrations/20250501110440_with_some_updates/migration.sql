/*
  Warnings:

  - You are about to drop the column `examType` on the `Record` table. All the data in the column will be lost.
  - Added the required column `attemptedQuestions` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testDate` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCorrectMarks` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCorrectQuestions` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalQuestions` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSkippedQuestions` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTime` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWrongMarks` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWrongQuestions` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Record" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "testDate" DATETIME NOT NULL,
    "examName" TEXT NOT NULL,
    "examPaper" TEXT NOT NULL,
    "examTier" TEXT,
    "testPlatform" TEXT NOT NULL,
    "testLink" TEXT,
    "percentile" REAL,
    "rank" INTEGER,
    "totalTimeTaken" INTEGER NOT NULL,
    "totalTime" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "attemptedQuestions" INTEGER NOT NULL,
    "totalSkippedQuestions" INTEGER NOT NULL,
    "totalCorrectQuestions" INTEGER NOT NULL,
    "totalWrongQuestions" INTEGER NOT NULL,
    "totalMarks" REAL NOT NULL,
    "obtainedMarks" REAL NOT NULL,
    "totalCorrectMarks" REAL NOT NULL,
    "totalWrongMarks" REAL NOT NULL,
    "keyPoints" TEXT,
    "learnings" TEXT,
    "sectionWise" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Record" ("createdAt", "examName", "examPaper", "id", "keyPoints", "learnings", "obtainedMarks", "percentile", "rank", "sectionWise", "testLink", "testName", "testPlatform", "totalMarks", "totalTimeTaken", "updatedAt", "userId") SELECT "createdAt", "examName", "examPaper", "id", "keyPoints", "learnings", "obtainedMarks", "percentile", "rank", "sectionWise", "testLink", "testName", "testPlatform", "totalMarks", "totalTimeTaken", "updatedAt", "userId" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
CREATE UNIQUE INDEX "Record_id_key" ON "Record"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
