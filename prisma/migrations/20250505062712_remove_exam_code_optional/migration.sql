/*
  Warnings:

  - Made the column `examCode` on table `Record` required. This step will fail if there are existing NULL values in that column.

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
    "examCode" TEXT NOT NULL,
    "examTier" TEXT,
    "testPlatform" TEXT NOT NULL,
    "testLink" TEXT,
    "percentile" REAL,
    "rank" TEXT,
    "totalTimeTaken" TEXT NOT NULL,
    "totalTime" TEXT NOT NULL,
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
INSERT INTO "new_Record" ("attemptedQuestions", "createdAt", "examCode", "examName", "examTier", "id", "keyPoints", "learnings", "obtainedMarks", "percentile", "rank", "sectionWise", "testDate", "testLink", "testName", "testPlatform", "totalCorrectMarks", "totalCorrectQuestions", "totalMarks", "totalQuestions", "totalSkippedQuestions", "totalTime", "totalTimeTaken", "totalWrongMarks", "totalWrongQuestions", "updatedAt", "userId") SELECT "attemptedQuestions", "createdAt", "examCode", "examName", "examTier", "id", "keyPoints", "learnings", "obtainedMarks", "percentile", "rank", "sectionWise", "testDate", "testLink", "testName", "testPlatform", "totalCorrectMarks", "totalCorrectQuestions", "totalMarks", "totalQuestions", "totalSkippedQuestions", "totalTime", "totalTimeTaken", "totalWrongMarks", "totalWrongQuestions", "updatedAt", "userId" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
CREATE UNIQUE INDEX "Record_id_key" ON "Record"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
