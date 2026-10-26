# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection comment_events for comment_created and comment_edited events. These are fictional event examples based on comments, posts, users, reactions.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related posts, users details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "comment_created",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "reactions",
        "key": {
            "reaction_id": 401
        },
        "snapshot": {
            "reaction_id": 401,
            "comment_id": 301,
            "user_id": 101,
            "reaction_type": "like",
            "created_at": "2025-02-05T09:00:00Z"
        }
    },
    "embedded": {
        "posts": [
            {
                "key": {
                    "post_id": 201
                },
                "snapshot": {
                    "post_id": 201,
                    "author_id": 101,
                    "body": "A synthetic post.",
                    "created_at": "2025-02-01T09:00:00Z",
                    "visibility": "public"
                },
                "via": [
                    "reactions.comment_id → comments.post_id → posts"
                ]
            }
        ],
        "users": [
            {
                "key": {
                    "user_id": 101
                },
                "snapshot": {
                    "user_id": 101,
                    "handle": "mira",
                    "created_at": "2025-01-10T09:00:00Z"
                },
                "via": [
                    "reactions.user_id → users",
                    "reactions.comment_id → comments.post_id → posts.author_id → users"
                ]
            },
            {
                "key": {
                    "user_id": 102
                },
                "snapshot": {
                    "user_id": 102,
                    "handle": "noah",
                    "created_at": "2025-01-11T10:00:00Z"
                },
                "via": [
                    "reactions.comment_id → comments.author_id → users"
                ]
            }
        ]
    },
    "references": {
        "comments": [
            {
                "key": {
                    "comment_id": 301
                },
                "via": [
                    "reactions.comment_id → comments"
                ]
            }
        ]
    },
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 2 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 4 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("comment_events").find({"eventType":"comment_created"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "comment_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "reaction_id": 401
    }
  },
  {
    "_id": "event_000003",
    "eventType": "comment_created",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "reaction_id": 402
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("comment_events").find({"source.key.reaction_id":401}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "comment_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "reaction_id": 401
    }
  },
  {
    "_id": "event_000002",
    "eventType": "comment_edited",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "reaction_id": 401
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("comment_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "comment_created",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "reaction_id": 401
    }
  },
  {
    "_id": "event_000002",
    "eventType": "comment_edited",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "reaction_id": 401
    }
  },
  {
    "_id": "event_000003",
    "eventType": "comment_created",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "reaction_id": 402
    }
  },
  {
    "_id": "event_000004",
    "eventType": "comment_edited",
    "occurredAt": {
      "$date": "2030-01-01T10:03:00Z"
    },
    "source": {
      "reaction_id": 402
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("comment_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| comment_created | 2 |
| comment_edited | 2 |

## Validation and suitability

MongoDB inserted 4 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 4 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run Olaleye_Lateef_301930160_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/Olaleye_Lateef_301930160_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

