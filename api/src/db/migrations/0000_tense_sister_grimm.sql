CREATE TABLE "Webhooks" (
	"id" text PRIMARY KEY NOT NULL,
	"method" text NOT NULL,
	"pathname" text NOT NULL,
	"ip" text NOT NULL,
	"statusCode" integer DEFAULT 200 NOT NULL,
	"contentType" text,
	"contentLength" integer,
	"queryParams" jsonb,
	"headers" jsonb NOT NULL,
	"body" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
