# MongoDB Complete Reference Guide

> A comprehensive guide covering all commonly used MongoDB functions, operators, and concepts.
> Useful for learning, quick reference, and interview preparation.

---

## Table of Contents

1. [CRUD Operations](#1-crud-operations)
2. [Query Operators](#2-query-operators)
3. [Update Operators](#3-update-operators)
4. [Cursor Methods](#4-cursor-methods)
5. [Aggregation Pipeline](#5-aggregation-pipeline)
6. [Index Operations](#6-index-operations)
7. [Mongoose-Specific Methods (Node.js ODM)](#7-mongoose-specific-methods-nodejs-odm)
8. [Database & Collection Management](#8-database--collection-management)
9. [Schema Design Patterns](#9-schema-design-patterns)
10. [Performance & Optimization](#10-performance--optimization)
11. [Transactions](#11-transactions)
12. [Interview Questions & Concepts](#12-interview-questions--concepts)

---

## 1. CRUD Operations

### 1.1 Create (Insert)

| Method | Description |
|--------|-------------|
| `db.collection.insertOne({doc})` | Inserts a single document into a collection |
| `db.collection.insertMany([docs])` | Inserts multiple documents into a collection |

**Examples:**

```javascript
// insertOne - Inserts a single document
db.users.insertOne({
  name: "John Doe",
  age: 30,
  email: "john@example.com",
  createdAt: new Date()
});
// Returns: { acknowledged: true, insertedId: ObjectId("...") }

// insertMany - Inserts multiple documents at once
db.users.insertMany([
  { name: "Alice", age: 25, city: "New York" },
  { name: "Bob", age: 35, city: "London" },
  { name: "Charlie", age: 28, city: "Paris" }
]);
// Returns: { acknowledged: true, insertedIds: { 0: ObjectId("..."), 1: ObjectId("..."), 2: ObjectId("...") } }

// insertMany with ordered option
// ordered: false → continues inserting even if one fails
db.users.insertMany(
  [{ _id: 1, name: "A" }, { _id: 1, name: "B" }, { _id: 2, name: "C" }],
  { ordered: false }
);
```

---

### 1.2 Read (Find)

| Method | Description |
|--------|-------------|
| `db.collection.find(query, projection)` | Returns a cursor to all matching documents |
| `db.collection.findOne(query, projection)` | Returns the first matching document |
| `db.collection.countDocuments(query)` | Returns count of matching documents |
| `db.collection.distinct(field, query)` | Returns an array of distinct values for a field |
| `db.collection.estimatedDocumentCount()` | Returns an estimated count (faster, uses metadata) |

**Examples:**

```javascript
// find all documents
db.users.find({});

// find with filter
db.users.find({ age: { $gte: 25 } });

// find with projection (include only name, exclude _id)
db.users.find({}, { name: 1, _id: 0 });

// find with exclusion projection
db.users.find({}, { password: 0, __v: 0 });

// findOne - returns first matching document
db.users.findOne({ name: "John" });

// distinct - returns array of unique values
db.users.distinct("city");
// Returns: ["New York", "London", "Paris"]

// distinct with filter
db.users.distinct("city", { age: { $gt: 25 } });

// countDocuments
db.users.countDocuments({ age: { $gt: 20 } });
// Returns: 42

// estimatedDocumentCount (faster, no filter)
db.users.estimatedDocumentCount();
```

---

### 1.3 Update

| Method | Description |
|--------|-------------|
| `db.collection.updateOne(filter, update)` | Updates the first matching document |
| `db.collection.updateMany(filter, update)` | Updates all matching documents |
| `db.collection.replaceOne(filter, replacement)` | Replaces an entire document (except `_id`) |
| `db.collection.findOneAndUpdate(filter, update, options)` | Finds, updates, and returns the document |
| `db.collection.findOneAndReplace(filter, replacement, options)` | Finds, replaces, and returns the document |

**Examples:**

```javascript
// updateOne - updates first matching document
db.users.updateOne(
  { name: "John" },
  { $set: { age: 31, updatedAt: new Date() } }
);
// Returns: { acknowledged: true, matchedCount: 1, modifiedCount: 1 }

// updateMany - updates ALL matching documents
db.users.updateMany(
  { age: { $lt: 30 } },
  { $set: { status: "young" } }
);

// replaceOne - replaces entire document
db.users.replaceOne(
  { name: "John" },
  { name: "John Doe", age: 31, city: "NYC", status: "active" }
);

// findOneAndUpdate - returns the updated document
db.users.findOneAndUpdate(
  { name: "John" },
  { $set: { age: 32 } },
  { returnDocument: "after" } // "before" returns the original
);

// upsert - insert if not found, update if found
db.users.updateOne(
  { email: "new@example.com" },
  { $set: { name: "New User", age: 20 } },
  { upsert: true }
);
```

---

### 1.4 Delete

| Method | Description |
|--------|-------------|
| `db.collection.deleteOne(filter)` | Deletes the first matching document |
| `db.collection.deleteMany(filter)` | Deletes all matching documents |
| `db.collection.findOneAndDelete(filter)` | Finds and deletes a document, returns the deleted doc |
| `db.collection.drop()` | Drops the entire collection |

**Examples:**

```javascript
// deleteOne - deletes first matching document
db.users.deleteOne({ name: "John" });
// Returns: { acknowledged: true, deletedCount: 1 }

// deleteMany - deletes ALL matching documents
db.users.deleteMany({ status: "inactive" });

// deleteMany with no filter - DELETES ALL DOCUMENTS
db.users.deleteMany({});

// findOneAndDelete - returns the deleted document
const deletedUser = db.users.findOneAndDelete({ name: "Bob" });

// drop - removes the entire collection
db.users.drop();
```

---

## 2. Query Operators

### 2.1 Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal to | `{ age: { $eq: 25 } }` |
| `$ne` | Not equal to | `{ age: { $ne: 25 } }` |
| `$gt` | Greater than | `{ age: { $gt: 25 } }` |
| `$gte` | Greater than or equal | `{ age: { $gte: 25 } }` |
| `$lt` | Less than | `{ age: { $lt: 25 } }` |
| `$lte` | Less than or equal | `{ age: { $lte: 25 } }` |
| `$in` | Matches any value in array | `{ status: { $in: ["A", "B"] } }` |
| `$nin` | Matches none of the values | `{ status: { $nin: ["A", "B"] } }` |

**Examples:**

```javascript
// Find users aged exactly 25
db.users.find({ age: { $eq: 25 } });
// Shorthand: db.users.find({ age: 25 });

// Find users NOT aged 25
db.users.find({ age: { $ne: 25 } });

// Find users older than 25
db.users.find({ age: { $gt: 25 } });

// Range query: age between 20 and 30
db.users.find({ age: { $gte: 20, $lte: 30 } });

// Find users in specific cities
db.users.find({ city: { $in: ["New York", "London", "Paris"] } });

// Find users NOT in specific cities
db.users.find({ city: { $nin: ["New York", "London"] } });
```

---

### 2.2 Logical Operators

| Operator | Description |
|----------|-------------|
| `$and` | Joins query clauses with logical AND |
| `$or` | Joins query clauses with logical OR |
| `$not` | Inverts the effect of a query expression |
| `$nor` | Joins query clauses with logical NOR (neither condition is true) |

**Examples:**

```javascript
// $and - both conditions must be true
db.users.find({
  $and: [
    { age: { $gte: 20 } },
    { age: { $lte: 30 } }
  ]
});
// Shorthand (implicit AND):
db.users.find({ age: { $gte: 20, $lte: 30 } });

// $or - at least one condition must be true
db.users.find({
  $or: [
    { status: "active" },
    { age: { $lt: 30 } }
  ]
});

// $not - inverts condition
db.users.find({
  age: { $not: { $gt: 25 } }
});

// $nor - none of the conditions should be true
db.users.find({
  $nor: [
    { status: "inactive" },
    { age: { $lt: 18 } }
  ]
});

// Combining $and with $or
db.users.find({
  $and: [
    { $or: [{ city: "NYC" }, { city: "LA" }] },
    { $or: [{ status: "active" }, { age: { $gt: 25 } }] }
  ]
});
```

---

### 2.3 Element Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$exists` | Checks if field exists | `{ email: { $exists: true } }` |
| `$type` | Checks field's BSON type | `{ age: { $type: "int" } }` |

**Examples:**

```javascript
// Find documents where email field exists
db.users.find({ email: { $exists: true } });

// Find documents where phone field does NOT exist
db.users.find({ phone: { $exists: false } });

// Find documents where age is stored as integer
db.users.find({ age: { $type: "int" } });

// Find documents where name is a string
db.users.find({ name: { $type: "string" } });

// BSON types: "double", "string", "object", "array", "binData",
// "objectId", "bool", "date", "null", "regex", "int", "long", "decimal"
```

---

### 2.4 Array Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$all` | Array contains all specified elements | `{ tags: { $all: ["ssl", "security"] } }` |
| `$elemMatch` | Array element matches all conditions | `{ results: { $elemMatch: { score: { $gt: 80 } } } }` |
| `$size` | Array has specific length | `{ tags: { $size: 3 } }` |

**Examples:**

```javascript
// $all - array must contain ALL specified elements
db.articles.find({
  tags: { $all: ["mongodb", "database"] }
});

// $elemMatch - at least one element matches ALL conditions
db.students.find({
  results: {
    $elemMatch: { subject: "math", score: { $gt: 90 } }
  }
});

// $size - array must have exact length
db.users.find({ hobbies: { $size: 3 } });

// Query array element by index position
db.users.find({ "scores.0": { $gt: 90 } }); // first element > 90

// Query nested array objects
db.orders.find({ "items.product": "Laptop" });
```

---

### 2.5 Evaluation Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$regex` | Regular expression matching | `{ name: { $regex: /^J/i } }` |
| `$text` | Full-text search | `{ $text: { $search: "coffee shop" } }` |
| `$expr` | Aggregation expressions in queries | `{ $expr: { $gt: ["$spent", "$budget"] } }` |
| `$mod` | Modulo operation | `{ qty: { $mod: [4, 0] } }` |
| `$where` | JavaScript expression (avoid in production) | `{ $where: "this.a > this.b" }` |

**Examples:**

```javascript
// $regex - pattern matching
db.users.find({ name: { $regex: /^john/i } }); // starts with "john" (case-insensitive)
db.users.find({ email: { $regex: /@gmail\.com$/ } }); // ends with @gmail.com

// $text - requires text index first
db.articles.createIndex({ content: "text", title: "text" });
db.articles.find({ $text: { $search: "mongodb tutorial" } });

// $text with score sorting
db.articles.find(
  { $text: { $search: "mongodb" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });

// $expr - compare two fields in the same document
db.orders.find({
  $expr: { $gt: ["$totalSpent", "$budget"] }
});

// $mod - find even-aged users
db.users.find({ age: { $mod: [2, 0] } });
```

---

## 3. Update Operators

### 3.1 Field Update Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$set` | Sets a field's value | `{ $set: { name: "John" } }` |
| `$unset` | Removes a field | `{ $unset: { tempField: "" } }` |
| `$inc` | Increments by a value | `{ $inc: { age: 1 } }` |
| `$min` | Updates only if value is less | `{ $min: { lowScore: 50 } }` |
| `$max` | Updates only if value is greater | `{ $max: { highScore: 100 } }` |
| `$mul` | Multiplies a field's value | `{ $mul: { price: 1.1 } }` |
| `$rename` | Renames a field | `{ $rename: { "nmae": "name" } }` |
| `$setOnInsert` | Sets value only during upsert insert | `{ $setOnInsert: { createdAt: new Date() } }` |
| `$currentDate` | Sets field to current date | `{ $currentDate: { updatedAt: true } }` |

**Examples:**

```javascript
// $set - set or update a field
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { name: "Updated Name", "address.city": "New York" } }
);

// $unset - remove a field
db.users.updateOne(
  { _id: ObjectId("...") },
  { $unset: { temporaryField: "", oldField: "" } }
);

// $inc - increment/decrement
db.products.updateOne(
  { _id: ObjectId("...") },
  { $inc: { quantity: -1, totalSold: 1 } } // decrease qty, increase sold
);

// $min / $max
db.scores.updateOne(
  { playerId: 1 },
  { $min: { lowestScore: 45 }, $max: { highestScore: 98 } }
);

// $mul - multiply
db.products.updateMany({}, { $mul: { price: 1.10 } }); // 10% price increase

// $rename
db.users.updateMany({}, { $rename: { "fname": "firstName" } });

// $setOnInsert - only sets during an upsert (when inserting)
db.users.updateOne(
  { email: "new@example.com" },
  {
    $set: { lastLogin: new Date() },
    $setOnInsert: { createdAt: new Date(), loginCount: 0 }
  },
  { upsert: true }
);

// $currentDate
db.users.updateOne(
  { _id: ObjectId("...") },
  { $currentDate: { updatedAt: true, lastModified: { $type: "timestamp" } } }
);
```

---

### 3.2 Array Update Operators

| Operator | Description |
|----------|-------------|
| `$push` | Adds an element to an array |
| `$pull` | Removes elements matching a condition from an array |
| `$pop` | Removes first (`-1`) or last (`1`) element |
| `$addToSet` | Adds to array only if not already present |
| `$each` | Used with `$push`/`$addToSet` to add multiple elements |
| `$sort` | Used with `$push` + `$each` to sort the array |
| `$slice` | Used with `$push` + `$each` to limit array size |
| `$position` | Used with `$push` + `$each` to specify insert position |
| `$pullAll` | Removes all matching values from an array |
| `$` | Positional operator - updates first matching array element |
| `$[]` | All positional operator - updates all array elements |
| `$[<identifier>]` | Filtered positional operator |

**Examples:**

```javascript
// $push - add element to array
db.users.updateOne(
  { _id: ObjectId("...") },
  { $push: { hobbies: "reading" } }
);

// $push with $each - add multiple elements
db.users.updateOne(
  { _id: ObjectId("...") },
  { $push: { scores: { $each: [85, 90, 78] } } }
);

// $push with $each, $sort, and $slice
db.users.updateOne(
  { _id: ObjectId("...") },
  {
    $push: {
      scores: {
        $each: [95, 88],
        $sort: -1,       // sort descending
        $slice: 5         // keep only top 5
      }
    }
  }
);

// $addToSet - add only if unique
db.users.updateOne(
  { _id: ObjectId("...") },
  { $addToSet: { tags: "mongodb" } } // won't add if "mongodb" already exists
);

// $addToSet with $each
db.users.updateOne(
  { _id: ObjectId("...") },
  { $addToSet: { tags: { $each: ["node", "express", "mongodb"] } } }
);

// $pull - remove elements matching condition
db.users.updateOne(
  { _id: ObjectId("...") },
  { $pull: { scores: { $lt: 60 } } } // remove all scores below 60
);

// $pullAll - remove specific values
db.users.updateOne(
  { _id: ObjectId("...") },
  { $pullAll: { tags: ["old", "deprecated"] } }
);

// $pop - remove first or last element
db.users.updateOne({ _id: ObjectId("...") }, { $pop: { scores: 1 } });  // remove last
db.users.updateOne({ _id: ObjectId("...") }, { $pop: { scores: -1 } }); // remove first

// $ (positional) - update first matching array element
db.users.updateOne(
  { _id: ObjectId("..."), "grades.subject": "math" },
  { $set: { "grades.$.score": 95 } }
);

// $[] (all positional) - update ALL array elements
db.users.updateMany(
  { _id: ObjectId("...") },
  { $inc: { "scores.$[]": 5 } } // add 5 to every score
);

// $[<identifier>] (filtered positional) with arrayFilters
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { "grades.$[elem].passed": true } },
  { arrayFilters: [{ "elem.score": { $gte: 60 } }] }
);
```

---

## 4. Cursor Methods

Methods chained with `find()` to modify the result set.

| Method | Description |
|--------|-------------|
| `.sort(spec)` | Sorts results (`1` = ascending, `-1` = descending) |
| `.limit(n)` | Limits number of results returned |
| `.skip(n)` | Skips first `n` results |
| `.count()` | Returns count (deprecated, use `countDocuments`) |
| `.toArray()` | Converts cursor to array (driver-specific) |
| `.forEach(fn)` | Iterates over each document |
| `.map(fn)` | Maps each document to a new value |
| `.pretty()` | Formats output (MongoDB Shell only) |
| `.explain(mode)` | Returns query execution information |
| `.hint(index)` | Forces use of a specific index |
| `.min(doc)` / `.max(doc)` | Sets index bounds |
| `.batchSize(n)` | Sets number of documents per batch |

**Examples:**

```javascript
// Sort ascending by name, descending by age
db.users.find().sort({ name: 1, age: -1 });

// Pagination: page 3, 10 items per page
db.users.find().skip(20).limit(10);

// Chain multiple methods
db.users.find({ status: "active" })
  .sort({ createdAt: -1 })
  .skip(0)
  .limit(20)
  .pretty();

// explain - analyze query performance
db.users.find({ age: { $gt: 25 } }).explain("executionStats");

// hint - force specific index
db.users.find({ age: 25 }).hint({ age: 1 });

// forEach
db.users.find().forEach(function(doc) {
  print(doc.name + " - " + doc.age);
});

// map
const names = db.users.find().map(function(doc) {
  return doc.name;
});
```

---

## 5. Aggregation Pipeline

The aggregation pipeline is the **most powerful** feature of MongoDB and a **top interview topic**.

### 5.1 Pipeline Stages

| Stage | Description |
|-------|-------------|
| `$match` | Filters documents (like `find`) |
| `$group` | Groups documents by a key and applies accumulators |
| `$project` | Reshapes documents (include/exclude/compute fields) |
| `$sort` | Sorts documents |
| `$limit` | Limits number of documents |
| `$skip` | Skips documents |
| `$unwind` | Deconstructs an array into individual documents |
| `$lookup` | Left outer join with another collection |
| `$addFields` / `$set` | Adds new computed fields |
| `$count` | Counts total documents in pipeline |
| `$out` | Writes results to a new collection |
| `$merge` | Merges results into an existing collection |
| `$facet` | Runs multiple sub-pipelines in parallel |
| `$bucket` | Groups documents into specified buckets |
| `$bucketAuto` | Automatically creates evenly distributed buckets |
| `$replaceRoot` | Replaces the root document |
| `$replaceWith` | Alias for `$replaceRoot` |
| `$sample` | Randomly selects N documents |
| `$redact` | Restricts document content based on conditions |
| `$unionWith` | Combines results from two collections |
| `$graphLookup` | Recursive lookup (tree/graph traversal) |
| `$sortByCount` | Groups and counts, then sorts by count descending |

---

### 5.2 Group Accumulators

| Accumulator | Description |
|-------------|-------------|
| `$sum` | Sum of values |
| `$avg` | Average of values |
| `$min` | Minimum value |
| `$max` | Maximum value |
| `$first` | First value in group |
| `$last` | Last value in group |
| `$push` | Pushes all values into an array |
| `$addToSet` | Pushes unique values into an array |
| `$count` | Counts documents in group |
| `$stdDevPop` | Population standard deviation |
| `$stdDevSamp` | Sample standard deviation |

---

### 5.3 Aggregation Examples

#### Basic $match + $group

```javascript
// Count users by city with average age
db.users.aggregate([
  { $match: { status: "active" } },
  {
    $group: {
      _id: "$city",
      totalUsers: { $sum: 1 },
      avgAge: { $avg: "$age" },
      minAge: { $min: "$age" },
      maxAge: { $max: "$age" },
      userNames: { $push: "$name" }
    }
  },
  { $sort: { totalUsers: -1 } },
  { $limit: 10 }
]);
```

#### $project - Reshape Documents

```javascript
db.users.aggregate([
  {
    $project: {
      _id: 0,
      fullName: { $concat: ["$firstName", " ", "$lastName"] },
      birthYear: { $subtract: [2026, "$age"] },
      isAdult: { $gte: ["$age", 18] },
      nameLength: { $strLenCP: "$name" },
      upperName: { $toUpper: "$name" }
    }
  }
]);
```

#### $lookup - JOIN Collections

```javascript
// LEFT OUTER JOIN: orders with user details
db.orders.aggregate([
  {
    $lookup: {
      from: "users",           // collection to join
      localField: "userId",    // field from orders
      foreignField: "_id",     // field from users
      as: "userDetails"        // output array field name
    }
  },
  { $unwind: "$userDetails" }, // flatten the array to object
  {
    $project: {
      orderNumber: 1,
      total: 1,
      "userDetails.name": 1,
      "userDetails.email": 1
    }
  }
]);

// $lookup with pipeline (more flexible)
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      let: { orderItems: "$items" },
      pipeline: [
        { $match: { $expr: { $in: ["$_id", "$$orderItems"] } } },
        { $project: { name: 1, price: 1 } }
      ],
      as: "productDetails"
    }
  }
]);
```

#### $unwind - Flatten Arrays

```javascript
// Count occurrences of each tag
db.articles.aggregate([
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// $unwind with preserveNullAndEmptyArrays
db.articles.aggregate([
  {
    $unwind: {
      path: "$tags",
      preserveNullAndEmptyArrays: true, // keep docs with no tags
      includeArrayIndex: "tagIndex"     // adds index field
    }
  }
]);
```

#### $facet - Multiple Pipelines

```javascript
db.products.aggregate([
  {
    $facet: {
      // Pipeline 1: Price statistics
      priceStats: [
        {
          $group: {
            _id: null,
            avgPrice: { $avg: "$price" },
            maxPrice: { $max: "$price" },
            minPrice: { $min: "$price" }
          }
        }
      ],
      // Pipeline 2: Count by category
      byCategory: [
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ],
      // Pipeline 3: Top 5 expensive products
      topExpensive: [
        { $sort: { price: -1 } },
        { $limit: 5 },
        { $project: { name: 1, price: 1 } }
      ]
    }
  }
]);
```

#### $bucket - Bucket Grouping

```javascript
db.users.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 18, 30, 50, 100],
      default: "Unknown",
      output: {
        count: { $sum: 1 },
        names: { $push: "$name" }
      }
    }
  }
]);
// Output: { _id: 0, count: 5 }, { _id: 18, count: 20 }, { _id: 30, count: 15 }, ...
```

#### $graphLookup - Recursive Lookup

```javascript
// Find all reports (direct and indirect) for a manager
db.employees.aggregate([
  { $match: { name: "CEO" } },
  {
    $graphLookup: {
      from: "employees",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "managerId",
      as: "allReports",
      maxDepth: 5,
      depthField: "level"
    }
  }
]);
```

#### $addFields / $set

```javascript
db.orders.aggregate([
  {
    $addFields: {
      totalWithTax: { $multiply: ["$total", 1.18] },
      itemCount: { $size: "$items" },
      isHighValue: { $gte: ["$total", 1000] }
    }
  }
]);
```

#### $sortByCount

```javascript
// Shorthand for $group + $sort
db.articles.aggregate([
  { $unwind: "$tags" },
  { $sortByCount: "$tags" }
]);
// Equivalent to:
// { $group: { _id: "$tags", count: { $sum: 1 } } },
// { $sort: { count: -1 } }
```

#### $sample - Random Documents

```javascript
// Get 5 random documents
db.products.aggregate([
  { $sample: { size: 5 } }
]);
```

#### Aggregation Expression Operators

```javascript
db.orders.aggregate([
  {
    $project: {
      // String operators
      upperName: { $toUpper: "$customerName" },
      nameLen: { $strLenCP: "$customerName" },
      firstThree: { $substr: ["$customerName", 0, 3] },

      // Date operators
      year: { $year: "$orderDate" },
      month: { $month: "$orderDate" },
      dayOfWeek: { $dayOfWeek: "$orderDate" },

      // Conditional operators
      status: {
        $cond: {
          if: { $gte: ["$total", 100] },
          then: "premium",
          else: "regular"
        }
      },
      category: {
        $switch: {
          branches: [
            { case: { $lt: ["$total", 50] }, then: "small" },
            { case: { $lt: ["$total", 200] }, then: "medium" }
          ],
          default: "large"
        }
      },
      discount: { $ifNull: ["$discount", 0] },

      // Math operators
      rounded: { $round: ["$price", 2] },
      ceiling: { $ceil: "$price" },
      floor: { $floor: "$price" },
      absolute: { $abs: "$balance" },

      // Array operators in expressions
      firstItem: { $arrayElemAt: ["$items", 0] },
      itemCount: { $size: "$items" },
      hasItem: { $in: ["laptop", "$items"] }
    }
  }
]);
```

---

## 6. Index Operations

### 6.1 Index Types

| Index Type | Description |
|------------|-------------|
| **Single Field** | Index on one field |
| **Compound** | Index on multiple fields |
| **Multikey** | Index on array fields (auto-detected) |
| **Text** | Full-text search index |
| **Hashed** | Hash-based index (for sharding) |
| **Geospatial (2dsphere / 2d)** | Location-based queries |
| **TTL** | Auto-expiring documents |
| **Unique** | Enforces uniqueness |
| **Partial** | Index with a filter condition |
| **Sparse** | Indexes only documents that contain the field |
| **Wildcard** | Indexes all fields or matching fields |

### 6.2 Index Methods

| Method | Description |
|--------|-------------|
| `db.collection.createIndex(keys, options)` | Creates an index |
| `db.collection.createIndexes([indexSpecs])` | Creates multiple indexes |
| `db.collection.getIndexes()` | Lists all indexes |
| `db.collection.dropIndex(name)` | Drops a specific index |
| `db.collection.dropIndexes()` | Drops all non-`_id` indexes |

### 6.3 Index Examples

```javascript
// Single field index (ascending)
db.users.createIndex({ email: 1 });

// Single field index (descending)
db.users.createIndex({ createdAt: -1 });

// Compound index
db.users.createIndex({ city: 1, age: -1 });

// Unique index
db.users.createIndex({ email: 1 }, { unique: true });

// Text index (for full-text search)
db.articles.createIndex({ title: "text", content: "text" });

// TTL index - auto-delete documents after 3600 seconds
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// Partial index - only index active users
db.users.createIndex(
  { email: 1 },
  { partialFilterExpression: { status: "active" } }
);

// Sparse index - skip documents without the field
db.users.createIndex({ phone: 1 }, { sparse: true });

// Hashed index (for equality queries and sharding)
db.users.createIndex({ email: "hashed" });

// 2dsphere index (geospatial)
db.places.createIndex({ location: "2dsphere" });

// Wildcard index
db.products.createIndex({ "attributes.$**": 1 });

// List all indexes
db.users.getIndexes();

// Drop a specific index
db.users.dropIndex("email_1");

// Drop all indexes (except _id)
db.users.dropIndexes();

// Create index in background (for large collections)
db.users.createIndex({ name: 1 }, { background: true });
```

---

## 7. Mongoose-Specific Methods (Node.js ODM)

### 7.1 Model Methods

| Method | Description |
|--------|-------------|
| `Model.create(doc)` | Creates and saves document(s) |
| `Model.find(filter)` | Finds all matching documents |
| `Model.findById(id)` | Finds document by `_id` |
| `Model.findOne(filter)` | Finds first matching document |
| `Model.findByIdAndUpdate(id, update, options)` | Finds by ID, updates, returns document |
| `Model.findByIdAndDelete(id)` | Finds by ID and deletes |
| `Model.findOneAndUpdate(filter, update, options)` | Finds one, updates, returns document |
| `Model.findOneAndDelete(filter)` | Finds one and deletes |
| `Model.updateOne(filter, update)` | Updates first match (no return) |
| `Model.updateMany(filter, update)` | Updates all matches |
| `Model.deleteOne(filter)` | Deletes first match |
| `Model.deleteMany(filter)` | Deletes all matches |
| `Model.countDocuments(filter)` | Counts matching documents |
| `Model.exists(filter)` | Returns `{ _id }` if exists, `null` otherwise |
| `Model.aggregate(pipeline)` | Runs aggregation pipeline |
| `Model.bulkWrite(operations)` | Performs bulk operations |
| `Model.watch()` | Opens a change stream |
| `Model.distinct(field)` | Returns distinct values |
| `Model.estimatedDocumentCount()` | Fast estimated count |

### 7.2 Query Helpers (Chainable)

| Method | Description |
|--------|-------------|
| `.select(fields)` | Selects specific fields |
| `.sort(spec)` | Sorts results |
| `.limit(n)` | Limits results |
| `.skip(n)` | Skips results |
| `.populate(path, select)` | Populates referenced documents (JOIN) |
| `.lean()` | Returns plain JS objects (faster) |
| `.exec()` | Executes the query (returns Promise) |
| `.where(field)` | Starts a query condition |
| `.equals(val)` | Sets equality condition |
| `.gt(val)` / `.gte(val)` | Greater than / greater than or equal |
| `.lt(val)` / `.lte(val)` | Less than / less than or equal |
| `.in(arr)` / `.nin(arr)` | In / not in |
| `.regex(pattern)` | Regular expression match |
| `.slice(field, count)` | Limits array field length |
| `.cursor()` | Returns a cursor for streaming |

### 7.3 Document Methods

| Method | Description |
|--------|-------------|
| `doc.save()` | Saves the document (triggers middleware) |
| `doc.remove()` | Removes the document |
| `doc.toObject()` | Converts to plain JS object |
| `doc.toJSON()` | Converts to JSON |
| `doc.validate()` | Runs validation |
| `doc.isModified(path)` | Checks if a field was modified |
| `doc.isNew` | True if document hasn't been saved yet |
| `doc.populate(path)` | Populates references |
| `doc.set(path, value)` | Sets a field value |
| `doc.get(path)` | Gets a field value |

### 7.4 Mongoose Examples

```javascript
const mongoose = require('mongoose');

// --- Schema Definition ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age: { type: Number, min: 0, max: 150 },
  role: { type: String, enum: ['user', 'admin', 'guide'], default: 'user' },
  password: { type: String, required: true, minlength: 8, select: false },
  hobbies: [String],
  address: {
    city: String,
    country: String
  },
  createdAt: { type: Date, default: Date.now },
  tours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }]
});

const User = mongoose.model('User', userSchema);

// --- CRUD Operations ---

// Create
const user = await User.create({
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  password: "password123"
});

// Find all with chaining
const users = await User.find({ age: { $gte: 18 } })
  .select('name email age')    // only these fields
  .sort({ name: 1 })          // sort by name ascending
  .skip(0)                     // skip 0 documents
  .limit(10)                   // return 10 documents
  .lean();                     // return plain JS objects

// Find by ID
const user = await User.findById('64abc123...');

// Find one
const admin = await User.findOne({ role: 'admin' });

// Populate (JOIN)
const userWithTours = await User.findById(id)
  .populate('tours', 'name duration price');

// Nested populate
const tour = await Tour.findById(id)
  .populate({
    path: 'reviews',
    populate: { path: 'user', select: 'name photo' }
  });

// Update
const updated = await User.findByIdAndUpdate(
  id,
  { $set: { name: "Updated Name" } },
  { new: true, runValidators: true }
);

// Delete
await User.findByIdAndDelete(id);

// Exists
const exists = await User.exists({ email: "john@example.com" });
// Returns: { _id: ObjectId("...") } or null

// Count
const count = await User.countDocuments({ role: 'admin' });

// Aggregation through Mongoose
const stats = await User.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $group: { _id: "$role", count: { $sum: 1 }, avgAge: { $avg: "$age" } } }
]);

// Where chaining
const results = await User.find()
  .where('age').gte(18).lte(65)
  .where('role').equals('user')
  .sort('-createdAt')
  .limit(20);

// Bulk Write
await User.bulkWrite([
  { insertOne: { document: { name: "New User", email: "new@test.com" } } },
  { updateOne: { filter: { email: "old@test.com" }, update: { $set: { status: "inactive" } } } },
  { deleteOne: { filter: { email: "remove@test.com" } } }
]);
```

### 7.5 Mongoose Middleware (Hooks)

```javascript
// Pre-save middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Post-save middleware
userSchema.post('save', function(doc, next) {
  console.log(`User ${doc.name} was saved`);
  next();
});

// Query middleware
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// Aggregation middleware
userSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { active: { $ne: false } } });
  next();
});
```

### 7.6 Mongoose Virtual Properties

```javascript
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});
```

### 7.7 Mongoose Static & Instance Methods

```javascript
// Instance method
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Usage
const user = await User.findByEmail("john@example.com");
const isValid = await user.correctPassword("password123");
```

---

## 8. Database & Collection Management

```javascript
// Show all databases
show dbs

// Switch to / create a database
use myDatabase

// Show current database
db

// Show all collections
show collections

// Create collection with options
db.createCollection("logs", {
  capped: true,      // fixed-size collection
  size: 5242880,     // max size in bytes (5MB)
  max: 5000          // max number of documents
});

// Get database stats
db.stats()

// Get collection stats
db.users.stats()

// Drop a collection
db.users.drop()

// Drop entire database
db.dropDatabase()

// Rename a collection
db.users.renameCollection("customers")

// Copy database (mongodump/mongorestore)
// mongodump --db=mydb --out=./backup
// mongorestore --db=mydb ./backup/mydb

// Import/Export JSON
// mongoimport --db=mydb --collection=users --file=users.json --jsonArray
// mongoexport --db=mydb --collection=users --out=users.json --jsonArray
```

---

## 9. Schema Design Patterns

### 9.1 Embedding vs Referencing

```javascript
// ✅ EMBEDDING (Denormalization) - Data used together
// Best for: 1:1 or 1:FEW relationships, data always accessed together
{
  name: "John",
  address: {              // embedded document
    street: "123 Main St",
    city: "New York",
    zip: "10001"
  }
}

// ✅ REFERENCING (Normalization) - Data used separately
// Best for: 1:MANY or MANY:MANY relationships, large subdocuments
{
  name: "Tour Package",
  reviews: [               // array of references
    ObjectId("review1"),
    ObjectId("review2")
  ]
}

// ✅ CHILD REFERENCING - Parent stores child IDs
// Tour document
{ _id: 1, name: "Tour A", reviews: [ObjectId("r1"), ObjectId("r2")] }

// ✅ PARENT REFERENCING - Child stores parent ID (preferred for large arrays)
// Review document
{ _id: "r1", tour: ObjectId("1"), text: "Great tour!" }

// ✅ TWO-WAY REFERENCING - Both reference each other
// Use when you need to query from both directions
```

### 9.2 Common Patterns

| Pattern | Use Case |
|---------|----------|
| **Subset Pattern** | Store most accessed subset, full data elsewhere |
| **Computed Pattern** | Pre-compute aggregations, store results |
| **Bucket Pattern** | Group related data (IoT, time-series) |
| **Schema Versioning** | Add `schemaVersion` field for migrations |
| **Extended Reference** | Store frequently accessed ref data alongside reference |
| **Outlier Pattern** | Handle edge cases with overflow documents |

---

## 10. Performance & Optimization

### 10.1 Query Optimization

```javascript
// Use explain to analyze queries
db.users.find({ age: { $gt: 25 } }).explain("executionStats");

// Key metrics to look at:
// - totalDocsExamined: should be close to nReturned
// - executionTimeMillis: execution time
// - stage: IXSCAN (good) vs COLLSCAN (bad - full collection scan)

// Covered Query - query fully satisfied by index
db.users.createIndex({ email: 1, name: 1 });
db.users.find({ email: "john@test.com" }, { email: 1, name: 1, _id: 0 });
// This is a COVERED QUERY - no document fetch needed!
```

### 10.2 Performance Tips

| Tip | Description |
|-----|-------------|
| Create indexes for frequent queries | Use `explain()` to verify |
| Use projection | Only return fields you need |
| Use `.lean()` in Mongoose | Returns plain objects, skips Mongoose overhead |
| Avoid `$where` and `$regex` without index | Very slow on large collections |
| Use `$match` early in aggregation | Reduces documents processed |
| Use compound indexes wisely | Follow ESR rule (Equality, Sort, Range) |
| Limit results | Always use `.limit()` for large collections |
| Use `countDocuments` over `count()` | `count()` is deprecated |
| Avoid large `$in` arrays | Performance degrades with large arrays |
| Use `bulkWrite` for batch operations | Much faster than individual operations |

---

## 11. Transactions

```javascript
// Multi-document transactions (MongoDB 4.0+ for replica sets)
const session = await mongoose.startSession();
session.startTransaction();

try {
  const user = await User.create([{ name: "John" }], { session });
  await Account.create([{ userId: user[0]._id, balance: 0 }], { session });

  await session.commitTransaction();
  console.log("Transaction committed");
} catch (error) {
  await session.abortTransaction();
  console.log("Transaction aborted:", error.message);
} finally {
  session.endSession();
}

// Using withTransaction helper
await session.withTransaction(async () => {
  await User.create([{ name: "Alice" }], { session });
  await Order.create([{ user: "Alice", total: 100 }], { session });
});
```

---

## 12. Interview Questions & Concepts

### 12.1 Key Concepts

| Concept | Explanation |
|---------|-------------|
| **`_id` field** | Auto-generated `ObjectId` (12 bytes: timestamp + machine + PID + counter). Always indexed, immutable. |
| **BSON** | Binary JSON - MongoDB's binary-encoded format. Supports more types than JSON. |
| **Replica Set** | Group of MongoDB instances maintaining the same data. Provides redundancy and high availability. |
| **Sharding** | Horizontal scaling by distributing data across multiple machines (shards). |
| **Shard Key** | The field used to distribute data across shards. Choose carefully - immutable after creation. |
| **Capped Collection** | Fixed-size collection that automatically overwrites oldest entries. Used for logs, caches. |
| **Write Concern** | Level of acknowledgment requested from MongoDB for write operations. |
| **Read Concern** | Level of isolation for read operations. |
| **Read Preference** | How reads are routed in a replica set (primary, secondary, nearest). |
| **Journaling** | Write-ahead logging for crash recovery. |
| **Oplog** | Operations log used by replica sets for replication. |
| **WiredTiger** | Default storage engine since MongoDB 3.2. Supports compression and encryption. |
| **Change Streams** | Real-time notifications on data changes (insert, update, delete). |
| **GridFS** | Specification for storing files larger than 16MB BSON document limit. |
| **TTL Index** | Time-to-live index that auto-deletes documents after a specified time. |
| **Covered Query** | A query fully satisfied by an index without examining any documents. |
| **Collation** | Language-specific rules for string comparison (case sensitivity, accent marks). |

### 12.2 Common Interview Questions

**Q1: What is the difference between MongoDB and SQL databases?**

| Feature | MongoDB | SQL (e.g., MySQL) |
|---------|---------|-----|
| Data Model | Document (BSON/JSON) | Table (Rows & Columns) |
| Schema | Flexible/Dynamic | Fixed/Rigid |
| Relationships | Embedding + Referencing | JOINs with Foreign Keys |
| Scaling | Horizontal (sharding) | Vertical (bigger server) |
| Transactions | Multi-doc (v4.0+) | Full ACID |
| Query Language | MQL (MongoDB Query Language) | SQL |
| Best For | Unstructured/semi-structured data | Structured data with complex relationships |

**Q2: When should you embed vs reference?**

- **Embed** when: Data is accessed together, 1:1 or 1:few relationships, data doesn't change frequently
- **Reference** when: Data is accessed independently, 1:many or many:many, data changes frequently, document would exceed 16MB

**Q3: What is the Aggregation Pipeline?**

- A framework for data processing through sequential stages
- Each stage transforms documents and passes them to the next
- Stages include: `$match`, `$group`, `$project`, `$sort`, `$lookup`, `$unwind`, etc.
- More powerful and performant than Map-Reduce

**Q4: How do indexes improve performance?**

- Indexes store a small portion of data in a traversable structure (B-tree)
- Without index: Collection scan (COLLSCAN) - reads every document
- With index: Index scan (IXSCAN) - reads only relevant documents
- Trade-off: Faster reads, slower writes (indexes must be updated)

**Q5: What is a Replica Set?**

- A group of MongoDB instances that maintain the same dataset
- Components: 1 Primary (reads/writes) + 2+ Secondaries (replicate data)
- Provides: High availability, automatic failover, data redundancy
- If primary goes down, an election chooses a new primary

**Q6: What is Sharding?**

- Horizontal partitioning of data across multiple servers
- Each shard holds a subset of data
- Components: Shards, Config Servers, Query Routers (mongos)
- Shard Key determines data distribution
- Enables handling large datasets and high throughput

**Q7: Explain ObjectId structure**

```
|  4 bytes   |  5 bytes  |  3 bytes  |
| timestamp  | random    | counter   |
|            | value     |           |
```

- Total: 12 bytes (24 hex characters)
- Timestamp: Unix timestamp of creation
- Random: Machine-specific random value
- Counter: Incrementing counter

**Q8: What is the 16MB document size limit?**

- Maximum BSON document size is 16MB
- For larger files, use GridFS
- Design schema to avoid hitting this limit (use referencing for large arrays)

---

## Quick Reference Cheat Sheet

```javascript
// ========== CRUD ==========
db.col.insertOne({})                    // Insert one
db.col.insertMany([{}, {}])             // Insert many
db.col.find({ key: value })             // Find
db.col.findOne({ key: value })          // Find one
db.col.updateOne({filter}, {$set:{}})   // Update one
db.col.updateMany({filter}, {$set:{}})  // Update many
db.col.deleteOne({filter})              // Delete one
db.col.deleteMany({filter})             // Delete many

// ========== QUERY ==========
{ field: { $eq: val } }                 // Equal
{ field: { $ne: val } }                 // Not equal
{ field: { $gt: val } }                 // Greater than
{ field: { $gte: val } }               // Greater than or equal
{ field: { $lt: val } }                // Less than
{ field: { $lte: val } }               // Less than or equal
{ field: { $in: [v1, v2] } }           // In array
{ field: { $nin: [v1, v2] } }          // Not in array
{ $and: [{}, {}] }                      // AND
{ $or: [{}, {}] }                       // OR
{ field: { $exists: true } }            // Field exists
{ field: { $regex: /pattern/i } }       // Regex

// ========== UPDATE ==========
{ $set: { field: val } }               // Set value
{ $unset: { field: "" } }              // Remove field
{ $inc: { field: 1 } }                 // Increment
{ $push: { arr: val } }                // Add to array
{ $pull: { arr: val } }                // Remove from array
{ $addToSet: { arr: val } }            // Add unique to array

// ========== AGGREGATION ==========
{ $match: { field: val } }             // Filter
{ $group: { _id: "$f", n: {$sum:1} }} // Group
{ $project: { field: 1 } }             // Select fields
{ $sort: { field: -1 } }               // Sort
{ $limit: 10 }                         // Limit
{ $skip: 20 }                          // Skip
{ $unwind: "$arrayField" }             // Flatten array
{ $lookup: { from, localField, foreignField, as } }  // JOIN
{ $addFields: { new: expr } }          // Add fields
{ $count: "total" }                    // Count

// ========== INDEX ==========
db.col.createIndex({ f: 1 })           // Create index
db.col.createIndex({ f: 1 }, { unique: true })  // Unique
db.col.getIndexes()                     // List indexes
db.col.dropIndex("name")               // Drop index
```

---

> **Last Updated:** February 2026
>
> **Author:** MongoDB Reference Guide for Node.js/Express Developers
>
> **Tip:** Practice these commands in MongoDB Shell (`mongosh`) or MongoDB Compass for hands-on learning.