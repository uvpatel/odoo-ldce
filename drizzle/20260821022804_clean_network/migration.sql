CREATE TYPE "user_role" AS ENUM('employee', 'manager', 'hr', 'admin', 'super_admin');--> statement-breakpoint
CREATE TYPE "user_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'employee'::"user_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "status" "user_status" DEFAULT 'active'::"user_status" NOT NULL;