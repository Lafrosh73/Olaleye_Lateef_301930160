-- Show related comments, posts, users records (up to 20).
SELECT t0."comment_id" AS "comments_comment_id",
       t0."body" AS "comments_body",
       t1."post_id" AS "posts_post_id",
       t1."body" AS "posts_body",
       t2."user_id" AS "users_user_id",
       t2."handle" AS "users_handle"
FROM portfolio."comments" t0
JOIN portfolio."posts" t1 ON t0."post_id" = t1."post_id"
JOIN portfolio."users" t2 ON t1."author_id" = t2."user_id"
ORDER BY t0."comment_id", t1."post_id", t2."user_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT t0."comment_id" AS "comments_comment_id",
       t0."body" AS "comments_body",
       t1."post_id" AS "posts_post_id",
       t1."body" AS "posts_body",
       t2."user_id" AS "users_user_id",
       t2."handle" AS "users_handle"
FROM portfolio."comments" t0
JOIN portfolio."posts" t1 ON t0."post_id" = t1."post_id"
JOIN portfolio."users" t2 ON t1."author_id" = t2."user_id"
ORDER BY t0."comment_id", t1."post_id", t2."user_id"
LIMIT 20;

-- Find comments records where post_id matches 201 (up to 20).
SELECT * FROM portfolio."comments"
WHERE "post_id" IS NOT DISTINCT FROM 201
ORDER BY "comment_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."comments"
WHERE "post_id" IS NOT DISTINCT FROM 201
ORDER BY "comment_id"
LIMIT 20;

-- Count reactions records for each comment_id (up to 20 groups).
SELECT "comment_id", count(*) AS record_count
FROM portfolio."reactions"
GROUP BY "comment_id"
ORDER BY record_count DESC, "comment_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "comment_id", count(*) AS record_count
FROM portfolio."reactions"
GROUP BY "comment_id"
ORDER BY record_count DESC, "comment_id" NULLS LAST
LIMIT 20;
