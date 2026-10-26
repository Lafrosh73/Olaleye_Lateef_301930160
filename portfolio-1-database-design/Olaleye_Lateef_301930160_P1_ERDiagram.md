# Social Media Comment System — ER diagram

```mermaid
erDiagram
    direction LR
    users {
        bigint user_id PK
        text handle UK
        timestamptz created_at
    }
    posts {
        bigint post_id PK
        bigint author_id FK
        text body
        timestamptz created_at
        text visibility
    }
    comments {
        bigint comment_id PK
        bigint post_id FK
        bigint author_id FK
        text body
        timestamptz created_at
    }
    reactions {
        bigint reaction_id PK
        bigint comment_id FK
        bigint user_id FK
        text reaction_type
        timestamptz created_at
    }
    users ||--o{ posts : "author_id"
    posts ||--o{ comments : "post_id"
    users ||--o{ comments : "author_id"
    comments ||--o{ reactions : "comment_id"
    users ||--o{ reactions : "user_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Olaleye_Lateef_301930160_ERDiagram.png)
