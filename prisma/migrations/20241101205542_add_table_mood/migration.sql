-- CreateTable
CREATE TABLE "Mood" (
    "id" SERIAL NOT NULL,
    "mood" INTEGER NOT NULL,
    "sleep" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mood_date_key" ON "Mood"("date");

-- CreateIndex
CREATE INDEX "Mood_userId_date_idx" ON "Mood"("userId", "date");

-- AddForeignKey
ALTER TABLE "Mood" ADD CONSTRAINT "Mood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
