ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "password" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "isAdmin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;