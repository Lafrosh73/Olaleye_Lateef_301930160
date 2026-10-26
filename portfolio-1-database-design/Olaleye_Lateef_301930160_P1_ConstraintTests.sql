-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. users pk test. Expected: pk_users, SQLSTATE 23505.
INSERT INTO portfolio."users" ("user_id", "handle", "created_at")
VALUES (101, 'fresh_pk_handle', '2025-03-01T09:00:00Z');

-- 2. users unique test. Expected: uq_users_0, SQLSTATE 23505.
INSERT INTO portfolio."users" ("user_id", "handle", "created_at")
VALUES (501, 'mira', '2025-03-02T09:00:00Z');

-- 3. users not null test. Expected: user_id, SQLSTATE 23502.
INSERT INTO portfolio."users" ("user_id", "handle", "created_at")
VALUES (NULL, 'fresh_null_id_handle', '2025-03-03T09:00:00Z');

-- 4. posts pk test. Expected: pk_posts, SQLSTATE 23505.
INSERT INTO portfolio."posts" ("post_id", "author_id", "body", "created_at", "visibility")
VALUES (201, 102, 'Unique body for primary test.', '2025-03-04T09:00:00Z', 'public');

-- 5. posts fk test. Expected: fk_posts_0, SQLSTATE 23503.
INSERT INTO portfolio."posts" ("post_id", "author_id", "body", "created_at", "visibility")
VALUES (502, 990001, 'Missing author test.', '2025-03-05T09:00:00Z', 'public');

-- 6. comments pk test. Expected: pk_comments, SQLSTATE 23505.
INSERT INTO portfolio."comments" ("comment_id", "post_id", "author_id", "body", "created_at")
VALUES (301, 202, 103, 'A synthetic comment.', '2025-03-06T09:00:00Z');

-- 7. comments post fk test. Expected: fk_comments_0, SQLSTATE 23503.
INSERT INTO portfolio."comments" ("comment_id", "post_id", "author_id", "body", "created_at")
VALUES (503, 990002, 102, 'A synthetic comment.', '2025-03-07T09:00:00Z');

-- 8. comments author fk test. Expected: fk_comments_1, SQLSTATE 23503.
INSERT INTO portfolio."comments" ("comment_id", "post_id", "author_id", "body", "created_at")
VALUES (504, 201, 990003, 'A synthetic comment.', '2025-03-08T09:00:00Z');

-- 9. comments body check test. Expected: comment_body_valid, SQLSTATE 23514.
INSERT INTO portfolio."comments" ("comment_id", "post_id", "author_id", "body", "created_at")
VALUES (505, 201, 102, '', '2025-03-09T09:00:00Z');

-- 10. reactions pk test. Expected: pk_reactions, SQLSTATE 23505.
INSERT INTO portfolio."reactions" ("reaction_id", "comment_id", "user_id", "reaction_type", "created_at")
VALUES (401, 302, 103, 'like', '2025-03-10T09:00:00Z');

-- 11. reactions unique test. Expected: uq_reactions_0, SQLSTATE 23505.
INSERT INTO portfolio."reactions" ("reaction_id", "comment_id", "user_id", "reaction_type", "created_at")
VALUES (506, 301, 101, 'heart', '2025-03-11T09:00:00Z');

-- 12. reactions comment fk test. Expected: fk_reactions_0, SQLSTATE 23503.
INSERT INTO portfolio."reactions" ("reaction_id", "comment_id", "user_id", "reaction_type", "created_at")
VALUES (507, 990004, 103, 'like', '2025-03-12T09:00:00Z');

-- 13. reactions user fk test. Expected: fk_reactions_1, SQLSTATE 23503.
INSERT INTO portfolio."reactions" ("reaction_id", "comment_id", "user_id", "reaction_type", "created_at")
VALUES (508, 301, 990005, 'like', '2025-03-13T09:00:00Z');
