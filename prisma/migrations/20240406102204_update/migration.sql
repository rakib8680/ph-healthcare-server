-- AlterTable
ALTER TABLE "patient_health_data" ALTER COLUMN "hasAllergies" DROP NOT NULL,
ALTER COLUMN "hasAllergies" SET DEFAULT false,
ALTER COLUMN "hasDiabetes" DROP NOT NULL,
ALTER COLUMN "hasDiabetes" SET DEFAULT false,
ALTER COLUMN "smokingStatus" DROP NOT NULL,
ALTER COLUMN "smokingStatus" SET DEFAULT false,
ALTER COLUMN "dietaryPreferences" DROP NOT NULL,
ALTER COLUMN "pregnancyStatus" DROP NOT NULL,
ALTER COLUMN "mentalHealthHistory" DROP NOT NULL,
ALTER COLUMN "immunizationStatus" DROP NOT NULL,
ALTER COLUMN "hasPastSurgeries" DROP NOT NULL,
ALTER COLUMN "recentAnxiety" DROP NOT NULL,
ALTER COLUMN "recentDepression" DROP NOT NULL,
ALTER COLUMN "maritalStatus" SET DEFAULT 'UNMARRIED';
