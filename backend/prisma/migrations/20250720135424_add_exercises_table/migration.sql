-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) DEFAULT '',
    "weight" DECIMAL DEFAULT 0,
    "height" DECIMAL DEFAULT 0,
    "measurements" JSONB DEFAULT '{"hips": 0, "chest": 0, "waist": 0, "biceps": 0, "thighs": 0}',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "notes" TEXT DEFAULT '',
    "completed" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" UUID NOT NULL,
    "workout_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sets" INTEGER NOT NULL DEFAULT 3,
    "reps" VARCHAR(50) NOT NULL,
    "weight" DECIMAL DEFAULT 0,
    "rest" VARCHAR(50),
    "muscle_groups" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "focus" VARCHAR(100),
    "day" VARCHAR(50) NOT NULL,
    "completed" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "weight" DECIMAL NOT NULL,
    "measurements" JSONB DEFAULT '{"hips": 0, "chest": 0, "waist": 0, "biceps": 0, "thighs": 0}',
    "notes" TEXT DEFAULT '',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_progress" (
  "id" UUID NOT NULL,
  "exercise_id" UUID NOT NULL,
  "weight" DECIMAL NOT NULL,
  "date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT DEFAULT '',
  "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "exercise_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_workouts_user_id" ON "workouts"("user_id");

-- CreateIndex
CREATE INDEX "idx_exercises_workout_id" ON "exercises"("workout_id");

-- CreateIndex
CREATE INDEX "idx_progress_date" ON "progress"("date");

-- CreateIndex
CREATE INDEX "idx_progress_user_id" ON "progress"("user_id");

-- CreateIndex
CREATE INDEX "idx_exercise_progress_exercise_id" ON "exercise_progress"("exercise_id");

-- CreateIndex
CREATE INDEX "idx_exercise_progress_date" ON "exercise_progress"("date");

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "progress" ADD CONSTRAINT "progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise_progress" ADD CONSTRAINT "exercise_progress_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
