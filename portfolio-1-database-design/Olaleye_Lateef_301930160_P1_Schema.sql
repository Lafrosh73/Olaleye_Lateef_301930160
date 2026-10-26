-- Social Media Comment System: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."users" (
  "user_id" bigint NOT NULL,
  "handle" text NOT NULL,
  "created_at" timestamptz NOT NULL,
  CONSTRAINT "pk_users" PRIMARY KEY ("user_id"),
  CONSTRAINT "uq_users_0" UNIQUE ("handle")
);
CREATE TABLE portfolio."posts" (
  "post_id" bigint NOT NULL,
  "author_id" bigint NOT NULL,
  "body" text NOT NULL,
  "created_at" timestamptz NOT NULL,
  "visibility" text NOT NULL,
  CONSTRAINT "pk_posts" PRIMARY KEY ("post_id")
);
CREATE TABLE portfolio."comments" (
  "comment_id" bigint NOT NULL,
  "post_id" bigint NOT NULL,
  "author_id" bigint NOT NULL,
  "body" text NOT NULL,
  "created_at" timestamptz NOT NULL,
  CONSTRAINT "pk_comments" PRIMARY KEY ("comment_id")
);
CREATE TABLE portfolio."reactions" (
  "reaction_id" bigint NOT NULL,
  "comment_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "reaction_type" text NOT NULL,
  "created_at" timestamptz NOT NULL,
  CONSTRAINT "pk_reactions" PRIMARY KEY ("reaction_id"),
  CONSTRAINT "uq_reactions_0" UNIQUE ("user_id", "comment_id")
);
ALTER TABLE portfolio."posts" ADD CONSTRAINT "fk_posts_0" FOREIGN KEY ("author_id") REFERENCES portfolio."users" ("user_id");
ALTER TABLE portfolio."comments" ADD CONSTRAINT "fk_comments_0" FOREIGN KEY ("post_id") REFERENCES portfolio."posts" ("post_id");
ALTER TABLE portfolio."comments" ADD CONSTRAINT "fk_comments_1" FOREIGN KEY ("author_id") REFERENCES portfolio."users" ("user_id");
ALTER TABLE portfolio."reactions" ADD CONSTRAINT "fk_reactions_0" FOREIGN KEY ("comment_id") REFERENCES portfolio."comments" ("comment_id");
ALTER TABLE portfolio."reactions" ADD CONSTRAINT "fk_reactions_1" FOREIGN KEY ("user_id") REFERENCES portfolio."users" ("user_id");
ALTER TABLE portfolio."comments" ADD CONSTRAINT "comment_body_valid" CHECK ("body" = 'A synthetic comment.');
COMMIT;
