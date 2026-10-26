# Social Media Comment System — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| author_id | posts records (list) |
| --- | --- |
| 101 | [201] |
| 102 | [202] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| posts.post_id | posts.author_id | posts.body | users.user_id | users.handle |
| --- | --- | --- | --- | --- |
| 201 | 101 | A synthetic post. | 101 | mira |
| 202 | 102 | Another synthetic post. | 102 | noah |

Key: post_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## posts_example

| posts.post_id | posts.author_id | posts.body | users.user_id | users.handle |
| --- | --- | --- | --- | --- |
| 201 | 101 | A synthetic post. | 101 | mira |
| 202 | 102 | Another synthetic post. | 102 | noah |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## users

| user_id | handle | created_at |
| --- | --- | --- |
| 101 | mira | 2025-01-10T09:00:00+00:00 |
| 102 | noah | 2025-01-11T10:00:00+00:00 |
| 103 | sana | 2025-01-12T11:00:00+00:00 |

## posts

| post_id | author_id | body | created_at | visibility |
| --- | --- | --- | --- | --- |
| 201 | 101 | A synthetic post. | 2025-02-01T09:00:00+00:00 | public |
| 202 | 102 | Another synthetic post. | 2025-02-02T10:00:00+00:00 | members |

## comments

| comment_id | post_id | author_id | body | created_at |
| --- | --- | --- | --- | --- |
| 301 | 201 | 102 | A synthetic comment. | 2025-02-03T09:00:00+00:00 |
| 302 | 202 | 103 | A synthetic comment. | 2025-02-04T10:00:00+00:00 |

## reactions

| reaction_id | comment_id | user_id | reaction_type | created_at |
| --- | --- | --- | --- | --- |
| 401 | 301 | 101 | like | 2025-02-05T09:00:00+00:00 |
| 402 | 302 | 102 | heart | 2025-02-06T10:00:00+00:00 |

## Dependencies

- users: (user_id) → handle, created_at
- posts: (post_id) → author_id, body, created_at, visibility
- comments: (comment_id) → post_id, author_id, body, created_at
- reactions: (reaction_id) → comment_id, user_id, reaction_type, created_at

Joining the decomposed sample tables reproduces the original 2 example rows. The design assumes the declared keys describe the relevant business dependencies.
