// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("comment_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("comment_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "comment_created",
                    "comment_edited"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "reactions"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "reaction_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("comment_events").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "comment_edited",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "reactions",
                    "key": {
                        "reaction_id": 401
                    },
                    "field": "reaction_type",
                    "value": "like"
                }
            ],
            "examples": {
                "moderation_reason": "illustrative moderation_reason"
            }
        }
    },
    {
        "_id": "event_000003",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "comment_created",
        "occurredAt": ISODate("2030-01-01T10:02:00Z"),
        "source": {
            "entity": "reactions",
            "key": {
                "reaction_id": 402
            },
            "snapshot": {
                "reaction_id": 402,
                "comment_id": 302,
                "user_id": 102,
                "reaction_type": "heart",
                "created_at": "2025-02-06T10:00:00Z"
            }
        },
        "embedded": {
            "posts": [
                {
                    "key": {
                        "post_id": 202
                    },
                    "snapshot": {
                        "post_id": 202,
                        "author_id": 102,
                        "body": "Another synthetic post.",
                        "created_at": "2025-02-02T10:00:00Z",
                        "visibility": "members"
                    },
                    "via": [
                        "reactions.comment_id → comments.post_id → posts"
                    ]
                }
            ],
            "users": [
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
                        "reactions.user_id → users",
                        "reactions.comment_id → comments.post_id → posts.author_id → users"
                    ]
                },
                {
                    "key": {
                        "user_id": 103
                    },
                    "snapshot": {
                        "user_id": 103,
                        "handle": "sana",
                        "created_at": "2025-01-12T11:00:00Z"
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
                        "comment_id": 302
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
    },
    {
        "_id": "event_000004",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "comment_edited",
        "occurredAt": ISODate("2030-01-01T10:03:00Z"),
        "source": {
            "entity": "reactions",
            "key": {
                "reaction_id": 402
            },
            "snapshot": {
                "reaction_id": 402,
                "comment_id": 302,
                "user_id": 102,
                "reaction_type": "heart",
                "created_at": "2025-02-06T10:00:00Z"
            }
        },
        "embedded": {
            "posts": [
                {
                    "key": {
                        "post_id": 202
                    },
                    "snapshot": {
                        "post_id": 202,
                        "author_id": 102,
                        "body": "Another synthetic post.",
                        "created_at": "2025-02-02T10:00:00Z",
                        "visibility": "members"
                    },
                    "via": [
                        "reactions.comment_id → comments.post_id → posts"
                    ]
                }
            ],
            "users": [
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
                        "reactions.user_id → users",
                        "reactions.comment_id → comments.post_id → posts.author_id → users"
                    ]
                },
                {
                    "key": {
                        "user_id": 103
                    },
                    "snapshot": {
                        "user_id": 103,
                        "handle": "sana",
                        "created_at": "2025-01-12T11:00:00Z"
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
                        "comment_id": 302
                    },
                    "via": [
                        "reactions.comment_id → comments"
                    ]
                }
            ]
        },
        "details": {
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "reactions",
                    "key": {
                        "reaction_id": 402
                    },
                    "field": "reaction_type",
                    "value": "heart"
                }
            ],
            "examples": {
                "moderation_reason": "illustrative moderation_reason"
            }
        }
    }
]));
  await db.getCollection("comment_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("comment_events").find({"eventType":"comment_created"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("comment_events").find({"source.key.reaction_id":401}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("comment_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("comment_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("comment_events").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("comment_events").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("comment_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
