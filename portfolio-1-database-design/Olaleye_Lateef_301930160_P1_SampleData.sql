-- Fictional sample records for Social Media Comment System.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."users" ("user_id", "handle", "created_at") VALUES (101, 'mira', '2025-01-10T09:00:00Z');
INSERT INTO portfolio."users" ("user_id", "handle", "created_at") VALUES (102, 'noah', '2025-01-11T10:00:00Z');
INSERT INTO portfolio."users" ("user_id", "handle", "created_at") VALUES (103, 'sana', '2025-01-12T11:00:00Z');
INSERT INTO portfolio."posts" ("post_id", "author_id", "body", "created_at", "visibility") VALUES (201, 101, 'A synthetic post.', '2025-02-01T09:00:00Z', 'public');
INSERT INTO portfolio."posts" ("post_id", "author_id", "body", "created_at", "visibility") VALUES (202, 102, 'Another synthetic post.', '2025-02-02T10:00:00Z', 'members');
INSERT INTO portfolio."comments" ("comment_id", "post_id", "author_id", "body", "created_at") VALUES (301, 201, 102, 'A synthetic comment.', '2025-02-03T09:00:00Z');
INSERT INTO portfolio."comments" ("comment_id", "post_id", "author_id", "body", "created_at") VALUES (302, 202, 103, 'A synthetic comment.', '2025-02-04T10:00:00Z');
INSERT INTO portfolio."reactions" ("reaction_id", "comment_id", "user_id", "reaction_type", "created_at") VALUES (401, 301, 101, 'like', '2025-02-05T09:00:00Z');
INSERT INTO portfolio."reactions" ("reaction_id", "comment_id", "user_id", "reaction_type", "created_at") VALUES (402, 302, 102, 'heart', '2025-02-06T10:00:00Z');
COMMIT;
