ALTER TABLE "account" ADD COLUMN "issuer" text;--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account" ("issuer","account_id");