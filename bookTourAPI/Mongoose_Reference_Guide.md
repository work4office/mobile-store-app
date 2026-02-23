# Mongoose Complete Reference Guide

> A comprehensive guide covering all commonly used Mongoose functions, schema features, middleware, and concepts.
> Useful for learning, quick reference, and interview preparation.

---

## Table of Contents

1. [Connection & Setup](#1-connection--setup)
2. [Schema Definition](#2-schema-definition)
3. [Schema Types & Validators](#3-schema-types--validators)
4. [Model CRUD Operations](#4-model-crud-operations)
5. [Query Building & Chaining](#5-query-building--chaining)
6. [Population (JOIN)](#6-population-join)
7. [Middleware (Hooks)](#7-middleware-hooks)
8. [Virtuals](#8-virtuals)
9. [Static & Instance Methods](#9-static--instance-methods)
10. [Aggregation](#10-aggregation)
11. [Transactions](#11-transactions)
12. [Plugins](#12-plugins)
13. [Indexes](#13-indexes)
14. [Error Handling](#14-error-handling)
15. [Performance & Optimization](#15-performance--optimization)
16. [Advanced Patterns](#16-advanced-patterns)
17. [Interview Questions & Concepts](#17-interview-questions--concepts)

---

## 1. Connection & Setup

### 1.1 Installation

```bash
npm install mongoose
```

### 1.2 Basic Connection

```javascript
const mongoose = require('mongoose');

// Basic connection
await mongoose.connect('mongodb://localhost:27017/myDatabase');

// Connection with options (recommended for production)
await mongoose.connect('mongodb://localhost:27017/myDatabase', {
  useNewUrlParser: true,        // Use new URL string parser
  useUnifiedTopology: true,     // Use new Server Discovery & Monitoring engine
  autoIndex: true,              // Build indexes on connect (disable in production)
  maxPoolSize: 10,              // Maximum number of connections in the pool
  minPoolSize: 2,               // Minimum number of connections in the pool
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  socketTimeoutMS: 45000,       // Close sockets after 45s of inactivity
  family: 4,                    // Use IPv4, skip trying IPv6
  heartbeatFrequencyMS: 10000,  // How often to check server status
  retryWrites: true,            // Retry failed writes
  w: 'majority'                 // Write concern
});

// Connection with MongoDB Atlas
await mongoose.connect(
  'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDatabase?retryWrites=true&w=majority'
);

// Using environment variables (recommended)
await mongoose.connect(process.env.MONGODB_URI);
```

### 1.3 Connection Events

```javascript
const db = mongoose.connection;

db.on('connected', () => console.log('✅ MongoDB connected'));
db.on('error', (err) => console.error('❌ MongoDB connection error:', err));
db.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));
db.on('reconnected', () => console.log('🔄 MongoDB reconnected'));

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});
```

### 1.4 Multiple Connections

```javascript
// Create separate connections
const conn1 = mongoose.createConnection('mongodb://localhost:27017/db1');
const conn2 = mongoose.createConnection('mongodb://localhost:27017/db2');

// Register models on specific connections
const UserModel = conn1.model('User', userSchema);
const LogModel = conn2.model('Log', logSchema);
```

### 1.5 Connection State

```javascript
// mongoose.connection.readyState
// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting

console.log(mongoose.connection.readyState); // 1 if connected
```

---

## 2. Schema Definition

### 2.1 Basic Schema

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  age: Number,
  email: String,
  isActive: Boolean,
  createdAt: Date
});

const User = mongoose.model('User', userSchema);
```

### 2.2 Detailed Schema with Options

```javascript
const userSchema = new Schema(
  {
    // String field with all options
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      index: true
    },

    // Email with unique constraint
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },

    // Number with min/max
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [150, 'Age cannot exceed 150'],
      default: 0
    },

    // Enum field
    role: {
      type: String,
      enum: {
        values: ['user', 'admin', 'guide', 'lead-guide'],
        message: '{VALUE} is not a valid role'
      },
      default: 'user'
    },

    // Password - excluded from queries by default
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false  // Never returned in queries
    },

    // Date with default
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true  // Cannot be changed after creation
    },

    // Array of strings
    hobbies: [String],

    // Array of numbers with default
    scores: {
      type: [Number],
      default: []
    },

    // Nested object (subdocument)
    address: {
      street: String,
      city: { type: String, required: true },
      state: String,
      zipCode: String,
      country: { type: String, default: 'US' }
    },

    // Array of subdocuments
    education: [{
      school: { type: String, required: true },
      degree: String,
      year: Number,
      current: { type: Boolean, default: false }
    }],

    // Reference to another model (ObjectId)
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },

    // Array of references
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],

    // Mixed type (any data) - requires markModified() to save changes
    metadata: {
      type: Schema.Types.Mixed
    },

    // Map type (key-value pairs)
    socialMedia: {
      type: Map,
      of: String
      // { twitter: '@john', github: 'johndoe' }
    },

    // Decimal128 for precise decimal (financial data)
    balance: {
      type: Schema.Types.Decimal128
    },

    // Buffer (binary data)
    avatar: Buffer,

    // UUID
    uniqueCode: {
      type: Schema.Types.UUID
    }
  },
  {
    // Schema options (second argument)
    timestamps: true,           // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true }, // Include virtuals when converting to JSON
    toObject: { virtuals: true }, // Include virtuals when converting to Object
    versionKey: '__v',          // Version key field name (default: __v)
    // versionKey: false,       // Disable version key
    collection: 'users',       // Explicit collection name
    strict: true,              // Only save fields defined in schema (default)
    // strict: false,           // Allow saving fields not in schema
    strictQuery: true,         // Apply strict mode to queries
    minimize: true,            // Remove empty objects (default: true)
    id: true,                  // Create virtual 'id' getter for _id
    _id: true,                 // Auto-create _id field (default: true)
    autoIndex: true,           // Auto-build indexes
    selectPopulatedPaths: true // Automatically select populated paths
  }
);

const User = mongoose.model('User', userSchema);
```

### 2.3 Schema Types Summary

| SchemaType | JavaScript Type | Description |
|------------|----------------|-------------|
| `String` | `String` | Standard string |
| `Number` | `Number` | Standard number |
| `Boolean` | `Boolean` | True/false |
| `Date` | `Date` | Date object |
| `Buffer` | `Buffer` | Binary data |
| `Schema.Types.ObjectId` | `ObjectId` | MongoDB ObjectId |
| `Schema.Types.Mixed` | `Any` | Any type (schema-less) |
| `[String]` / `Array` | `Array` | Array of values |
| `Schema.Types.Decimal128` | `Decimal128` | High-precision decimal |
| `Map` | `Map` | Key-value pairs |
| `Schema` (nested) | `Object` | Nested subdocument |
| `Schema.Types.UUID` | `UUID` | UUID type |
| `BigInt` | `BigInt` | BigInt type |

---

## 3. Schema Types & Validators

### 3.1 Built-in Validators

#### All Types

| Validator | Description | Example |
|-----------|-------------|---------|
| `required` | Field must have a value | `required: true` or `required: [true, 'msg']` |
| `default` | Default value | `default: 'user'` or `default: Date.now` |
| `validate` | Custom validator function | `validate: { validator: fn, message: 'msg' }` |
| `immutable` | Cannot be changed after creation | `immutable: true` |
| `select` | Include/exclude from queries by default | `select: false` |
| `index` | Create an index on this field | `index: true` |
| `unique` | Create a unique index | `unique: true` |
| `sparse` | Create a sparse index | `sparse: true` |

#### String Validators

| Validator | Description | Example |
|-----------|-------------|---------|
| `minlength` | Minimum string length | `minlength: [2, 'Too short']` |
| `maxlength` | Maximum string length | `maxlength: [100, 'Too long']` |
| `match` | RegExp the value must match | `match: [/regex/, 'Invalid format']` |
| `enum` | Allowed values | `enum: ['a', 'b', 'c']` |
| `trim` | Remove whitespace from both ends | `trim: true` |
| `lowercase` | Convert to lowercase | `lowercase: true` |
| `uppercase` | Convert to uppercase | `uppercase: true` |

#### Number Validators

| Validator | Description | Example |
|-----------|-------------|---------|
| `min` | Minimum value | `min: [0, 'Must be positive']` |
| `max` | Maximum value | `max: [100, 'Too high']` |
| `enum` | Allowed values | `enum: [1, 2, 3, 5, 8]` |

#### Date Validators

| Validator | Description | Example |
|-----------|-------------|---------|
| `min` | Minimum date | `min: '2020-01-01'` |
| `max` | Maximum date | `max: Date.now` |

### 3.2 Custom Validators

```javascript
const tourSchema = new Schema({
  // Simple custom validator
  price: {
    type: Number,
    validate: {
      validator: function(val) {
        return val >= 0;
      },
      message: 'Price ({VALUE}) must be non-negative'
    }
  },

  // Cross-field validation
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        // 'this' refers to the document (only on CREATE, not UPDATE)
        return val < this.price;
      },
      message: 'Discount ({VALUE}) must be less than price'
    }
  },

  // Async custom validator
  slug: {
    type: String,
    validate: {
      validator: async function(val) {
        const count = await mongoose.model('Tour').countDocuments({ slug: val });
        return count === 0;
      },
      message: 'Slug already exists'
    }
  },

  // Multiple validators
  phone: {
    type: String,
    validate: [
      {
        validator: (v) => /^\d{10}$/.test(v),
        message: 'Phone must be 10 digits'
      },
      {
        validator: (v) => v.startsWith('9') || v.startsWith('8'),
        message: 'Phone must start with 8 or 9'
      }
    ]
  },

  // Using external validation library (e.g., validator.js)
  email: {
    type: String,
    validate: {
      validator: require('validator').isEmail,
      message: 'Invalid email format'
    }
  }
});
```

### 3.3 Conditional Required

```javascript
const orderSchema = new Schema({
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'upi']
  },

  // Required only if paymentMethod is 'card'
  cardNumber: {
    type: String,
    required: function() {
      return this.paymentMethod === 'card';
    }
  },

  // Required based on another field
  shippingAddress: {
    type: String,
    required: [
      function() { return this.deliveryType === 'shipping'; },
      'Shipping address is required for delivery orders'
    ]
  }
});
```

### 3.4 Schema-Level Validation

```javascript
const eventSchema = new Schema({
  startDate: Date,
  endDate: Date
});

// Validate at schema level (runs after field-level validators)
eventSchema.pre('validate', function(next) {
  if (this.endDate <= this.startDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
  next();
});

// Or use schema.path
eventSchema.path('endDate').validate(function(value) {
  return value > this.startDate;
}, 'End date must be after start date');
```

---

## 4. Model CRUD Operations

### 4.1 Create

| Method | Description |
|--------|-------------|
| `Model.create(doc)` | Creates and saves one or more documents |
| `Model.create([docs])` | Creates multiple documents |
| `Model.insertMany([docs])` | Inserts multiple documents (faster, less validation) |
| `new Model(doc).save()` | Creates instance then saves (triggers full middleware) |

```javascript
// Model.create() - single document
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

// Model.create() - multiple documents
const users = await User.create([
  { name: 'Alice', email: 'alice@example.com', age: 25 },
  { name: 'Bob', email: 'bob@example.com', age: 35 }
]);

// new Model().save() - more control, triggers all middleware
const user = new User({
  name: 'Jane',
  email: 'jane@example.com',
  age: 28
});
await user.save(); // Triggers pre('save') and post('save') hooks

// insertMany - faster for bulk inserts, fewer hooks triggered
const users = await User.insertMany([
  { name: 'User1', email: 'u1@test.com' },
  { name: 'User2', email: 'u2@test.com' },
  { name: 'User3', email: 'u3@test.com' }
], {
  ordered: true,       // Stop on first error (default: true)
  rawResult: false,    // Return raw MongoDB result
  lean: false          // Return lean objects
});

// Create with session (for transactions)
const user = await User.create([{ name: 'Txn User' }], { session });
```

---

### 4.2 Read (Find)

| Method | Description |
|--------|-------------|
| `Model.find(filter, projection)` | Returns array of all matching documents |
| `Model.findById(id, projection)` | Finds document by `_id` |
| `Model.findOne(filter, projection)` | Returns first matching document |
| `Model.countDocuments(filter)` | Returns count of matching documents |
| `Model.estimatedDocumentCount()` | Fast estimated count (uses metadata) |
| `Model.exists(filter)` | Returns `{ _id }` if exists, `null` otherwise |
| `Model.distinct(field, filter)` | Returns array of distinct values |

```javascript
// find() - returns array (empty array if no match)
const users = await User.find({});                          // All documents
const activeUsers = await User.find({ isActive: true });    // With filter
const names = await User.find({}, 'name email');            // With projection (string)
const names2 = await User.find({}, { name: 1, email: 1 }); // With projection (object)

// findById() - returns single document or null
const user = await User.findById('64abc123def456...');
const user2 = await User.findById(id).select('name email');

// findOne() - returns single document or null
const admin = await User.findOne({ role: 'admin' });
const latest = await User.findOne({}).sort({ createdAt: -1 });

// countDocuments() - accurate count with filter
const count = await User.countDocuments({ role: 'admin' });

// estimatedDocumentCount() - fast count (no filter support)
const total = await User.estimatedDocumentCount();

// exists() - lightweight existence check
const exists = await User.exists({ email: 'john@example.com' });
// Returns: { _id: ObjectId("...") } or null
if (exists) console.log('User exists with ID:', exists._id);

// distinct() - unique values
const cities = await User.distinct('address.city');
const activeCities = await User.distinct('address.city', { isActive: true });
```

---

### 4.3 Update

| Method | Description |
|--------|-------------|
| `Model.findByIdAndUpdate(id, update, options)` | Finds by ID, updates, returns document |
| `Model.findOneAndUpdate(filter, update, options)` | Finds one, updates, returns document |
| `Model.updateOne(filter, update, options)` | Updates first match (returns result, not document) |
| `Model.updateMany(filter, update, options)` | Updates all matches (returns result) |
| `Model.replaceOne(filter, replacement)` | Replaces entire document |
| `doc.save()` | Saves changes on a document instance |
| `Model.findOneAndReplace(filter, replacement, options)` | Finds one and replaces |

```javascript
// findByIdAndUpdate - returns the document
const updated = await User.findByIdAndUpdate(
  id,
  { $set: { name: 'Updated Name', age: 31 } },
  {
    new: true,            // Return updated document (default: false = return original)
    runValidators: true,  // Run schema validators on update (default: false)
    select: 'name email age',  // Select specific fields
    lean: true,           // Return plain object
    upsert: false,        // Create if not found (default: false)
    timestamps: true,     // Update timestamps (default: true)
    overwrite: false      // Replace entire document if true
  }
);

// findOneAndUpdate - more flexible filter
const user = await User.findOneAndUpdate(
  { email: 'john@example.com' },
  { $inc: { loginCount: 1 }, $set: { lastLogin: new Date() } },
  { new: true, runValidators: true }
);

// updateOne - returns update result, NOT the document
const result = await User.updateOne(
  { _id: id },
  { $set: { isActive: false } }
);
// result: { acknowledged: true, matchedCount: 1, modifiedCount: 1 }

// updateMany - updates all matching documents
const result = await User.updateMany(
  { isActive: false, lastLogin: { $lt: new Date('2025-01-01') } },
  { $set: { status: 'archived' } }
);
// result: { acknowledged: true, matchedCount: 15, modifiedCount: 15 }

// doc.save() - triggers full middleware and validation
const user = await User.findById(id);
user.name = 'New Name';
user.age = 32;
await user.save(); // Triggers pre('save'), post('save'), validators

// Upsert - create if not found
const user = await User.findOneAndUpdate(
  { email: 'new@example.com' },
  {
    $set: { name: 'New User', lastLogin: new Date() },
    $setOnInsert: { createdAt: new Date(), role: 'user' }
  },
  { upsert: true, new: true, runValidators: true }
);

// replaceOne - replaces entire document (except _id)
await User.replaceOne(
  { _id: id },
  { name: 'Complete Replacement', email: 'new@test.com', age: 25 }
);
```

#### Key Difference: `save()` vs `findByIdAndUpdate()`

| Feature | `save()` | `findByIdAndUpdate()` |
|---------|----------|----------------------|
| Triggers `pre('save')` | ✅ Yes | ❌ No |
| Triggers validators | ✅ Always | ⚠️ Only with `runValidators: true` |
| `this` in validators | ✅ References document | ❌ References query |
| Requires fetching first | ✅ Yes (find + save) | ❌ No (1 operation) |
| Performance | Slower (2 queries) | Faster (1 query) |
| Cross-field validation | ✅ Works | ❌ Doesn't work |

---

### 4.4 Delete

| Method | Description |
|--------|-------------|
| `Model.findByIdAndDelete(id)` | Finds by ID and deletes, returns deleted doc |
| `Model.findOneAndDelete(filter)` | Finds one and deletes, returns deleted doc |
| `Model.deleteOne(filter)` | Deletes first match (returns result) |
| `Model.deleteMany(filter)` | Deletes all matches (returns result) |
| `doc.deleteOne()` | Deletes a document instance |

```javascript
// findByIdAndDelete - returns the deleted document
const deleted = await User.findByIdAndDelete(id);
if (!deleted) console.log('No document found with that ID');

// findOneAndDelete - returns the deleted document
const deleted = await User.findOneAndDelete({
  email: 'remove@example.com'
});

// deleteOne - returns deletion result, NOT the document
const result = await User.deleteOne({ _id: id });
// result: { acknowledged: true, deletedCount: 1 }

// deleteMany - deletes all matching documents
const result = await User.deleteMany({ isActive: false });
// result: { acknowledged: true, deletedCount: 47 }

// Delete all documents in collection
await User.deleteMany({});

// Document instance delete
const user = await User.findById(id);
await user.deleteOne(); // Triggers middleware

// DEPRECATED: doc.remove() - use doc.deleteOne() instead
```

---

### 4.5 Bulk Operations

```javascript
// bulkWrite - perform mixed operations efficiently
const result = await User.bulkWrite([
  {
    insertOne: {
      document: { name: 'Bulk User', email: 'bulk@test.com', age: 25 }
    }
  },
  {
    updateOne: {
      filter: { email: 'john@test.com' },
      update: { $set: { isActive: false } }
    }
  },
  {
    updateMany: {
      filter: { age: { $lt: 18 } },
      update: { $set: { status: 'minor' } }
    }
  },
  {
    deleteOne: {
      filter: { email: 'remove@test.com' }
    }
  },
  {
    replaceOne: {
      filter: { email: 'replace@test.com' },
      replacement: { name: 'Replaced', email: 'replace@test.com', age: 30 }
    }
  }
], {
  ordered: true  // Execute in order, stop on error (default: true)
});

// result:
// {
//   insertedCount: 1,
//   matchedCount: 3,
//   modifiedCount: 3,
//   deletedCount: 1,
//   upsertedCount: 0
// }
```

---

## 5. Query Building & Chaining

### 5.1 Query Methods (Chainable)

| Method | Description | Example |
|--------|-------------|---------|
| `.select(fields)` | Select specific fields | `.select('name email')` or `.select('-password')` |
| `.sort(spec)` | Sort results | `.sort('-createdAt name')` or `.sort({ age: -1 })` |
| `.limit(n)` | Limit number of results | `.limit(10)` |
| `.skip(n)` | Skip first N results | `.skip(20)` |
| `.lean()` | Return plain JS objects (faster) | `.lean()` |
| `.populate(path)` | Populate references | `.populate('author')` |
| `.exec()` | Execute query (returns Promise) | `.exec()` |
| `.where(field)` | Start a query chain | `.where('age')` |
| `.equals(val)` | Equal to | `.where('name').equals('John')` |
| `.gt(val)` | Greater than | `.where('age').gt(18)` |
| `.gte(val)` | Greater than or equal | `.where('age').gte(18)` |
| `.lt(val)` | Less than | `.where('age').lt(65)` |
| `.lte(val)` | Less than or equal | `.where('age').lte(65)` |
| `.in(arr)` | In array | `.where('role').in(['admin', 'user'])` |
| `.nin(arr)` | Not in array | `.where('status').nin(['banned'])` |
| `.ne(val)` | Not equal | `.where('status').ne('deleted')` |
| `.regex(pattern)` | Regular expression | `.where('name').regex(/^J/i)` |
| `.exists(bool)` | Field existence | `.where('phone').exists(true)` |
| `.slice(field, count)` | Limit array field | `.slice('comments', 5)` |
| `.or(conditions)` | OR query | `.or([{ a: 1 }, { b: 2 }])` |
| `.and(conditions)` | AND query | `.and([{ a: 1 }, { b: 2 }])` |
| `.nor(conditions)` | NOR query | `.nor([{ a: 1 }])` |
| `.cursor()` | Returns a cursor for streaming | `.cursor()` |
| `.explain(verbosity)` | Returns query execution info | `.explain('executionStats')` |
| `.hint(index)` | Force index usage | `.hint({ age: 1 })` |
| `.collation(options)` | Set collation options | `.collation({ locale: 'en' })` |
| `.allowDiskUse(bool)` | Allow disk use for large sorts | `.allowDiskUse(true)` |
| `.maxTimeMS(ms)` | Set max execution time | `.maxTimeMS(5000)` |
| `.read(pref)` | Set read preference | `.read('secondary')` |
| `.setOptions(opts)` | Set multiple query options | `.setOptions({ lean: true })` |
| `.countDocuments()` | Count (on query) | `User.find({active: true}).countDocuments()` |

### 5.2 Chaining Examples

```javascript
// Comprehensive query chaining
const users = await User.find({ isActive: true })
  .select('name email age role createdAt')
  .sort({ createdAt: -1, name: 1 })
  .skip(20)
  .limit(10)
  .populate('company', 'name address')
  .lean()
  .exec();

// Using where() chain
const results = await User.find()
  .where('age').gte(18).lte(65)
  .where('role').equals('user')
  .where('name').regex(/^J/i)
  .where('isActive').equals(true)
  .select('name email age')
  .sort('-createdAt')
  .limit(20);

// OR conditions
const users = await User.find()
  .or([
    { role: 'admin' },
    { age: { $gte: 30 } }
  ])
  .select('name role age');

// Complex query
const results = await User.find({
    isActive: true,
    $or: [
      { role: { $in: ['admin', 'lead-guide'] } },
      { age: { $gte: 25, $lte: 60 } }
    ]
  })
  .select('-password -__v')
  .sort({ role: 1, name: 1 })
  .skip(0)
  .limit(50)
  .populate({
    path: 'company',
    select: 'name industry'
  })
  .lean();

// Explain query for debugging
const explanation = await User.find({ age: { $gt: 25 } })
  .explain('executionStats');
console.log(explanation); // Shows query plan, index usage, etc.

// Cursor-based iteration (memory efficient for large datasets)
const cursor = User.find({ isActive: true }).cursor();
for await (const user of cursor) {
  console.log(user.name);
}

// Batch processing with cursor
const cursor = User.find({}).cursor({ batchSize: 100 });
cursor.on('data', (doc) => { /* process doc */ });
cursor.on('end', () => { /* done */ });
cursor.on('error', (err) => { /* handle error */ });
```

### 5.3 Pagination Helper

```javascript
// Reusable pagination
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering: { price: { gte: 100 } } → { price: { $gte: 100 } }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

// Usage:
const features = new APIFeatures(Tour.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const tours = await features.query;
```

### 5.4 MongoDB Query Operators Reference

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal to | `{ age: { $eq: 25 } }` |
| `$ne` | Not equal | `{ status: { $ne: 'deleted' } }` |
| `$gt` | Greater than | `{ price: { $gt: 100 } }` |
| `$gte` | Greater than or equal | `{ age: { $gte: 18 } }` |
| `$lt` | Less than | `{ stock: { $lt: 10 } }` |
| `$lte` | Less than or equal | `{ rating: { $lte: 3 } }` |
| `$in` | Matches any value in array | `{ role: { $in: ['admin', 'user'] } }` |
| `$nin` | Matches none of the values | `{ status: { $nin: ['banned'] } }` |
| `$and` | Logical AND | `{ $and: [{ a: 1 }, { b: 2 }] }` |
| `$or` | Logical OR | `{ $or: [{ a: 1 }, { b: 2 }] }` |
| `$not` | Logical NOT | `{ age: { $not: { $gt: 50 } } }` |
| `$nor` | Logical NOR | `{ $nor: [{ a: 1 }, { b: 2 }] }` |
| `$exists` | Field exists | `{ phone: { $exists: true } }` |
| `$type` | Field is of type | `{ age: { $type: 'number' } }` |
| `$regex` | Regular expression | `{ name: { $regex: /^J/i } }` |
| `$all` | Array contains all | `{ tags: { $all: ['a', 'b'] } }` |
| `$elemMatch` | Array element matches | `{ scores: { $elemMatch: { $gt: 80 } } }` |
| `$size` | Array length | `{ tags: { $size: 3 } }` |

#### Update Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$set` | Set field value | `{ $set: { name: 'New' } }` |
| `$unset` | Remove field | `{ $unset: { temp: '' } }` |
| `$inc` | Increment value | `{ $inc: { count: 1 } }` |
| `$mul` | Multiply value | `{ $mul: { price: 1.1 } }` |
| `$min` | Update if less than | `{ $min: { lowScore: 50 } }` |
| `$max` | Update if greater than | `{ $max: { highScore: 99 } }` |
| `$rename` | Rename field | `{ $rename: { old: 'new' } }` |
| `$push` | Add to array | `{ $push: { tags: 'new' } }` |
| `$pull` | Remove from array | `{ $pull: { tags: 'old' } }` |
| `$addToSet` | Add unique to array | `{ $addToSet: { tags: 'unique' } }` |
| `$pop` | Remove first/last from array | `{ $pop: { arr: 1 } }` (last) |
| `$each` | Use with $push/$addToSet | `{ $push: { tags: { $each: ['a','b'] } } }` |
| `$slice` | Limit array size with $push | `{ $push: { log: { $each: [item], $slice: -100 } } }` |

---

## 6. Population (JOIN)

### 6.1 Basic Population

```javascript
// Schema with reference
const tourSchema = new Schema({
  name: String,
  guides: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Simple populate
const tour = await Tour.findById(id).populate('guides');

// Populate with field selection
const tour = await Tour.findById(id)
  .populate('guides', 'name email role');

// Populate with options object
const tour = await Tour.findById(id)
  .populate({
    path: 'guides',
    select: 'name email role -_id',
    match: { isActive: true },       // Filter populated docs
    options: { sort: { name: 1 } }   // Sort populated docs
  });
```

### 6.2 Multiple Population

```javascript
// Multiple populate calls
const tour = await Tour.findById(id)
  .populate('guides', 'name email')
  .populate('reviews', 'rating comment')
  .populate('createdBy', 'name');

// Or pass an array
const tour = await Tour.findById(id)
  .populate([
    { path: 'guides', select: 'name email' },
    { path: 'reviews', select: 'rating comment' }
  ]);
```

### 6.3 Nested Population

```javascript
// Populate within populated documents
const tour = await Tour.findById(id)
  .populate({
    path: 'reviews',
    populate: {
      path: 'user',             // Populate user inside each review
      select: 'name photo'
    }
  });

// Deep nesting
const doc = await Order.findById(id)
  .populate({
    path: 'items.product',
    populate: {
      path: 'category',
      populate: { path: 'parent' }
    }
  });
```

### 6.4 Virtual Populate

```javascript
// Parent schema - Tour (no child reference stored)
const tourSchema = new Schema({
  name: String,
  // ... other fields
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate - creates virtual 'reviews' field
tourSchema.virtual('reviews', {
  ref: 'Review',           // The model to use
  foreignField: 'tour',    // Field on Review that references Tour
  localField: '_id'        // Field on Tour to match
});

// Child schema - Review (has reference to Tour)
const reviewSchema = new Schema({
  review: String,
  rating: Number,
  tour: {
    type: Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Usage
const tour = await Tour.findById(id).populate('reviews');
// tour.reviews → array of Review documents

// Virtual populate with count
tourSchema.virtual('reviewCount', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
  count: true              // Only get the count
});
const tour = await Tour.findById(id).populate('reviewCount');
// tour.reviewCount → 42
```

### 6.5 Auto-Populate with Middleware

```javascript
// Always populate guides on find queries
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: 'name photo role'
  });
  next();
});

// Or use a plugin like mongoose-autopopulate
// npm install mongoose-autopopulate
const autopopulate = require('mongoose-autopopulate');

const tourSchema = new Schema({
  guides: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: { select: 'name email' }
  }]
});
tourSchema.plugin(autopopulate);
```

---

## 7. Middleware (Hooks)

### 7.1 Document Middleware

Runs on `save()`, `validate()`, `deleteOne()`, `updateOne()` (on document).

```javascript
// PRE save - runs before document is saved
tourSchema.pre('save', function(next) {
  // 'this' refers to the document being saved
  this.slug = slugify(this.name, { lower: true });
  this.updatedAt = Date.now();
  next();
});

// PRE save - async version
tourSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // Remove passwordConfirm field
  next();
});

// POST save - runs after document is saved
tourSchema.post('save', function(doc, next) {
  // 'doc' is the saved document
  console.log(`${doc.name} was saved successfully`);
  next();
});

// PRE validate
tourSchema.pre('validate', function(next) {
  if (this.priceDiscount >= this.price) {
    this.invalidate('priceDiscount', 'Discount must be less than price');
  }
  next();
});

// PRE deleteOne (document)
tourSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  // 'this' is the document being deleted
  await Review.deleteMany({ tour: this._id });
  next();
});
```

### 7.2 Query Middleware

Runs on `find`, `findOne`, `findOneAndUpdate`, `findOneAndDelete`, `countDocuments`, etc.

```javascript
// PRE find - runs before any find query
tourSchema.pre(/^find/, function(next) {
  // 'this' refers to the query object
  this.find({ secretTour: { $ne: true } }); // Exclude secret tours
  this.start = Date.now();
  next();
});

// POST find - runs after query executes
tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);
  console.log(`Found ${docs.length} documents`);
  next();
});

// PRE findOneAndUpdate
tourSchema.pre('findOneAndUpdate', function(next) {
  // 'this' is the query, NOT the document
  this.set({ updatedAt: Date.now() });
  next();
});

// PRE findOneAndDelete
tourSchema.pre('findOneAndDelete', async function(next) {
  // Store the document for use in post middleware
  this.deletedDoc = await this.model.findOne(this.getFilter());
  next();
});

tourSchema.post('findOneAndDelete', async function(doc, next) {
  // 'doc' is the deleted document
  if (doc) {
    await Review.deleteMany({ tour: doc._id });
  }
  next();
});
```

### 7.3 Aggregation Middleware

```javascript
// PRE aggregate
tourSchema.pre('aggregate', function(next) {
  // 'this' refers to the aggregation object
  // Add a $match stage at the beginning of the pipeline
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } }
  });
  console.log('Pipeline:', this.pipeline());
  next();
});

// POST aggregate
tourSchema.post('aggregate', function(result, next) {
  console.log(`Aggregation returned ${result.length} results`);
  next();
});
```

### 7.4 Middleware with Error Handling

```javascript
// Error handling middleware (has 3+ parameters)
tourSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Duplicate key error: A document with that value already exists'));
  } else {
    next(error);
  }
});

// Error handling for queries
tourSchema.post('findOneAndUpdate', function(error, doc, next) {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(e => e.message);
    next(new Error(`Validation failed: ${messages.join(', ')}`));
  } else {
    next(error);
  }
});
```

### 7.5 Middleware Summary

| Type | Trigger Methods | `this` Context |
|------|----------------|----------------|
| **Document** | `save`, `validate`, `deleteOne`, `updateOne` | The document |
| **Query** | `find`, `findOne`, `findOneAndUpdate`, `findOneAndDelete`, `countDocuments`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany` | The query |
| **Aggregation** | `aggregate` | The aggregation object |
| **Model** | `insertMany` | The model |

> **Important:** `findByIdAndUpdate()` and `findByIdAndDelete()` are shorthand for `findOneAndUpdate()` and `findOneAndDelete()` respectively, so the same middleware applies.

---

## 8. Virtuals

### 8.1 Basic Virtuals

```javascript
const tourSchema = new Schema({
  name: String,
  duration: Number,      // duration in days
  price: Number,
  priceDiscount: Number,
  startDates: [Date]
}, {
  toJSON: { virtuals: true },   // Include virtuals in JSON output
  toObject: { virtuals: true }  // Include virtuals in object output
});

// Simple computed virtual
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Virtual with setter
tourSchema.virtual('fullName')
  .get(function() {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function(value) {
    const parts = value.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  });

// Usage
const tour = await Tour.findById(id);
console.log(tour.durationWeeks);  // Computed on access, not stored in DB
```

### 8.2 Virtual Populate

```javascript
// See Section 6.4 for full virtual populate examples
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});
```

> **Key Points:**
> - Virtuals are NOT stored in the database
> - Cannot be used in queries (e.g., `Tour.find({ durationWeeks: 1 })` won't work)
> - Must enable `toJSON: { virtuals: true }` and/or `toObject: { virtuals: true }` in schema options
> - Useful for computed properties and reverse population

---

## 9. Static & Instance Methods

### 9.1 Instance Methods

Methods available on each document instance.

```javascript
const userSchema = new Schema({
  name: String,
  email: String,
  password: { type: String, select: false }
});

// Define instance method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false; // Not changed
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
  return resetToken;
};

// Usage
const user = await User.findById(id).select('+password');
const isCorrect = await user.correctPassword('password123', user.password);

const resetToken = user.createPasswordResetToken();
await user.save({ validateBeforeSave: false });
```

### 9.2 Static Methods

Methods available on the Model itself.

```javascript
const tourSchema = new Schema({
  name: String,
  price: Number,
  ratingsAverage: Number,
  difficulty: String
});

// Define static method
tourSchema.statics.calcAverageRatings = async function(tourId) {
  // 'this' refers to the Model
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  }
};

tourSchema.statics.getTopCheap = async function(limit = 5) {
  return await this.find()
    .sort({ price: 1, ratingsAverage: -1 })
    .limit(limit)
    .select('name price ratingsAverage');
};

tourSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({ difficulty });
};

// Usage
await Review.calcAverageRatings(tourId);
const cheapTours = await Tour.getTopCheap(3);
const easyTours = await Tour.findByDifficulty('easy');
```

### 9.3 Comparison

| Feature | Instance Methods | Static Methods |
|---------|-----------------|----------------|
| Defined on | `schema.methods` | `schema.statics` |
| Called on | Document instance | Model class |
| `this` refers to | The document | The Model |
| Access to | Document fields | Model (query/aggregate) |
| Example | `user.correctPassword()` | `User.calcAverageRatings()` |

---

## 10. Aggregation

### 10.1 Aggregation Pipeline Basics

```javascript
// The aggregation pipeline processes documents through stages
const stats = await Tour.aggregate([
  // Stage 1: Filter
  { $match: { ratingsAverage: { $gte: 4.5 } } },

  // Stage 2: Group
  {
    $group: {
      _id: '$difficulty',           // Group by field (null = all docs)
      numTours: { $sum: 1 },        // Count documents
      numRatings: { $sum: '$ratingsQuantity' },
      avgRating: { $avg: '$ratingsAverage' },
      avgPrice: { $avg: '$price' },
      minPrice: { $min: '$price' },
      maxPrice: { $max: '$price' },
      totalRevenue: { $sum: { $multiply: ['$price', '$participants'] } }
    }
  },

  // Stage 3: Sort (use grouped field names)
  { $sort: { avgPrice: 1 } },

  // Stage 4: Filter again (on grouped results)
  { $match: { _id: { $ne: 'easy' } } }
]);
```

### 10.2 Common Aggregation Stages

| Stage | Description | Example |
|-------|-------------|---------|
| `$match` | Filter documents | `{ $match: { status: 'active' } }` |
| `$group` | Group by field & accumulate | `{ $group: { _id: '$field', count: { $sum: 1 } } }` |
| `$sort` | Sort results | `{ $sort: { count: -1 } }` |
| `$project` | Reshape documents | `{ $project: { name: 1, upper: { $toUpper: '$name' } } }` |
| `$limit` | Limit results | `{ $limit: 10 }` |
| `$skip` | Skip results | `{ $skip: 20 }` |
| `$unwind` | Deconstruct array field | `{ $unwind: '$tags' }` |
| `$lookup` | Left outer join | See below |
| `$addFields` | Add computed fields | `{ $addFields: { total: { $sum: '$items.price' } } }` |
| `$count` | Count documents | `{ $count: 'totalDocuments' }` |
| `$facet` | Multiple pipelines | See below |
| `$bucket` | Auto-categorize | See below |
| `$out` | Write results to collection | `{ $out: 'resultCollection' }` |
| `$merge` | Merge into collection | `{ $merge: { into: 'target' } }` |
| `$replaceRoot` | Replace root document | `{ $replaceRoot: { newRoot: '$subdoc' } }` |
| `$sample` | Random documents | `{ $sample: { size: 5 } }` |
| `$set` | Alias for $addFields | `{ $set: { fullName: { $concat: ['$first', ' ', '$last'] } } }` |

### 10.3 Aggregation Operators

#### Accumulator Operators (used in `$group`)

| Operator | Description |
|----------|-------------|
| `$sum` | Sum of values |
| `$avg` | Average of values |
| `$min` | Minimum value |
| `$max` | Maximum value |
| `$first` | First value in group |
| `$last` | Last value in group |
| `$push` | Push values into array |
| `$addToSet` | Push unique values into array |
| `$stdDevPop` | Population standard deviation |
| `$stdDevSamp` | Sample standard deviation |

### 10.4 Advanced Aggregation Examples

```javascript
// $unwind - flatten arrays
const monthlyPlan = await Tour.aggregate([
  { $unwind: '$startDates' },
  {
    $match: {
      startDates: {
        $gte: new Date('2024-01-01'),
        $lte: new Date('2024-12-31')
      }
    }
  },
  {
    $group: {
      _id: { $month: '$startDates' },
      numTours: { $sum: 1 },
      tours: { $push: '$name' }
    }
  },
  { $addFields: { month: '$_id' } },
  { $project: { _id: 0 } },
  { $sort: { numTours: -1 } },
  { $limit: 12 }
]);

// $lookup - join collections (like SQL JOIN)
const toursWithReviews = await Tour.aggregate([
  {
    $lookup: {
      from: 'reviews',        // Collection name (NOT model name)
      localField: '_id',      // Field in Tour
      foreignField: 'tour',   // Field in Review
      as: 'reviews'           // Output array field name
    }
  },
  {
    $addFields: {
      reviewCount: { $size: '$reviews' },
      avgRating: { $avg: '$reviews.rating' }
    }
  }
]);

// $facet - multiple aggregation pipelines in one query
const stats = await Tour.aggregate([
  {
    $facet: {
      priceStats: [
        { $group: { _id: null, avg: { $avg: '$price' }, min: { $min: '$price' }, max: { $max: '$price' } } }
      ],
      difficultyStats: [
        { $group: { _id: '$difficulty', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ],
      ratingDistribution: [
        {
          $bucket: {
            groupBy: '$ratingsAverage',
            boundaries: [0, 2, 3, 4, 4.5, 5],
            default: 'Other',
            output: { count: { $sum: 1 }, tours: { $push: '$name' } }
          }
        }
      ]
    }
  }
]);

// Geospatial aggregation
const distances = await Tour.aggregate([
  {
    $geoNear: {
      near: { type: 'Point', coordinates: [lng, lat] },
      distanceField: 'distance',
      distanceMultiplier: 0.001, // Convert to km
      spherical: true
    }
  },
  { $project: { name: 1, distance: 1 } },
  { $sort: { distance: 1 } }
]);
```

---

## 11. Transactions

### 11.1 Basic Transaction

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // All operations within the transaction
  const user = await User.create([{ name: 'John', email: 'john@test.com' }], { session });

  const booking = await Booking.create([{
    user: user[0]._id,
    tour: tourId,
    price: 299
  }], { session });

  // Update tour availability
  await Tour.findByIdAndUpdate(
    tourId,
    { $inc: { participants: 1 } },
    { session, new: true }
  );

  // If everything succeeds, commit the transaction
  await session.commitTransaction();
  console.log('Transaction committed successfully');
} catch (error) {
  // If any operation fails, abort the entire transaction
  await session.abortTransaction();
  console.error('Transaction aborted:', error.message);
  throw error;
} finally {
  session.endSession();
}
```

### 11.2 Using withTransaction() Helper

```javascript
const session = await mongoose.startSession();

try {
  // withTransaction automatically handles commit and abort
  const result = await session.withTransaction(async () => {
    const user = await User.create([{ name: 'Jane' }], { session });
    const order = await Order.create([{ user: user[0]._id, total: 100 }], { session });

    await Product.updateOne(
      { _id: productId },
      { $inc: { stock: -1 } },
      { session }
    );

    return { user: user[0], order: order[0] };
  });

  console.log('Transaction result:', result);
} finally {
  session.endSession();
}
```

### 11.3 Transaction Options

```javascript
const session = await mongoose.startSession();
session.startTransaction({
  readConcern: { level: 'snapshot' },        // Isolation level
  writeConcern: { w: 'majority', j: true },  // Write acknowledgment
  readPreference: 'primary',                  // Read from primary
  maxCommitTimeMS: 5000                       // Max commit time
});
```

> **Important:**
> - Transactions require a **replica set** or **sharded cluster** (not standalone MongoDB)
> - Use `Model.create([doc], { session })` (array syntax) for transactions
> - All operations must include the `{ session }` option
> - Transactions have a default timeout of 60 seconds

---

## 12. Plugins

### 12.1 Creating a Plugin

```javascript
// Simple timestamp plugin
function timestampPlugin(schema, options) {
  schema.add({
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now }
  });

  schema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  schema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
  });
}

// Soft delete plugin
function softDeletePlugin(schema) {
  schema.add({
    isDeleted: { type: Boolean, default: false, select: false },
    deletedAt: { type: Date, select: false }
  });

  // Override find to exclude soft-deleted docs
  schema.pre(/^find/, function(next) {
    if (!this.getOptions().includeSoftDeleted) {
      this.find({ isDeleted: { $ne: true } });
    }
    next();
  });

  // Add soft delete method
  schema.methods.softDelete = async function() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return await this.save();
  };

  // Add restore method
  schema.methods.restore = async function() {
    this.isDeleted = false;
    this.deletedAt = undefined;
    return await this.save();
  };
}
```

### 12.2 Using Plugins

```javascript
// Apply to specific schema
tourSchema.plugin(timestampPlugin);
tourSchema.plugin(softDeletePlugin);

// Apply globally to all schemas
mongoose.plugin(timestampPlugin);

// Plugin with options
function paginatePlugin(schema, options) {
  const defaultLimit = (options && options.defaultLimit) || 10;

  schema.statics.paginate = async function(filter = {}, page = 1, limit = defaultLimit) {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this.find(filter).skip(skip).limit(limit).lean(),
      this.countDocuments(filter)
    ]);
    return {
      docs,
      total,
      page,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    };
  };
}

tourSchema.plugin(paginatePlugin, { defaultLimit: 20 });

// Usage
const result = await Tour.paginate({ difficulty: 'easy' }, 2, 10);
// { docs: [...], total: 45, page: 2, pages: 5, hasNext: true, hasPrev: true }
```

### 12.3 Popular Plugins

| Plugin | Purpose |
|--------|---------|
| `mongoose-paginate-v2` | Pagination support |
| `mongoose-autopopulate` | Auto-populate references |
| `mongoose-unique-validator` | Better unique validation errors |
| `mongoose-lean-virtuals` | Virtuals with lean queries |
| `mongoose-lean-getters` | Getters with lean queries |
| `mongoose-delete` | Soft delete support |
| `mongoose-aggregate-paginate-v2` | Pagination for aggregations |

---

## 13. Indexes

### 13.1 Creating Indexes

```javascript
// Single field index (in schema)
const tourSchema = new Schema({
  name: { type: String, index: true },
  price: Number,
  slug: { type: String, unique: true },
  ratingsAverage: Number,
  startLocation: {
    type: { type: String, default: 'Point', enum: ['Point'] },
    coordinates: [Number]
  }
});

// Compound index
tourSchema.index({ price: 1, ratingsAverage: -1 });

// Unique compound index
tourSchema.index({ tour: 1, user: 1 }, { unique: true });

// Text index (for text search)
tourSchema.index({ name: 'text', description: 'text' });

// Geospatial index (2dsphere)
tourSchema.index({ startLocation: '2dsphere' });

// TTL index (auto-expire documents)
const sessionSchema = new Schema({
  data: Object,
  createdAt: { type: Date, default: Date.now }
});
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // Expire after 1 hour

// Partial index (index only matching documents)
tourSchema.index(
  { price: 1 },
  { partialFilterExpression: { price: { $exists: true, $gt: 0 } } }
);

// Sparse index (only index documents where field exists)
tourSchema.index({ email: 1 }, { sparse: true });

// Wildcard index (index all fields in subdocument)
tourSchema.index({ 'metadata.$**': 1 });
```

### 13.2 Index Management

```javascript
// List all indexes
const indexes = await Tour.collection.getIndexes();
console.log(indexes);

// Create indexes manually
await Tour.createIndexes();

// Drop a specific index
await Tour.collection.dropIndex('price_1_ratingsAverage_-1');

// Drop all indexes (except _id)
await Tour.collection.dropIndexes();

// Ensure indexes (deprecated - use createIndexes)
await Tour.ensureIndexes();

// Check if index exists
const indexExists = await Tour.collection.indexExists('price_1');
```

### 13.3 Index Tips

| Tip | Description |
|-----|-------------|
| Index frequently queried fields | Fields used in `find()`, `sort()`, `$match` |
| Use compound indexes | For queries filtering on multiple fields |
| Index direction matters for sorts | Match sort direction in compound indexes |
| Don't over-index | Each index slows down writes |
| Use `explain()` to verify | Check if queries use your indexes |
| Disable autoIndex in production | Set `autoIndex: false` in production |
| Use covered queries | Select only indexed fields for max performance |

```javascript
// Check query uses index
const explanation = await Tour.find({ price: { $gt: 100 } })
  .sort({ ratingsAverage: -1 })
  .explain('executionStats');

console.log(explanation[0].executionStats.executionStages.inputStage.stage);
// 'IXSCAN' = index scan (good), 'COLLSCAN' = collection scan (bad)
```

---

## 14. Error Handling

### 14.1 Mongoose Error Types

```javascript
// ValidationError - schema validation failure
try {
  await Tour.create({ name: '' }); // Required field empty
} catch (error) {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    console.log('Validation errors:', messages);
    // error.errors → { fieldName: { message, kind, path, value } }
  }
}

// CastError - invalid type (e.g., invalid ObjectId)
try {
  await Tour.findById('invalid-id');
} catch (error) {
  if (error.name === 'CastError') {
    console.log(`Invalid ${error.path}: ${error.value}`);
    // error.kind → 'ObjectId', error.path → '_id', error.value → 'invalid-id'
  }
}

// MongoServerError 11000 - duplicate key
try {
  await User.create({ email: 'existing@email.com' });
} catch (error) {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    console.log(`Duplicate value for: ${field}`);
    // error.keyValue → { email: 'existing@email.com' }
  }
}

// DocumentNotFoundError
try {
  const doc = await Tour.findById(id).orFail(
    new Error('No tour found with that ID')
  );
} catch (error) {
  console.log(error.message);
}
```

### 14.2 Global Error Handling Pattern

```javascript
// AppError class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler for Mongoose errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Express global error handler
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err, message: err.message };

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message
  });
};
```

### 14.3 Validation on Update

```javascript
// By default, validators don't run on update operations
// Enable with runValidators option

await Tour.findByIdAndUpdate(id, updateData, {
  new: true,
  runValidators: true    // Enable validators on update
});

// Note: In update validators, 'this' refers to the query, not the document
// Cross-field validation won't work in updates
tourSchema.path('priceDiscount').validate(function(val) {
  // In update context, 'this' is the query object
  // 'this.get('price')' may not work as expected
  return true;
});
```

---

## 15. Performance & Optimization

### 15.1 Lean Queries

```javascript
// Regular query - returns Mongoose documents (with methods, getters, etc.)
const docs = await Tour.find({});
// docs[0] instanceof mongoose.Document → true
// Has methods: .save(), .populate(), etc.
// Heavier objects, more memory

// Lean query - returns plain JavaScript objects
const docs = await Tour.find({}).lean();
// docs[0] instanceof mongoose.Document → false
// No Mongoose methods or features
// ~5x faster, less memory
// Use when you only need to READ data

// Lean with virtuals (requires mongoose-lean-virtuals plugin)
const docs = await Tour.find({}).lean({ virtuals: true });
```

### 15.2 Select Only Needed Fields

```javascript
// Bad - fetches all fields
const tours = await Tour.find({});

// Good - fetch only needed fields
const tours = await Tour.find({}).select('name price ratingsAverage');

// Exclude large/unnecessary fields
const tours = await Tour.find({}).select('-description -images -__v');
```

### 15.3 Use Indexes Effectively

```javascript
// Create indexes for frequently queried fields
tourSchema.index({ price: 1 });
tourSchema.index({ ratingsAverage: -1 });
tourSchema.index({ price: 1, ratingsAverage: -1 }); // Compound index

// Use explain to verify index usage
const stats = await Tour.find({ price: { $gt: 100 } })
  .explain('executionStats');

// Covered query - all requested fields are in the index
const tours = await Tour.find(
  { price: { $gt: 100 } },
  { price: 1, ratingsAverage: 1, _id: 0 }
).hint({ price: 1, ratingsAverage: -1 });
```

### 15.4 Batch Processing

```javascript
// Process large datasets in batches using cursor
const cursor = Tour.find({}).cursor({ batchSize: 100 });

let batch = [];
for await (const doc of cursor) {
  batch.push(doc);
  if (batch.length === 100) {
    await processBatch(batch);
    batch = [];
  }
}
if (batch.length > 0) await processBatch(batch);

// Or use bulkWrite for batch updates
const operations = largeDataset.map(item => ({
  updateOne: {
    filter: { _id: item._id },
    update: { $set: { processed: true } }
  }
}));
await Tour.bulkWrite(operations, { ordered: false });
```

### 15.5 Connection Pool Tuning

```javascript
await mongoose.connect(uri, {
  maxPoolSize: 10,     // Max concurrent connections (default: 100)
  minPoolSize: 2,      // Keep minimum connections ready
  maxIdleTimeMS: 30000 // Close idle connections after 30s
});
```

### 15.6 Performance Tips Summary

| Tip | Impact |
|-----|--------|
| Use `.lean()` for read-only queries | ~5x faster |
| Select only needed fields | Reduces data transfer |
| Create proper indexes | Prevents collection scans |
| Use `.cursor()` for large datasets | Prevents memory overflow |
| Use `bulkWrite()` for batch operations | Fewer round trips |
| Disable `autoIndex` in production | Faster startup |
| Use `countDocuments()` over `.find().length` | Uses index |
| Use `exists()` instead of `findOne()` | Returns only `_id` |
| Populate only when needed | Reduces extra queries |
| Use connection pooling | Reuse connections |
| Cache frequent queries | Reduce DB load |
| Use `$project` early in aggregation | Reduce pipeline data |

---

## 16. Advanced Patterns

### 16.1 Discriminators (Inheritance)

```javascript
// Base schema
const eventSchema = new Schema({
  name: String,
  date: Date,
  location: String
}, { discriminatorKey: 'eventType' });

const Event = mongoose.model('Event', eventSchema);

// Derived models (share same collection)
const ClickEvent = Event.discriminator('ClickEvent', new Schema({
  element: String,
  url: String
}));

const PurchaseEvent = Event.discriminator('PurchaseEvent', new Schema({
  product: String,
  amount: Number
}));

// All stored in 'events' collection with 'eventType' field
await ClickEvent.create({ name: 'Button Click', element: '#buy-btn', url: '/shop' });
await PurchaseEvent.create({ name: 'Order', product: 'Tour', amount: 299 });

// Query all events
const allEvents = await Event.find({});

// Query specific type
const clicks = await ClickEvent.find({});
```

### 16.2 Middleware-Based Caching

```javascript
const cache = new Map();

tourSchema.post(/^find/, function(docs) {
  const key = JSON.stringify(this.getFilter());
  cache.set(key, { data: docs, timestamp: Date.now() });
});

tourSchema.pre(/^find/, function(next) {
  const key = JSON.stringify(this.getFilter());
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < 60000) { // 1 min TTL
    this._cachedResult = cached.data;
    return next();
  }
  next();
});
```

### 16.3 Schema Composition with Subdocuments

```javascript
// Reusable address schema
const addressSchema = new Schema({
  street: String,
  city: { type: String, required: true },
  state: String,
  zip: String,
  country: { type: String, default: 'US' }
}, { _id: false }); // Disable _id for subdocument

// Use in multiple schemas
const userSchema = new Schema({
  name: String,
  homeAddress: addressSchema,
  workAddress: addressSchema
});

const companySchema = new Schema({
  name: String,
  headquarters: addressSchema,
  branches: [addressSchema]
});
```

### 16.4 Pre/Post Hooks for Cascading Operations

```javascript
// When a tour is deleted, remove all associated reviews and bookings
tourSchema.pre('findOneAndDelete', async function(next) {
  const tourId = this.getFilter()._id;
  await Review.deleteMany({ tour: tourId });
  await Booking.deleteMany({ tour: tourId });
  next();
});

// When a user is deleted, anonymize their reviews
userSchema.pre('findOneAndDelete', async function(next) {
  const userId = this.getFilter()._id;
  await Review.updateMany(
    { user: userId },
    { $set: { user: null, userName: 'Deleted User' } }
  );
  next();
});
```

### 16.5 Optimistic Concurrency Control

```javascript
// Mongoose uses __v (versionKey) for optimistic concurrency
const tourSchema = new Schema({
  name: String,
  seats: Number
});

// Enable optimistic concurrency
tourSchema.set('optimisticConcurrency', true);

// Usage - will throw VersionError if document was modified by another process
const tour = await Tour.findById(id);
tour.seats -= 1;
try {
  await tour.save(); // Checks __v hasn't changed
} catch (error) {
  if (error.name === 'VersionError') {
    console.log('Conflict: Document was modified by another process');
    // Retry logic here
  }
}
```

### 16.6 Change Streams (Real-time)

```javascript
// Watch for changes in a collection (requires replica set)
const changeStream = Tour.watch();

changeStream.on('change', (change) => {
  console.log('Change detected:', change.operationType);
  // change.operationType: 'insert', 'update', 'delete', 'replace'
  // change.fullDocument: the complete document (for insert/replace/update with fullDocument option)
  // change.documentKey: { _id: ... }
  // change.updateDescription: { updatedFields, removedFields } (for update)
});

// Watch with filters
const pipeline = [
  { $match: { 'fullDocument.price': { $gt: 500 } } }
];
const changeStream = Tour.watch(pipeline, { fullDocument: 'updateLookup' });

// Close when done
changeStream.close();
```

---

## 17. Interview Questions & Concepts

### 17.1 Key Concepts

**Q: What is the difference between `Schema` and `Model`?**
- **Schema** defines the structure (fields, types, validators, virtuals, methods, middleware)
- **Model** is a compiled version of the schema that provides an interface to the database (CRUD operations)
- Schema → Blueprint, Model → Constructor/Class

**Q: What is `lean()` and when should you use it?**
- `lean()` returns plain JavaScript objects instead of Mongoose documents
- ~5x faster, uses less memory
- Use for read-only operations where you don't need `save()`, virtuals, getters, etc.
- Don't use when you need document methods or middleware

**Q: Difference between `save()` and `findByIdAndUpdate()`?**
- `save()`: triggers pre/post save middleware, runs all validators, supports cross-field validation, requires 2 DB operations (find + save)
- `findByIdAndUpdate()`: 1 DB operation, doesn't trigger save middleware, validators only with `runValidators: true`, no cross-field validation

**Q: What are Mongoose virtuals?**
- Computed properties not stored in MongoDB
- Defined with getters and optionally setters
- Must enable `toJSON: { virtuals: true }` to include in output
- Cannot be used in queries
- Virtual populate allows reverse population without storing references

**Q: What is population in Mongoose?**
- Mongoose's way of performing JOINs
- Replaces ObjectId references with actual documents from other collections
- Uses separate queries behind the scenes (not a real database JOIN)
- Virtual populate allows populating without storing the reference in the parent

**Q: How do transactions work in Mongoose?**
- Require MongoDB replica set or sharded cluster
- Use `session.startTransaction()` / `session.commitTransaction()` / `session.abortTransaction()`
- All operations must include `{ session }` option
- Provide ACID guarantees across multiple operations
- `session.withTransaction()` handles commit/abort automatically

### 17.2 Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Validators don't run on update | Use `{ runValidators: true }` |
| `this` in update validators is query, not doc | Use `save()` for cross-field validation |
| Mixed type changes not detected | Call `doc.markModified('fieldName')` |
| Virtuals missing in output | Set `toJSON/toObject: { virtuals: true }` |
| `unique` is not a validator | It creates a MongoDB index; handle E11000 errors |
| populate slows queries | Only populate when needed; select specific fields |
| `new: false` default on findAndUpdate | Always pass `{ new: true }` to get updated doc |
| Forgotten `await` on queries | Always `await` or use `.exec()` |
| Large datasets crash app | Use `.cursor()` or `.lean()` with batching |
| Auto-index in production | Set `autoIndex: false` in production config |

### 17.3 Mongoose vs Native MongoDB Driver

| Feature | Mongoose | Native Driver |
|---------|----------|---------------|
| Schema validation | ✅ Built-in | ❌ Manual |
| Middleware/Hooks | ✅ Yes | ❌ No |
| Population (JOINs) | ✅ Built-in | ❌ Manual |
| Virtuals | ✅ Yes | ❌ No |
| TypeCasting | ✅ Automatic | ❌ Manual |
| Default values | ✅ Built-in | ❌ Manual |
| Performance | ⚠️ Slightly slower | ✅ Faster |
| Flexibility | ⚠️ Schema-bound | ✅ Schema-less |
| Learning curve | ⚠️ Higher | ✅ Lower |
| Best for | Structured apps | Simple/flexible apps |

---

> **End of Mongoose Complete Reference Guide**
>
> This guide covers the most commonly used Mongoose features and patterns.
> For the latest information, refer to the [official Mongoose documentation](https://mongoosejs.com/docs/).
