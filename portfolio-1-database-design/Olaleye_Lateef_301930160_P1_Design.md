# Social Media Comment System — database design

My case study records users, posts, comments, reactions.

## Users

- Members publish posts and comment on posts.
- Members react to comments.
- An instructor reviews relational queries, constraints, transactions, and an event-oriented MongoDB model.

## Main operations

- Create and retrieve posts and comments.
- Find recent comments on a post.
- Count reactions on comments grouped by post.
- Add a reaction while preventing duplicate reactions by the same member to the same comment.

## Entities

| Entity | Information stored |
| --- | --- |
| users | Members who author posts and comments or add reactions. |
| posts | Member-authored posts that can receive comments. |
| comments | Comments on posts, each written by one member. |
| reactions | A member's single typed reaction to a comment. |

## users

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| user_id | BIGINT | PK | Yes |
| handle | TEXT | Unique | Yes |
| created_at | TIMESTAMPTZ |  | Yes |
- Unique key: (handle).

## posts

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| post_id | BIGINT | PK | Yes |
| author_id | BIGINT | FK | Yes |
| body | TEXT |  | Yes |
| created_at | TIMESTAMPTZ |  | Yes |
| visibility | TEXT |  | Yes |
- author_id → users.user_id

## comments

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| comment_id | BIGINT | PK | Yes |
| post_id | BIGINT | FK | Yes |
| author_id | BIGINT | FK | Yes |
| body | TEXT |  | Yes |
| created_at | TIMESTAMPTZ |  | Yes |
- post_id → posts.post_id
- author_id → users.user_id

## reactions

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| reaction_id | BIGINT | PK | Yes |
| comment_id | BIGINT | FK | Yes |
| user_id | BIGINT | FK | Yes |
| reaction_type | TEXT |  | Yes |
| created_at | TIMESTAMPTZ |  | Yes |
- comment_id → comments.comment_id
- user_id → users.user_id
- Unique key: (user_id, comment_id).

## Relationships and business rules

- Every member must have a handle.
- A handle identifies at most one member.
- Every post author must reference an existing member.
- A comment body must contain between 1 and 2000 characters.
- A member can react to a given comment at most once.

## Assumptions

- Each comment belongs to exactly one post and has exactly one author; nested comments, media, and moderation workflows are out of scope.
- Each member may have at most one reaction per comment, and a reaction has one reaction type.
- Worked normalization example: decompose a flat comment record containing comment_id, post_id, post_body, author_id, handle, body, and created_at into comments, posts, and users. The comment references one post and one author, avoiding repeated ancestor roles.
- All identifiers and example records are synthetic.

