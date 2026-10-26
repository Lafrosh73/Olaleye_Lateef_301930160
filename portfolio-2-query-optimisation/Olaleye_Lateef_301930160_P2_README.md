# Social Media Comment System — SQL queries

## 1. Show related comments, posts, users records (up to 20).

```sql
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
```

| comments_comment_id | comments_body | posts_post_id | posts_body | users_user_id | users_handle |
| --- | --- | --- | --- | --- | --- |
| 301 | A synthetic comment. | 201 | A synthetic post. | 101 | mira |
| 302 | A synthetic comment. | 202 | Another synthetic post. | 102 | noah |

## 2. Find comments records where post_id matches 201 (up to 20).

```sql
SELECT * FROM portfolio."comments"
WHERE "post_id" IS NOT DISTINCT FROM 201
ORDER BY "comment_id"
LIMIT 20;
```

| comment_id | post_id | author_id | body | created_at |
| --- | --- | --- | --- | --- |
| 301 | 201 | 102 | A synthetic comment. | 2025-02-03T09:00:00+00:00 |

## 3. Count reactions records for each comment_id (up to 20 groups).

```sql
SELECT "comment_id", count(*) AS record_count
FROM portfolio."reactions"
GROUP BY "comment_id"
ORDER BY record_count DESC, "comment_id" NULLS LAST
LIMIT 20;
```

| comment_id | record_count |
| --- | --- |
| 301 | 1 |
| 302 | 1 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 0.786 | 0.788, 0.781, 0.786 | Sort → Seq Scan | 112 |
| After index | 0.144 | 0.14, 0.144, 0.161 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 25 |

The median execution time changed from 0.786 ms to 0.144 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=0.768..0.77 rows=20 loops=1)
  Seq Scan on comments (actual time=0.012..0.736 rows=20 loops=1)
Planning Time: 0.256 ms
Execution Time: 0.788 ms
```

### Before index, run 2

```text
Sort (actual time=0.762..0.763 rows=20 loops=1)
  Seq Scan on comments (actual time=0.012..0.733 rows=20 loops=1)
Planning Time: 0.253 ms
Execution Time: 0.781 ms
```

### Before index, run 3

```text
Sort (actual time=0.767..0.768 rows=20 loops=1)
  Seq Scan on comments (actual time=0.012..0.737 rows=20 loops=1)
Planning Time: 0.249 ms
Execution Time: 0.786 ms
```

### After index, run 1

```text
Sort (actual time=0.098..0.1 rows=20 loops=1)
  Bitmap Heap Scan on comments (actual time=0.023..0.069 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.013..0.013 rows=20 loops=1)
Planning Time: 0.44 ms
Execution Time: 0.14 ms
```

### After index, run 2

```text
Sort (actual time=0.099..0.101 rows=20 loops=1)
  Bitmap Heap Scan on comments (actual time=0.023..0.067 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.013..0.013 rows=20 loops=1)
Planning Time: 0.455 ms
Execution Time: 0.144 ms
```

### After index, run 3

```text
Sort (actual time=0.119..0.121 rows=20 loops=1)
  Bitmap Heap Scan on comments (actual time=0.024..0.067 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.014 rows=20 loops=1)
Planning Time: 0.412 ms
Execution Time: 0.161 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Olaleye_Lateef_301930160_P2_Queries.sql, then Olaleye_Lateef_301930160_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Olaleye_Lateef_301930160_P2_QueryResults.png) · [Index comparison](screenshots/Olaleye_Lateef_301930160_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

