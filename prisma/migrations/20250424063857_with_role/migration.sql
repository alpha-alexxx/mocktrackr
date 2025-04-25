-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "twoFactorEnabled" BOOLEAN,
    "normalizedEmail" TEXT
);
INSERT INTO "new_user" ("createdAt", "email", "emailVerified", "id", "image", "name", "normalizedEmail", "twoFactorEnabled", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "image", "name", "normalizedEmail", "twoFactorEnabled", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE UNIQUE INDEX "user_normalizedEmail_key" ON "user"("normalizedEmail");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
