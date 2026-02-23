# SQL Complete Reference Guide

> A comprehensive guide covering all commonly used SQL statements, functions, operators, and concepts.
> Useful for learning, quick reference, and interview preparation.

---

## Table of Contents

1. [CRUD Operations](#1-crud-operations)
2. [Query Clauses & Operators](#2-query-clauses--operators)
3. [Update & Delete Operations](#3-update--delete-operations)
4. [Sorting, Pagination & Filtering](#4-sorting-pagination--filtering)
5. [Aggregate Functions & GROUP BY](#5-aggregate-functions--group-by)
6. [JOINs](#6-joins)
7. [Subqueries & Common Table Expressions (CTEs)](#7-subqueries--common-table-expressions-ctes)
8. [Index Operations](#8-index-operations)
9. [Table & Database Management (DDL)](#9-table--database-management-ddl)
10. [Constraints & Data Types](#10-constraints--data-types)
11. [Schema Design & Normalization](#11-schema-design--normalization)
12. [Views & Stored Procedures](#12-views--stored-procedures)
13. [Transactions & Concurrency Control](#13-transactions--concurrency-control)
14. [Window Functions](#14-window-functions)
15. [Performance & Optimization](#15-performance--optimization)
16. [Node.js ORMs (Sequelize / Knex.js)](#16-nodejs-orms-sequelize--knexjs)
17. [Interview Questions & Concepts](#17-interview-questions--concepts)

---

## 1. CRUD Operations

### 1.1 Create (INSERT)

| Statement | Description |
|-----------|-------------|
| `INSERT INTO table (cols) VALUES (vals)` | Inserts a single row into a table |
| `INSERT INTO table (cols) VALUES (v1), (v2), ...` | Inserts multiple rows at once |
| `INSERT INTO table SELECT ...` | Inserts rows from a query result |

**Examples:**

```sql
-- Insert a single row
INSERT INTO users (name, age, email, created_at)
VALUES ('John Doe', 30, 'john@example.com', NOW());

-- Insert multiple rows
INSERT INTO users (name, age, city)
VALUES
  ('Alice', 25, 'New York'),
  ('Bob', 35, 'London'),
  ('Charlie', 28, 'Paris');

-- Insert from another table (copy data)
INSERT INTO archived_users (name, email, age)
SELECT name, email, age
FROM users
WHERE status = 'inactive';

-- Insert with DEFAULT values
INSERT INTO users (name, email)
VALUES ('Jane', 'jane@example.com');
-- Other columns get their DEFAULT values

-- INSERT IGNORE (MySQL) - skip rows that cause duplicate key errors
INSERT IGNORE INTO users (id, name, email)
VALUES (1, 'John', 'john@example.com');

-- INSERT ... ON DUPLICATE KEY UPDATE (MySQL - Upsert)
INSERT INTO users (email, name, login_count)
VALUES ('john@example.com', 'John', 1)
ON DUPLICATE KEY UPDATE
  login_count = login_count + 1,
  last_login = NOW();

-- INSERT ... ON CONFLICT (PostgreSQL - Upsert)
INSERT INTO users (email, name, login_count)
VALUES ('john@example.com', 'John', 1)
ON CONFLICT (email) DO UPDATE SET
  login_count = users.login_count + 1,
  last_login = NOW();
```

---

### 1.2 Read (SELECT)

| Statement | Description |
|-----------|-------------|
| `SELECT * FROM table` | Returns all columns and rows |
| `SELECT col1, col2 FROM table` | Returns specific columns |
| `SELECT DISTINCT col FROM table` | Returns unique values |
| `SELECT COUNT(*) FROM table` | Returns total row count |
| `SELECT * FROM table WHERE condition` | Returns rows matching condition |

**Examples:**

```sql
-- Select all columns and rows
SELECT * FROM users;

-- Select specific columns
SELECT name, email, age FROM users;

-- Select with alias
SELECT name AS full_name, age AS user_age FROM users;

-- Select distinct values
SELECT DISTINCT city FROM users;

-- Select with computed columns
SELECT name, age, (2026 - age) AS birth_year FROM users;

-- Select with LIMIT (MySQL / PostgreSQL)
SELECT * FROM users LIMIT 10;

-- Select with TOP (SQL Server)
SELECT TOP 10 * FROM users;

-- Select with FETCH (SQL Standard / Oracle / PostgreSQL)
SELECT * FROM users
FETCH FIRST 10 ROWS ONLY;

-- Select into a new table
SELECT name, email INTO new_users FROM users WHERE age > 25;

-- Check if rows exist
SELECT EXISTS (SELECT 1 FROM users WHERE email = 'john@example.com') AS user_exists;
```

---

### 1.3 Update (UPDATE)

| Statement | Description |
|-----------|-------------|
| `UPDATE table SET col = val WHERE condition` | Updates matching rows |
| `UPDATE table SET col1 = val1, col2 = val2 WHERE condition` | Updates multiple columns |

**Examples:**

```sql
-- Update a single column
UPDATE users
SET age = 31
WHERE name = 'John';

-- Update multiple columns
UPDATE users
SET age = 31, city = 'NYC', updated_at = NOW()
WHERE name = 'John';

-- Update all rows (DANGER - no WHERE clause!)
UPDATE users SET status = 'active';

-- Update with expression
UPDATE products
SET price = price * 1.10  -- 10% price increase
WHERE category = 'electronics';

-- Update with subquery
UPDATE orders
SET status = 'cancelled'
WHERE user_id IN (
  SELECT id FROM users WHERE status = 'banned'
);

-- Update with JOIN (MySQL)
UPDATE orders o
JOIN users u ON o.user_id = u.id
SET o.status = 'verified'
WHERE u.role = 'premium';

-- Update with FROM (PostgreSQL)
UPDATE orders
SET status = 'verified'
FROM users
WHERE orders.user_id = users.id AND users.role = 'premium';

-- Update with RETURNING (PostgreSQL) - returns updated rows
UPDATE users
SET age = 32
WHERE name = 'John'
RETURNING id, name, age;
```

---

### 1.4 Delete (DELETE)

| Statement | Description |
|-----------|-------------|
| `DELETE FROM table WHERE condition` | Deletes matching rows |
| `DELETE FROM table` | Deletes ALL rows (keeps table structure) |
| `TRUNCATE TABLE table` | Removes all rows (faster, resets auto-increment) |
| `DROP TABLE table` | Removes the entire table |

**Examples:**

```sql
-- Delete specific rows
DELETE FROM users WHERE name = 'John';

-- Delete with subquery
DELETE FROM orders
WHERE user_id IN (
  SELECT id FROM users WHERE status = 'inactive'
);

-- Delete all rows (keeps table structure)
DELETE FROM users;

-- TRUNCATE - faster delete all, resets auto-increment, cannot rollback
TRUNCATE TABLE users;

-- Delete with JOIN (MySQL)
DELETE o FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.status = 'banned';

-- Delete with USING (PostgreSQL)
DELETE FROM orders
USING users
WHERE orders.user_id = users.id AND users.status = 'banned';

-- Delete with RETURNING (PostgreSQL)
DELETE FROM users
WHERE status = 'inactive'
RETURNING id, name, email;

-- Delete with LIMIT (MySQL) - delete in batches
DELETE FROM logs WHERE created_at < '2025-01-01' LIMIT 1000;
```

---

## 2. Query Clauses & Operators

### 2.1 Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `=` | Equal to | `WHERE age = 25` |
| `<>` or `!=` | Not equal to | `WHERE age <> 25` |
| `>` | Greater than | `WHERE age > 25` |
| `>=` | Greater than or equal | `WHERE age >= 25` |
| `<` | Less than | `WHERE age < 25` |
| `<=` | Less than or equal | `WHERE age <= 25` |

**Examples:**

```sql
-- Equal
SELECT * FROM users WHERE age = 25;

-- Not equal
SELECT * FROM users WHERE age <> 25;

-- Greater than
SELECT * FROM users WHERE age > 25;

-- Range (using AND)
SELECT * FROM users WHERE age >= 20 AND age <= 30;
```

---

### 2.2 Logical Operators

| Operator | Description |
|----------|-------------|
| `AND` | Both conditions must be true |
| `OR` | At least one condition must be true |
| `NOT` | Negates a condition |

**Examples:**

```sql
-- AND - both conditions must be true
SELECT * FROM users WHERE age >= 20 AND age <= 30;

-- OR - at least one condition must be true
SELECT * FROM users WHERE status = 'active' OR age < 30;

-- NOT - negates a condition
SELECT * FROM users WHERE NOT status = 'inactive';

-- Combining AND, OR with parentheses
SELECT * FROM users
WHERE (city = 'NYC' OR city = 'LA')
  AND (status = 'active' OR age > 25);
```

---

### 2.3 Special Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `BETWEEN` | Range (inclusive) | `WHERE age BETWEEN 20 AND 30` |
| `IN` | Matches any value in a list | `WHERE city IN ('NYC', 'LA')` |
| `NOT IN` | Matches none of the values | `WHERE city NOT IN ('NYC', 'LA')` |
| `LIKE` | Pattern matching | `WHERE name LIKE 'J%'` |
| `NOT LIKE` | Inverse pattern matching | `WHERE name NOT LIKE '%test%'` |
| `IS NULL` | Checks for NULL | `WHERE email IS NULL` |
| `IS NOT NULL` | Checks for non-NULL | `WHERE email IS NOT NULL` |
| `EXISTS` | Checks if subquery returns rows | `WHERE EXISTS (SELECT ...)` |
| `ANY` / `SOME` | Compares to any value from subquery | `WHERE age > ANY (SELECT ...)` |
| `ALL` | Compares to all values from subquery | `WHERE age > ALL (SELECT ...)` |

**Examples:**

```sql
-- BETWEEN (inclusive range)
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
-- Equivalent to: WHERE age >= 20 AND age <= 30

-- IN - match any value in list
SELECT * FROM users WHERE city IN ('New York', 'London', 'Paris');

-- NOT IN
SELECT * FROM users WHERE city NOT IN ('New York', 'London');

-- LIKE - pattern matching
SELECT * FROM users WHERE name LIKE 'J%';        -- starts with J
SELECT * FROM users WHERE name LIKE '%son';       -- ends with "son"
SELECT * FROM users WHERE name LIKE '%john%';     -- contains "john"
SELECT * FROM users WHERE name LIKE '_o%';        -- second char is "o"
SELECT * FROM users WHERE name LIKE 'J___';       -- J followed by exactly 3 chars

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE email IS NULL;
SELECT * FROM users WHERE email IS NOT NULL;

-- EXISTS - check if related data exists
SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- NOT EXISTS
SELECT * FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);

-- ANY / SOME - compare with any value from subquery
SELECT * FROM products
WHERE price > ANY (SELECT price FROM products WHERE category = 'budget');

-- ALL - compare with all values from subquery
SELECT * FROM products
WHERE price > ALL (SELECT price FROM products WHERE category = 'budget');
```

---

### 2.4 CASE Expression (Conditional Logic)

```sql
-- Simple CASE
SELECT name, age,
  CASE
    WHEN age < 18 THEN 'minor'
    WHEN age BETWEEN 18 AND 65 THEN 'adult'
    ELSE 'senior'
  END AS age_group
FROM users;

-- CASE in WHERE clause
SELECT * FROM orders
WHERE
  CASE
    WHEN status = 'pending' THEN total > 100
    WHEN status = 'shipped' THEN total > 50
    ELSE TRUE
  END;

-- CASE in ORDER BY
SELECT * FROM users
ORDER BY
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'manager' THEN 2
    WHEN 'user' THEN 3
    ELSE 4
  END;

-- CASE in UPDATE
UPDATE users
SET tier =
  CASE
    WHEN total_spent >= 10000 THEN 'platinum'
    WHEN total_spent >= 5000 THEN 'gold'
    WHEN total_spent >= 1000 THEN 'silver'
    ELSE 'bronze'
  END;
```

---

### 2.5 String Functions

| Function | Description | Example |
|----------|-------------|---------|
| `CONCAT(s1, s2, ...)` | Concatenate strings | `CONCAT(first, ' ', last)` |
| `LENGTH(s)` / `LEN(s)` | String length | `LENGTH(name)` |
| `UPPER(s)` | Uppercase | `UPPER(name)` |
| `LOWER(s)` | Lowercase | `LOWER(email)` |
| `TRIM(s)` | Remove leading/trailing spaces | `TRIM(name)` |
| `LTRIM(s)` / `RTRIM(s)` | Left / right trim | `LTRIM(name)` |
| `SUBSTRING(s, start, len)` | Extract substring | `SUBSTRING(name, 1, 3)` |
| `REPLACE(s, from, to)` | Replace occurrences | `REPLACE(phone, '-', '')` |
| `REVERSE(s)` | Reverse string | `REVERSE(name)` |
| `LEFT(s, n)` / `RIGHT(s, n)` | Left / right characters | `LEFT(name, 3)` |
| `CHARINDEX(sub, s)` | Find position (SQL Server) | `CHARINDEX('@', email)` |
| `POSITION(sub IN s)` | Find position (PostgreSQL) | `POSITION('@' IN email)` |
| `COALESCE(v1, v2, ...)` | First non-NULL value | `COALESCE(nickname, name)` |
| `NULLIF(v1, v2)` | Returns NULL if equal | `NULLIF(age, 0)` |
| `CAST(expr AS type)` | Type conversion | `CAST(age AS VARCHAR)` |

**Examples:**

```sql
-- String concatenation
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;

-- PostgreSQL concatenation operator
SELECT first_name || ' ' || last_name AS full_name FROM users;

-- String length
SELECT name, LENGTH(name) AS name_length FROM users;

-- Upper / Lower
SELECT UPPER(name) AS upper_name, LOWER(email) AS lower_email FROM users;

-- Substring
SELECT SUBSTRING(name, 1, 3) AS first_three FROM users;  -- first 3 chars

-- Replace
SELECT REPLACE(phone, '-', '') AS clean_phone FROM users;

-- COALESCE - first non-NULL value
SELECT COALESCE(nickname, first_name, 'Anonymous') AS display_name FROM users;

-- NULLIF - returns NULL if values are equal (useful to avoid division by zero)
SELECT total / NULLIF(quantity, 0) AS unit_price FROM products;

-- CAST / CONVERT
SELECT CAST(age AS VARCHAR(3)) AS age_string FROM users;
SELECT CAST('2026-01-15' AS DATE) AS parsed_date;
```

---

### 2.6 Date & Time Functions

| Function | Description |
|----------|-------------|
| `NOW()` / `CURRENT_TIMESTAMP` | Current date and time |
| `CURDATE()` / `CURRENT_DATE` | Current date |
| `CURTIME()` / `CURRENT_TIME` | Current time |
| `DATE(datetime)` | Extract date from datetime |
| `YEAR(date)` / `MONTH(date)` / `DAY(date)` | Extract parts |
| `EXTRACT(part FROM date)` | Extract date/time part |
| `DATEDIFF(d1, d2)` | Difference between dates |
| `DATE_ADD(date, INTERVAL n unit)` | Add interval to date |
| `DATE_SUB(date, INTERVAL n unit)` | Subtract interval from date |
| `DATE_FORMAT(date, format)` | Format date (MySQL) |
| `TO_CHAR(date, format)` | Format date (PostgreSQL) |

**Examples:**

```sql
-- Current date and time
SELECT NOW(), CURRENT_TIMESTAMP;

-- Extract parts
SELECT
  YEAR(created_at) AS yr,
  MONTH(created_at) AS mo,
  DAY(created_at) AS dy
FROM orders;

-- EXTRACT (SQL standard)
SELECT
  EXTRACT(YEAR FROM created_at) AS yr,
  EXTRACT(MONTH FROM created_at) AS mo,
  EXTRACT(DOW FROM created_at) AS day_of_week
FROM orders;

-- Date arithmetic
SELECT DATE_ADD(NOW(), INTERVAL 30 DAY) AS thirty_days_later;      -- MySQL
SELECT DATE_SUB(NOW(), INTERVAL 1 YEAR) AS one_year_ago;           -- MySQL
SELECT NOW() + INTERVAL '30 days' AS thirty_days_later;             -- PostgreSQL
SELECT NOW() - INTERVAL '1 year' AS one_year_ago;                   -- PostgreSQL

-- Date difference
SELECT DATEDIFF(NOW(), created_at) AS days_since_created FROM users; -- MySQL
SELECT AGE(NOW(), created_at) AS time_since_created FROM users;      -- PostgreSQL

-- Format dates
SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS formatted FROM orders;     -- MySQL
SELECT TO_CHAR(created_at, 'YYYY-MM-DD') AS formatted FROM orders;      -- PostgreSQL

-- Filter by date range
SELECT * FROM orders
WHERE created_at BETWEEN '2026-01-01' AND '2026-12-31';

-- Filter recent records
SELECT * FROM orders WHERE created_at >= NOW() - INTERVAL 7 DAY;        -- MySQL
SELECT * FROM orders WHERE created_at >= NOW() - INTERVAL '7 days';     -- PostgreSQL
```

---

### 2.7 Math / Numeric Functions

| Function | Description | Example |
|----------|-------------|---------|
| `ABS(n)` | Absolute value | `ABS(-5)` → `5` |
| `CEIL(n)` / `CEILING(n)` | Round up | `CEIL(4.2)` → `5` |
| `FLOOR(n)` | Round down | `FLOOR(4.8)` → `4` |
| `ROUND(n, d)` | Round to d decimal places | `ROUND(3.456, 2)` → `3.46` |
| `MOD(n, m)` | Modulo (remainder) | `MOD(10, 3)` → `1` |
| `POWER(n, p)` | Raise to power | `POWER(2, 3)` → `8` |
| `SQRT(n)` | Square root | `SQRT(16)` → `4` |
| `GREATEST(v1, v2, ...)` | Largest value | `GREATEST(a, b, c)` |
| `LEAST(v1, v2, ...)` | Smallest value | `LEAST(a, b, c)` |
| `RAND()` / `RANDOM()` | Random number | `RAND()` (MySQL), `RANDOM()` (PG) |

**Examples:**

```sql
-- Rounding
SELECT ROUND(price, 2) AS rounded_price FROM products;
SELECT CEIL(4.2) AS ceiling_val, FLOOR(4.8) AS floor_val;

-- Absolute value
SELECT ABS(balance) AS positive_balance FROM accounts;

-- Modulo (find even-aged users)
SELECT * FROM users WHERE MOD(age, 2) = 0;

-- Random ordering (shuffle)
SELECT * FROM products ORDER BY RAND() LIMIT 5;  -- MySQL
SELECT * FROM products ORDER BY RANDOM() LIMIT 5; -- PostgreSQL

-- Greatest / Least
SELECT GREATEST(score1, score2, score3) AS best_score FROM exams;
SELECT LEAST(price1, price2) AS cheapest FROM comparisons;
```

---

## 3. Update & Delete Operations

### 3.1 Advanced UPDATE Patterns

```sql
-- Conditional update with CASE
UPDATE products
SET discount =
  CASE
    WHEN price > 100 THEN 0.20
    WHEN price > 50 THEN 0.10
    ELSE 0.05
  END;

-- Update with aggregated subquery
UPDATE users u
SET order_count = (
  SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id
);

-- Increment a value
UPDATE products SET stock = stock - 1 WHERE id = 42;

-- Swap values
UPDATE table_name
SET col_a = col_b, col_b = col_a
WHERE id = 1;

-- Update with LIMIT (MySQL) - batch updates
UPDATE users SET status = 'processed' WHERE status = 'pending' LIMIT 100;
```

### 3.2 Soft Delete Pattern

```sql
-- Instead of deleting, mark as deleted
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

-- Soft delete
UPDATE users SET deleted_at = NOW() WHERE id = 42;

-- Query only active (non-deleted) records
SELECT * FROM users WHERE deleted_at IS NULL;

-- Create a view for convenience
CREATE VIEW active_users AS
SELECT * FROM users WHERE deleted_at IS NULL;
```

---

## 4. Sorting, Pagination & Filtering

### 4.1 ORDER BY

```sql
-- Sort ascending (default)
SELECT * FROM users ORDER BY name ASC;

-- Sort descending
SELECT * FROM users ORDER BY created_at DESC;

-- Multi-column sort
SELECT * FROM users ORDER BY city ASC, age DESC;

-- Sort with NULLs positioning (PostgreSQL)
SELECT * FROM users ORDER BY email NULLS LAST;
SELECT * FROM users ORDER BY email NULLS FIRST;

-- Sort by column position
SELECT name, age, city FROM users ORDER BY 3, 2 DESC;  -- sort by city then age desc

-- Sort by expression
SELECT * FROM products ORDER BY (price * quantity) DESC;
```

### 4.2 LIMIT & OFFSET (Pagination)

```sql
-- Basic pagination (MySQL / PostgreSQL)
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 0;   -- Page 1 (items 1-10)
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 10;  -- Page 2 (items 11-20)
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 20;  -- Page 3 (items 21-30)

-- Shorthand (MySQL)
SELECT * FROM users ORDER BY id LIMIT 20, 10;  -- LIMIT offset, count

-- SQL Standard / SQL Server
SELECT * FROM users
ORDER BY id
OFFSET 20 ROWS
FETCH NEXT 10 ROWS ONLY;

-- SQL Server (older)
SELECT TOP 10 * FROM users ORDER BY id;

-- Cursor-based pagination (more efficient for large datasets)
-- First page
SELECT * FROM users ORDER BY id LIMIT 10;
-- Next pages (use last seen id)
SELECT * FROM users WHERE id > 42 ORDER BY id LIMIT 10;
```

### 4.3 DISTINCT

```sql
-- Unique values from one column
SELECT DISTINCT city FROM users;

-- Unique combinations
SELECT DISTINCT city, status FROM users;

-- Count distinct values
SELECT COUNT(DISTINCT city) AS unique_cities FROM users;

-- Distinct with ordering
SELECT DISTINCT city FROM users ORDER BY city;
```

---

## 5. Aggregate Functions & GROUP BY

### 5.1 Aggregate Functions

| Function | Description |
|----------|-------------|
| `COUNT(*)` | Count all rows |
| `COUNT(col)` | Count non-NULL values |
| `COUNT(DISTINCT col)` | Count unique non-NULL values |
| `SUM(col)` | Sum of values |
| `AVG(col)` | Average of values |
| `MIN(col)` | Minimum value |
| `MAX(col)` | Maximum value |
| `GROUP_CONCAT(col)` | Concatenate values (MySQL) |
| `STRING_AGG(col, sep)` | Concatenate values (PostgreSQL / SQL Server) |
| `STDDEV(col)` / `STDDEV_POP(col)` | Population standard deviation |
| `STDDEV_SAMP(col)` | Sample standard deviation |
| `VARIANCE(col)` / `VAR_POP(col)` | Population variance |
| `VAR_SAMP(col)` | Sample variance |

**Examples:**

```sql
-- Basic aggregates
SELECT
  COUNT(*) AS total_users,
  COUNT(DISTINCT city) AS unique_cities,
  AVG(age) AS avg_age,
  MIN(age) AS youngest,
  MAX(age) AS oldest,
  SUM(age) AS total_age
FROM users;

-- Count non-NULL vs all
SELECT
  COUNT(*) AS total_rows,           -- counts all rows
  COUNT(email) AS with_email,       -- counts non-NULL emails
  COUNT(*) - COUNT(email) AS without_email
FROM users;
```

### 5.2 GROUP BY

```sql
-- Group by city with aggregates
SELECT
  city,
  COUNT(*) AS total_users,
  AVG(age) AS avg_age,
  MIN(age) AS min_age,
  MAX(age) AS max_age
FROM users
GROUP BY city
ORDER BY total_users DESC;

-- Group by multiple columns
SELECT city, status, COUNT(*) AS total
FROM users
GROUP BY city, status;

-- Group by with expression
SELECT
  YEAR(created_at) AS year,
  MONTH(created_at) AS month,
  COUNT(*) AS total_orders,
  SUM(total) AS revenue
FROM orders
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY year, month;

-- GROUP_CONCAT (MySQL) - aggregate values into a comma-separated string
SELECT
  city,
  COUNT(*) AS total,
  GROUP_CONCAT(name ORDER BY name SEPARATOR ', ') AS user_names
FROM users
GROUP BY city;

-- STRING_AGG (PostgreSQL / SQL Server)
SELECT
  city,
  COUNT(*) AS total,
  STRING_AGG(name, ', ' ORDER BY name) AS user_names
FROM users
GROUP BY city;
```

### 5.3 HAVING (Filter Groups)

```sql
-- HAVING - filter AFTER grouping (WHERE filters BEFORE grouping)
SELECT city, COUNT(*) AS total_users
FROM users
GROUP BY city
HAVING COUNT(*) > 5
ORDER BY total_users DESC;

-- WHERE vs HAVING
SELECT city, AVG(age) AS avg_age
FROM users
WHERE status = 'active'        -- filters rows BEFORE grouping
GROUP BY city
HAVING AVG(age) > 25           -- filters groups AFTER aggregation
ORDER BY avg_age DESC;

-- HAVING with multiple conditions
SELECT category, SUM(price) AS total_price, COUNT(*) AS product_count
FROM products
GROUP BY category
HAVING SUM(price) > 1000 AND COUNT(*) >= 5;
```

### 5.4 ROLLUP & CUBE (Advanced Grouping)

```sql
-- ROLLUP - hierarchical subtotals and grand total
SELECT
  COALESCE(city, 'ALL CITIES') AS city,
  COALESCE(status, 'ALL STATUSES') AS status,
  COUNT(*) AS total
FROM users
GROUP BY ROLLUP(city, status);
-- Produces: (city, status), (city, NULL), (NULL, NULL)

-- CUBE - all combinations of subtotals
SELECT city, status, COUNT(*) AS total
FROM users
GROUP BY CUBE(city, status);
-- Produces: (city, status), (city, NULL), (NULL, status), (NULL, NULL)

-- GROUPING SETS - custom grouping combinations
SELECT city, status, COUNT(*) AS total
FROM users
GROUP BY GROUPING SETS (
  (city, status),
  (city),
  (status),
  ()
);
```

---

## 6. JOINs

### 6.1 JOIN Types

| JOIN Type | Description |
|-----------|-------------|
| `INNER JOIN` | Returns rows that have matching values in both tables |
| `LEFT JOIN` (or `LEFT OUTER JOIN`) | Returns all rows from left table + matching from right |
| `RIGHT JOIN` (or `RIGHT OUTER JOIN`) | Returns all rows from right table + matching from left |
| `FULL OUTER JOIN` | Returns all rows when there is a match in either table |
| `CROSS JOIN` | Returns Cartesian product (every combination) |
| `SELF JOIN` | Joins a table to itself |
| `NATURAL JOIN` | Joins on columns with the same name (use with caution) |

### 6.2 JOIN Examples

```sql
-- INNER JOIN - only matching rows from both tables
SELECT u.name, o.order_number, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN - all users, even without orders
SELECT u.name, o.order_number, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN - find users WITHOUT orders
SELECT u.name, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;

-- RIGHT JOIN - all orders, even with deleted users
SELECT u.name, o.order_number, o.total
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

-- FULL OUTER JOIN - all rows from both tables
SELECT u.name, o.order_number
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;

-- CROSS JOIN - every user paired with every product
SELECT u.name, p.product_name
FROM users u
CROSS JOIN products p;

-- SELF JOIN - find employees and their managers
SELECT
  e.name AS employee,
  m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Multiple JOINs
SELECT u.name, o.order_number, p.product_name, oi.quantity
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.status = 'completed';

-- JOIN with aggregate
SELECT u.name, COUNT(o.id) AS order_count, SUM(o.total) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY total_spent DESC;

-- JOIN with USING (when column names are the same)
SELECT * FROM orders
JOIN users USING (user_id);

-- NATURAL JOIN (joins on all matching column names)
SELECT * FROM orders NATURAL JOIN users;
-- Caution: can give unexpected results if tables share column names unintentionally
```

### 6.3 JOIN Visual Reference

```
INNER JOIN:         LEFT JOIN:          RIGHT JOIN:        FULL OUTER JOIN:
  ┌───┐               ┌───┐              ┌───┐              ┌───┐
  │ A │∩│ B │         █ A █∩│ B │        │ A │∩█ B █        █ A █∩█ B █
  └───┘               └───┘              └───┘              └───┘
 Only overlap     All A + matching B   All B + matching A   All from both

LEFT EXCLUSIVE:     RIGHT EXCLUSIVE:    FULL EXCLUSIVE:
  ┌───┐               ┌───┐              ┌───┐
  █ A █ │ B │         │ A │ █ B █        █ A █ █ B █
  └───┘               └───┘              └───┘
  A only (no B)      B only (no A)     A or B (not both)
```

---

## 7. Subqueries & Common Table Expressions (CTEs)

### 7.1 Subqueries

```sql
-- Subquery in WHERE (scalar)
SELECT * FROM users
WHERE age > (SELECT AVG(age) FROM users);

-- Subquery in WHERE (list)
SELECT * FROM users
WHERE id IN (
  SELECT user_id FROM orders WHERE total > 100
);

-- Correlated subquery - references outer query
SELECT u.name, u.city,
  (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;

-- Subquery in FROM (derived table)
SELECT city, avg_age
FROM (
  SELECT city, AVG(age) AS avg_age
  FROM users
  GROUP BY city
) AS city_stats
WHERE avg_age > 30;

-- Subquery with EXISTS
SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.user_id = u.id AND o.total > 1000
);

-- Subquery in INSERT
INSERT INTO premium_users (id, name, email)
SELECT id, name, email
FROM users
WHERE total_spent > 10000;

-- Subquery in UPDATE
UPDATE users
SET tier = 'gold'
WHERE id IN (
  SELECT user_id FROM orders
  GROUP BY user_id
  HAVING SUM(total) > 5000
);
```

### 7.2 Common Table Expressions (CTEs)

```sql
-- Basic CTE
WITH active_users AS (
  SELECT id, name, email, age
  FROM users
  WHERE status = 'active'
)
SELECT * FROM active_users WHERE age > 25;

-- Multiple CTEs
WITH
  active_users AS (
    SELECT * FROM users WHERE status = 'active'
  ),
  user_orders AS (
    SELECT user_id, COUNT(*) AS order_count, SUM(total) AS total_spent
    FROM orders
    GROUP BY user_id
  )
SELECT
  au.name,
  au.email,
  COALESCE(uo.order_count, 0) AS orders,
  COALESCE(uo.total_spent, 0) AS spent
FROM active_users au
LEFT JOIN user_orders uo ON au.id = uo.user_id
ORDER BY spent DESC;

-- Recursive CTE (tree/hierarchy traversal)
WITH RECURSIVE org_chart AS (
  -- Anchor: start with the CEO (no manager)
  SELECT id, name, manager_id, 0 AS level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive: find all reports
  SELECT e.id, e.name, e.manager_id, oc.level + 1
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart ORDER BY level, name;

-- CTE with DELETE (PostgreSQL)
WITH inactive_users AS (
  SELECT id FROM users
  WHERE last_login < NOW() - INTERVAL '1 year'
)
DELETE FROM users WHERE id IN (SELECT id FROM inactive_users);

-- CTE with UPDATE
WITH high_spenders AS (
  SELECT user_id
  FROM orders
  GROUP BY user_id
  HAVING SUM(total) > 10000
)
UPDATE users SET tier = 'platinum'
WHERE id IN (SELECT user_id FROM high_spenders);
```

---

## 8. Index Operations

### 8.1 Index Types

| Index Type | Description |
|------------|-------------|
| **B-Tree** | Default index type, good for equality and range queries |
| **Hash** | Good for equality lookups only (PostgreSQL) |
| **GIN** | Generalized Inverted Index, for arrays/JSONB/full-text (PostgreSQL) |
| **GiST** | Generalized Search Tree, for geometric/full-text (PostgreSQL) |
| **BRIN** | Block Range Index, for large sequential data (PostgreSQL) |
| **Full-Text** | For text search (MySQL, SQL Server) |
| **Clustered** | Determines physical row order (SQL Server, MySQL InnoDB PK) |
| **Non-Clustered** | Separate structure from table data |
| **Covering** | Index includes all columns needed by a query |
| **Partial / Filtered** | Index with a WHERE condition |
| **Unique** | Enforces uniqueness |
| **Composite / Compound** | Index on multiple columns |

### 8.2 Index Methods

| Statement | Description |
|-----------|-------------|
| `CREATE INDEX name ON table (cols)` | Creates an index |
| `CREATE UNIQUE INDEX name ON table (cols)` | Creates a unique index |
| `DROP INDEX name` | Drops an index |
| `SHOW INDEX FROM table` | Lists indexes (MySQL) |
| `\di` | Lists indexes (PostgreSQL psql) |

### 8.3 Index Examples

```sql
-- Single column index
CREATE INDEX idx_users_email ON users (email);

-- Composite (compound) index
CREATE INDEX idx_users_city_age ON users (city, age);

-- Unique index
CREATE UNIQUE INDEX idx_users_email_unique ON users (email);

-- Descending index
CREATE INDEX idx_orders_date ON orders (created_at DESC);

-- Partial index (PostgreSQL) - only index active users
CREATE INDEX idx_active_users_email
ON users (email)
WHERE status = 'active';

-- Filtered index (SQL Server)
CREATE INDEX idx_active_users_email
ON users (email)
WHERE status = 'active';

-- Covering index / INCLUDE (PostgreSQL / SQL Server)
CREATE INDEX idx_users_email_include
ON users (email)
INCLUDE (name, city);

-- Full-text index (MySQL)
CREATE FULLTEXT INDEX idx_articles_content ON articles (title, content);

-- GIN index for JSONB (PostgreSQL)
CREATE INDEX idx_data_gin ON documents USING GIN (data);

-- Expression index (PostgreSQL)
CREATE INDEX idx_users_lower_email ON users (LOWER(email));

-- Drop an index
DROP INDEX idx_users_email;                           -- PostgreSQL
DROP INDEX idx_users_email ON users;                  -- MySQL / SQL Server
ALTER TABLE users DROP INDEX idx_users_email;         -- MySQL alternative

-- Show indexes
SHOW INDEX FROM users;                                 -- MySQL
SELECT * FROM pg_indexes WHERE tablename = 'users';   -- PostgreSQL

-- Analyze query plan to check index usage
EXPLAIN SELECT * FROM users WHERE email = 'john@test.com';           -- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@test.com';   -- PostgreSQL (executes)
EXPLAIN SELECT * FROM users WHERE email = 'john@test.com';           -- MySQL
```

---

## 9. Table & Database Management (DDL)

### 9.1 Database Operations

```sql
-- Create a database
CREATE DATABASE mydb;

-- Create with character set (MySQL)
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create with encoding (PostgreSQL)
CREATE DATABASE mydb ENCODING 'UTF8';

-- Use / switch database (MySQL)
USE mydb;

-- Connect to database (PostgreSQL psql)
-- \c mydb

-- Show all databases
SHOW DATABASES;                    -- MySQL
-- \l                              -- PostgreSQL

-- Drop a database
DROP DATABASE mydb;
DROP DATABASE IF EXISTS mydb;

-- Rename database (not supported in most RDBMS directly)
-- Alternative: dump, create new, restore, drop old
```

### 9.2 Table Operations (CREATE, ALTER, DROP)

```sql
-- CREATE TABLE
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,             -- MySQL
  -- id SERIAL PRIMARY KEY,                      -- PostgreSQL
  -- id INT IDENTITY(1,1) PRIMARY KEY,           -- SQL Server
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INT CHECK (age >= 0 AND age <= 150),
  role ENUM('user', 'admin', 'guide') DEFAULT 'user',  -- MySQL only
  -- role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'guide')),  -- PostgreSQL
  bio TEXT,
  salary DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- MySQL
  -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- PostgreSQL (use trigger)
);

-- CREATE TABLE with foreign key
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- CREATE TABLE AS (from query)
CREATE TABLE active_users AS
SELECT id, name, email FROM users WHERE status = 'active';

-- ALTER TABLE - Add column
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- ALTER TABLE - Drop column
ALTER TABLE users DROP COLUMN phone;

-- ALTER TABLE - Modify column type (MySQL)
ALTER TABLE users MODIFY COLUMN name VARCHAR(200) NOT NULL;

-- ALTER TABLE - Change column type (PostgreSQL)
ALTER TABLE users ALTER COLUMN name TYPE VARCHAR(200);

-- ALTER TABLE - Rename column
ALTER TABLE users RENAME COLUMN fname TO first_name;

-- ALTER TABLE - Add constraint
ALTER TABLE users ADD CONSTRAINT uq_email UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT chk_age CHECK (age >= 0);

-- ALTER TABLE - Drop constraint
ALTER TABLE users DROP CONSTRAINT uq_email;

-- ALTER TABLE - Add foreign key
ALTER TABLE orders
ADD CONSTRAINT fk_orders_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ALTER TABLE - Set default value
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';

-- ALTER TABLE - Drop default
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

-- Rename table
ALTER TABLE users RENAME TO customers;       -- PostgreSQL
RENAME TABLE users TO customers;             -- MySQL

-- DROP TABLE
DROP TABLE users;
DROP TABLE IF EXISTS users;

-- Drop table with CASCADE (PostgreSQL - drops dependent objects)
DROP TABLE users CASCADE;

-- TRUNCATE TABLE (delete all data, reset auto-increment)
TRUNCATE TABLE users;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;  -- PostgreSQL
```

### 9.3 Temporary Tables

```sql
-- Create temporary table (exists only for the session)
CREATE TEMPORARY TABLE temp_results (
  id INT,
  name VARCHAR(100),
  score DECIMAL(5,2)
);

-- Insert into temp table
INSERT INTO temp_results SELECT id, name, score FROM students WHERE score > 90;

-- Use temp table
SELECT * FROM temp_results;

-- Temp table auto-drops when session ends, or manually:
DROP TEMPORARY TABLE temp_results;
```

---

## 10. Constraints & Data Types

### 10.1 Constraints

| Constraint | Description |
|------------|-------------|
| `PRIMARY KEY` | Unique identifier for each row (NOT NULL + UNIQUE) |
| `FOREIGN KEY` | References a primary key in another table |
| `UNIQUE` | Ensures all values are unique |
| `NOT NULL` | Prevents NULL values |
| `CHECK` | Validates a condition |
| `DEFAULT` | Sets a default value |
| `AUTO_INCREMENT` / `SERIAL` / `IDENTITY` | Auto-generated sequential values |

**Foreign Key Actions:**

| Action | Description |
|--------|-------------|
| `ON DELETE CASCADE` | Delete child rows when parent is deleted |
| `ON DELETE SET NULL` | Set FK to NULL when parent is deleted |
| `ON DELETE RESTRICT` | Prevent deletion if children exist (default) |
| `ON DELETE SET DEFAULT` | Set FK to default when parent is deleted |
| `ON DELETE NO ACTION` | Same as RESTRICT (deferred check) |
| `ON UPDATE CASCADE` | Update FK when parent PK changes |

**Examples:**

```sql
-- Composite Primary Key
CREATE TABLE order_items (
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Named constraints
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  age INT,
  CONSTRAINT uq_users_email UNIQUE (email),
  CONSTRAINT chk_users_age CHECK (age >= 0 AND age <= 150)
);
```

### 10.2 Common Data Types

| Category | MySQL | PostgreSQL | SQL Server |
|----------|-------|------------|------------|
| **Integer** | `TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT`, `BIGINT` | `SMALLINT`, `INTEGER`, `BIGINT` | `TINYINT`, `SMALLINT`, `INT`, `BIGINT` |
| **Decimal** | `DECIMAL(p,s)`, `FLOAT`, `DOUBLE` | `NUMERIC(p,s)`, `REAL`, `DOUBLE PRECISION` | `DECIMAL(p,s)`, `FLOAT`, `REAL` |
| **String** | `CHAR(n)`, `VARCHAR(n)`, `TEXT`, `LONGTEXT` | `CHAR(n)`, `VARCHAR(n)`, `TEXT` | `CHAR(n)`, `VARCHAR(n)`, `TEXT`, `NVARCHAR` |
| **Boolean** | `BOOLEAN` (alias for `TINYINT(1)`) | `BOOLEAN` | `BIT` |
| **Date/Time** | `DATE`, `DATETIME`, `TIMESTAMP`, `TIME`, `YEAR` | `DATE`, `TIMESTAMP`, `TIMESTAMPTZ`, `TIME`, `INTERVAL` | `DATE`, `DATETIME`, `DATETIME2`, `TIME` |
| **Binary** | `BLOB`, `LONGBLOB` | `BYTEA` | `VARBINARY`, `IMAGE` |
| **JSON** | `JSON` | `JSON`, `JSONB` | `NVARCHAR(MAX)` + `ISJSON()` |
| **UUID** | `CHAR(36)` or `BINARY(16)` | `UUID` | `UNIQUEIDENTIFIER` |
| **Enum** | `ENUM('a','b','c')` | Create custom type or use CHECK | Use CHECK constraint |
| **Array** | Not supported | `INT[]`, `TEXT[]`, etc. | Not supported |

---

## 11. Schema Design & Normalization

### 11.1 Normal Forms

| Normal Form | Rule | Example Violation |
|-------------|------|-------------------|
| **1NF** | Every column contains atomic (single) values; no repeating groups | `hobbies: "reading, coding"` → split into rows |
| **2NF** | 1NF + no partial dependency (non-key depends on part of composite PK) | `order_items(order_id, product_id, product_name)` → product_name depends only on product_id |
| **3NF** | 2NF + no transitive dependency (non-key depends on another non-key) | `users(id, city, zip, state)` → state depends on zip, not id |
| **BCNF** | 3NF + every determinant is a candidate key | Rare edge cases beyond 3NF |

### 11.2 Normalization vs Denormalization

```sql
-- ✅ NORMALIZED (3NF) - Separate tables, no redundancy
-- users table
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  city_id INT REFERENCES cities(id)
);

-- cities table
CREATE TABLE cities (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  country VARCHAR(100)
);

-- ✅ DENORMALIZED - Combined for read performance
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  city_name VARCHAR(100),     -- duplicated from cities
  country VARCHAR(100)        -- duplicated from cities
);
```

### 11.3 Relationship Types

```sql
-- 1:1 (One-to-One) - user has one profile
CREATE TABLE profiles (
  id INT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,    -- UNIQUE enforces 1:1
  bio TEXT,
  avatar_url VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 1:N (One-to-Many) - user has many orders
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,           -- no UNIQUE = allows many
  total DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- M:N (Many-to-Many) - users enroll in many courses, courses have many students
CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100));
CREATE TABLE courses (id INT PRIMARY KEY, title VARCHAR(200));

-- Junction/Bridge table
CREATE TABLE enrollments (
  user_id INT,
  course_id INT,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
```

### 11.4 SQL vs MongoDB Schema Comparison

| Aspect | SQL | MongoDB |
|--------|-----|---------|
| Schema | Fixed (DDL required) | Flexible (schema-less) |
| Relationships | Foreign Keys + JOINs | Embedding or Referencing |
| 1:1 | Separate table with UNIQUE FK | Embed subdocument |
| 1:N | FK in child table | Embed array or parent-reference |
| M:N | Junction table | Array of references on both sides |
| Data Integrity | Enforced at DB level (constraints) | Enforced at app level (validators) |
| Normalization | Standard practice | Denormalization is common |

---

## 12. Views & Stored Procedures

### 12.1 Views

```sql
-- Create a view (virtual table based on a query)
CREATE VIEW active_users AS
SELECT id, name, email, city
FROM users
WHERE status = 'active';

-- Query the view like a table
SELECT * FROM active_users WHERE city = 'NYC';

-- Create or replace view
CREATE OR REPLACE VIEW active_users AS
SELECT id, name, email, city, created_at
FROM users
WHERE status = 'active';

-- Updatable view (simple views can be updated)
UPDATE active_users SET city = 'New York' WHERE id = 1;

-- Materialized view (PostgreSQL) - stores results physically
CREATE MATERIALIZED VIEW user_stats AS
SELECT
  city,
  COUNT(*) AS total,
  AVG(age) AS avg_age
FROM users
GROUP BY city;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW user_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats;  -- non-blocking

-- Drop view
DROP VIEW active_users;
DROP VIEW IF EXISTS active_users;
DROP MATERIALIZED VIEW user_stats;
```

### 12.2 Stored Procedures

```sql
-- MySQL Stored Procedure
DELIMITER //
CREATE PROCEDURE get_users_by_city(IN city_name VARCHAR(100))
BEGIN
  SELECT * FROM users WHERE city = city_name;
END //
DELIMITER ;

-- Call the procedure
CALL get_users_by_city('New York');

-- Procedure with OUT parameter (MySQL)
DELIMITER //
CREATE PROCEDURE count_users(IN city_name VARCHAR(100), OUT total INT)
BEGIN
  SELECT COUNT(*) INTO total FROM users WHERE city = city_name;
END //
DELIMITER ;

CALL count_users('NYC', @result);
SELECT @result;

-- PostgreSQL Function / Procedure
CREATE OR REPLACE FUNCTION get_users_by_city(city_name VARCHAR)
RETURNS TABLE (id INT, name VARCHAR, email VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.name, u.email
  FROM users u
  WHERE u.city = city_name;
END;
$$ LANGUAGE plpgsql;

-- Call PostgreSQL function
SELECT * FROM get_users_by_city('New York');

-- Drop
DROP PROCEDURE get_users_by_city;
DROP FUNCTION get_users_by_city;
```

### 12.3 Triggers

```sql
-- MySQL Trigger - auto-update timestamp
DELIMITER //
CREATE TRIGGER before_user_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  SET NEW.updated_at = NOW();
END //
DELIMITER ;

-- PostgreSQL Trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Audit log trigger (PostgreSQL)
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(100),
  action VARCHAR(10),
  old_data JSONB,
  new_data JSONB,
  changed_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (table_name, action, old_data, new_data)
  VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_audit
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION audit_trigger();

-- Drop trigger
DROP TRIGGER before_user_update ON users;
```

---

## 13. Transactions & Concurrency Control

### 13.1 Transaction Basics

```sql
-- Basic transaction
BEGIN;  -- or START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;  -- save changes

-- Rollback on error
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- If something goes wrong:
ROLLBACK;  -- undo all changes

-- Savepoints (partial rollback)
BEGIN;
INSERT INTO users (name) VALUES ('Alice');
SAVEPOINT sp1;

INSERT INTO users (name) VALUES ('Bob');
-- Oops, undo only Bob
ROLLBACK TO SAVEPOINT sp1;

INSERT INTO users (name) VALUES ('Charlie');
COMMIT;
-- Result: Alice and Charlie are saved, Bob is not
```

### 13.2 ACID Properties

| Property | Description |
|----------|-------------|
| **Atomicity** | All operations succeed or all fail (no partial commits) |
| **Consistency** | Database moves from one valid state to another |
| **Isolation** | Concurrent transactions don't interfere with each other |
| **Durability** | Committed data is permanently saved (survives crashes) |

### 13.3 Isolation Levels

| Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|-------|-----------|-------------------|-------------|
| `READ UNCOMMITTED` | Yes | Yes | Yes |
| `READ COMMITTED` | No | Yes | Yes |
| `REPEATABLE READ` | No | No | Yes |
| `SERIALIZABLE` | No | No | No |

```sql
-- Set isolation level
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- MySQL: Set for session
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- PostgreSQL: Set for transaction
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- ... queries ...
COMMIT;

-- Check current isolation level
SELECT @@transaction_isolation;                   -- MySQL
SHOW transaction_isolation;                       -- PostgreSQL
```

### 13.4 Locks

```sql
-- Row-level explicit lock (SELECT FOR UPDATE)
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;  -- locks the row
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;  -- releases the lock

-- SELECT FOR UPDATE SKIP LOCKED (skip already locked rows)
SELECT * FROM tasks
WHERE status = 'pending'
ORDER BY created_at
LIMIT 1
FOR UPDATE SKIP LOCKED;

-- SELECT FOR UPDATE NOWAIT (fail immediately if locked)
SELECT * FROM accounts WHERE id = 1 FOR UPDATE NOWAIT;

-- Table lock (MySQL)
LOCK TABLES users WRITE;
-- ... operations ...
UNLOCK TABLES;

-- Advisory locks (PostgreSQL)
SELECT pg_advisory_lock(42);       -- obtain lock
-- ... critical section ...
SELECT pg_advisory_unlock(42);     -- release lock
```

---

## 14. Window Functions

Window functions perform calculations across a set of table rows related to the current row, without collapsing them into a single output row (unlike GROUP BY).

### 14.1 Window Function Types

| Function | Description |
|----------|-------------|
| `ROW_NUMBER()` | Sequential number for each row in partition |
| `RANK()` | Rank with gaps for ties |
| `DENSE_RANK()` | Rank without gaps for ties |
| `NTILE(n)` | Distributes rows into n groups |
| `LAG(col, n)` | Value from n rows before |
| `LEAD(col, n)` | Value from n rows after |
| `FIRST_VALUE(col)` | First value in window frame |
| `LAST_VALUE(col)` | Last value in window frame |
| `NTH_VALUE(col, n)` | Nth value in window frame |
| `PERCENT_RANK()` | Relative rank (0 to 1) |
| `CUME_DIST()` | Cumulative distribution |
| `SUM() OVER(...)` | Running/cumulative sum |
| `AVG() OVER(...)` | Running/cumulative average |
| `COUNT() OVER(...)` | Running/cumulative count |

### 14.2 Window Function Examples

```sql
-- ROW_NUMBER - assign sequential numbers
SELECT
  name, city, age,
  ROW_NUMBER() OVER (ORDER BY age DESC) AS row_num
FROM users;

-- ROW_NUMBER with PARTITION BY - number within each group
SELECT
  name, city, age,
  ROW_NUMBER() OVER (PARTITION BY city ORDER BY age DESC) AS rank_in_city
FROM users;

-- RANK vs DENSE_RANK
SELECT
  name, score,
  RANK() OVER (ORDER BY score DESC) AS rank,            -- 1, 2, 2, 4 (gap)
  DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank -- 1, 2, 2, 3 (no gap)
FROM students;

-- Top N per group (get top 3 users per city by age)
SELECT * FROM (
  SELECT
    name, city, age,
    ROW_NUMBER() OVER (PARTITION BY city ORDER BY age DESC) AS rn
  FROM users
) ranked
WHERE rn <= 3;

-- Running total / cumulative sum
SELECT
  order_date,
  total,
  SUM(total) OVER (ORDER BY order_date) AS running_total
FROM orders;

-- Running total per user
SELECT
  user_id, order_date, total,
  SUM(total) OVER (PARTITION BY user_id ORDER BY order_date) AS running_total
FROM orders;

-- Moving average (last 7 days)
SELECT
  order_date,
  total,
  AVG(total) OVER (
    ORDER BY order_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7day
FROM orders;

-- LAG / LEAD - compare with previous/next row
SELECT
  month,
  revenue,
  LAG(revenue, 1) OVER (ORDER BY month) AS prev_month,
  revenue - LAG(revenue, 1) OVER (ORDER BY month) AS month_over_month,
  LEAD(revenue, 1) OVER (ORDER BY month) AS next_month
FROM monthly_stats;

-- NTILE - divide rows into groups
SELECT
  name, score,
  NTILE(4) OVER (ORDER BY score DESC) AS quartile
FROM students;
-- quartile 1 = top 25%, quartile 4 = bottom 25%

-- FIRST_VALUE / LAST_VALUE
SELECT
  name, city, salary,
  FIRST_VALUE(name) OVER (PARTITION BY city ORDER BY salary DESC) AS highest_paid,
  LAST_VALUE(name) OVER (
    PARTITION BY city ORDER BY salary DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS lowest_paid
FROM employees;

-- Percentage of total
SELECT
  city,
  COUNT(*) AS city_total,
  ROUND(
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2
  ) AS percentage
FROM users
GROUP BY city
ORDER BY percentage DESC;

-- Named window (reduce repetition)
SELECT
  name, salary,
  RANK() OVER w AS salary_rank,
  SUM(salary) OVER w AS running_total
FROM employees
WINDOW w AS (ORDER BY salary DESC);
```

---

## 15. Performance & Optimization

### 15.1 Query Optimization

```sql
-- EXPLAIN / EXPLAIN ANALYZE - analyze query plan
EXPLAIN SELECT * FROM users WHERE email = 'john@test.com';

-- With execution stats (PostgreSQL)
EXPLAIN ANALYZE SELECT * FROM users WHERE age > 25;

-- Key things to look for:
-- Seq Scan (bad for large tables) → needs index
-- Index Scan / Index Only Scan (good) → index is being used
-- Hash Join, Merge Join, Nested Loop → different join strategies
-- Rows (estimated vs actual) → accuracy of statistics

-- MySQL EXPLAIN
EXPLAIN SELECT * FROM users WHERE email = 'john@test.com';
-- Look for: type (ALL = full scan, ref/eq_ref = index), rows, Extra
```

### 15.2 Performance Tips

| Tip | Description |
|-----|-------------|
| **Use indexes wisely** | Create indexes for WHERE, JOIN, ORDER BY columns |
| **Use EXPLAIN** | Always check query plans for slow queries |
| **Select only needed columns** | `SELECT name, email` instead of `SELECT *` |
| **Use LIMIT** | Always limit results for large tables |
| **Avoid SELECT DISTINCT unnecessarily** | Can be expensive; fix duplicates at source |
| **Use EXISTS over IN for subqueries** | `EXISTS` short-circuits, `IN` evaluates all |
| **Avoid functions on indexed columns** | `WHERE YEAR(date) = 2026` can't use index → use range instead |
| **Use covering indexes** | Include all queried columns in the index |
| **Batch operations** | Insert/update in batches, not row-by-row |
| **Normalize for writes, denormalize for reads** | Balance based on workload |
| **Use connection pooling** | Reduce connection overhead |
| **Partition large tables** | Split by range, list, or hash |
| **Update statistics** | `ANALYZE table` (PostgreSQL), `ANALYZE TABLE table` (MySQL) |
| **Avoid N+1 queries** | Use JOINs or batch loading instead of looping |
| **Use prepared statements** | Reduces parsing overhead and prevents SQL injection |

### 15.3 Common Anti-Patterns

```sql
-- ❌ BAD: Function on indexed column prevents index usage
SELECT * FROM users WHERE YEAR(created_at) = 2026;

-- ✅ GOOD: Use range comparison
SELECT * FROM users
WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01';

-- ❌ BAD: SELECT * (fetches unnecessary data)
SELECT * FROM users;

-- ✅ GOOD: Select only needed columns
SELECT name, email FROM users;

-- ❌ BAD: N+1 queries (looping)
-- for each user { SELECT * FROM orders WHERE user_id = ? }

-- ✅ GOOD: Single JOIN query
SELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id;

-- ❌ BAD: Using OR on different columns (may not use index)
SELECT * FROM users WHERE name = 'John' OR email = 'john@test.com';

-- ✅ GOOD: Use UNION
SELECT * FROM users WHERE name = 'John'
UNION
SELECT * FROM users WHERE email = 'john@test.com';

-- ❌ BAD: Leading wildcard in LIKE
SELECT * FROM users WHERE name LIKE '%john%';

-- ✅ GOOD: Use full-text search for text matching
SELECT * FROM users WHERE MATCH(name) AGAINST('john');  -- MySQL
SELECT * FROM users WHERE name_tsvector @@ to_tsquery('john');  -- PostgreSQL
```

### 15.4 Table Partitioning

```sql
-- Range partitioning (PostgreSQL)
CREATE TABLE orders (
  id SERIAL,
  user_id INT,
  total DECIMAL(10,2),
  created_at DATE
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2025 PARTITION OF orders
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE orders_2026 PARTITION OF orders
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

-- List partitioning
CREATE TABLE users (
  id SERIAL,
  name VARCHAR(100),
  region VARCHAR(50)
) PARTITION BY LIST (region);

CREATE TABLE users_us PARTITION OF users FOR VALUES IN ('US', 'CA');
CREATE TABLE users_eu PARTITION OF users FOR VALUES IN ('UK', 'DE', 'FR');

-- Hash partitioning
CREATE TABLE logs (
  id SERIAL,
  message TEXT,
  created_at TIMESTAMP
) PARTITION BY HASH (id);

CREATE TABLE logs_0 PARTITION OF logs FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE logs_1 PARTITION OF logs FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE logs_2 PARTITION OF logs FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE logs_3 PARTITION OF logs FOR VALUES WITH (MODULUS 4, REMAINDER 3);
```

---

## 16. Node.js ORMs (Sequelize / Knex.js)

### 16.1 Sequelize ORM

```javascript
const { Sequelize, DataTypes, Op } = require('sequelize');

// --- Connection ---
const sequelize = new Sequelize('mydb', 'user', 'password', {
  host: 'localhost',
  dialect: 'postgres',  // 'mysql' | 'sqlite' | 'mssql'
  logging: false,
  pool: { max: 5, min: 0, idle: 10000 }
});

// --- Model Definition ---
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: true }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  age: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 150 }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'guide'),
    defaultValue: 'user'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,       // adds createdAt, updatedAt
  paranoid: true,          // soft delete (adds deletedAt)
  underscored: true        // snake_case column names
});

// --- Associations ---
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.belongsToMany(Course, { through: 'enrollments', foreignKey: 'user_id' });
Course.belongsToMany(User, { through: 'enrollments', foreignKey: 'course_id' });

// --- CRUD Operations ---

// Create
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  password: 'hashed_password'
});

// Bulk create
await User.bulkCreate([
  { name: 'Alice', email: 'alice@test.com', age: 25 },
  { name: 'Bob', email: 'bob@test.com', age: 35 }
]);

// Find all with conditions
const users = await User.findAll({
  where: {
    age: { [Op.gte]: 18 },
    status: 'active'
  },
  attributes: ['name', 'email', 'age'],  // SELECT specific columns
  order: [['name', 'ASC']],
  limit: 10,
  offset: 0
});

// Find by primary key
const user = await User.findByPk(1);

// Find one
const admin = await User.findOne({ where: { role: 'admin' } });

// Find or create
const [user, created] = await User.findOrCreate({
  where: { email: 'john@example.com' },
  defaults: { name: 'John', age: 30 }
});

// Include (JOIN / eager loading)
const userWithOrders = await User.findByPk(1, {
  include: [{ model: Order, as: 'orders' }]
});

// Nested include
const order = await Order.findByPk(1, {
  include: [{
    model: User,
    as: 'user',
    attributes: ['name', 'email']
  }]
});

// Update
await User.update(
  { name: 'Updated Name' },
  { where: { id: 1 } }
);

// Or update instance
const user = await User.findByPk(1);
user.name = 'Updated Name';
await user.save();

// Delete
await User.destroy({ where: { id: 1 } });

// Count
const count = await User.count({ where: { role: 'admin' } });

// Aggregate
const avgAge = await User.findAll({
  attributes: [
    [sequelize.fn('AVG', sequelize.col('age')), 'avgAge'],
    [sequelize.fn('COUNT', sequelize.col('id')), 'total']
  ]
});

// Raw query
const [results] = await sequelize.query('SELECT * FROM users WHERE age > :age', {
  replacements: { age: 25 },
  type: Sequelize.QueryTypes.SELECT
});

// Operators
const { Op } = require('sequelize');
const users = await User.findAll({
  where: {
    [Op.and]: [
      { age: { [Op.gte]: 18 } },
      { age: { [Op.lte]: 65 } }
    ],
    city: { [Op.in]: ['NYC', 'LA'] },
    name: { [Op.like]: '%john%' },
    email: { [Op.ne]: null }
  }
});

// Transaction
const t = await sequelize.transaction();
try {
  const user = await User.create({ name: 'John' }, { transaction: t });
  await Order.create({ userId: user.id, total: 100 }, { transaction: t });
  await t.commit();
} catch (error) {
  await t.rollback();
}
```

**Sequelize Operators Reference:**

| Operator | Description |
|----------|-------------|
| `Op.eq` | Equal (`=`) |
| `Op.ne` | Not equal (`<>`) |
| `Op.gt` | Greater than (`>`) |
| `Op.gte` | Greater than or equal (`>=`) |
| `Op.lt` | Less than (`<`) |
| `Op.lte` | Less than or equal (`<=`) |
| `Op.between` | Between two values |
| `Op.in` | In array |
| `Op.notIn` | Not in array |
| `Op.like` | LIKE pattern |
| `Op.iLike` | Case-insensitive LIKE (PostgreSQL) |
| `Op.and` | AND |
| `Op.or` | OR |
| `Op.not` | NOT |
| `Op.is` | IS NULL |

### 16.2 Knex.js (Query Builder)

```javascript
const knex = require('knex')({
  client: 'pg',  // 'mysql2', 'sqlite3', 'mssql'
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'user',
    password: 'password',
    database: 'mydb'
  },
  pool: { min: 0, max: 10 }
});

// --- SELECT ---
const users = await knex('users')
  .select('name', 'email', 'age')
  .where('age', '>=', 18)
  .andWhere('status', 'active')
  .orderBy('name', 'asc')
  .limit(10)
  .offset(0);

// WHERE conditions
await knex('users').where({ city: 'NYC', status: 'active' });
await knex('users').where('age', '>', 25);
await knex('users').whereIn('city', ['NYC', 'LA']);
await knex('users').whereNotIn('status', ['banned', 'inactive']);
await knex('users').whereNull('deleted_at');
await knex('users').whereNotNull('email');
await knex('users').whereBetween('age', [18, 65]);
await knex('users').whereLike('name', '%john%');
await knex('users').whereILike('name', '%john%');  // case-insensitive

// OR conditions
await knex('users')
  .where('status', 'active')
  .orWhere('role', 'admin');

// --- INSERT ---
await knex('users').insert({ name: 'John', email: 'john@test.com', age: 30 });

// Insert multiple
await knex('users').insert([
  { name: 'Alice', email: 'alice@test.com' },
  { name: 'Bob', email: 'bob@test.com' }
]);

// Insert with returning (PostgreSQL)
const [newUser] = await knex('users')
  .insert({ name: 'John', email: 'john@test.com' })
  .returning(['id', 'name', 'email']);

// --- UPDATE ---
await knex('users').where('id', 1).update({ name: 'Updated Name' });

// Increment/Decrement
await knex('products').where('id', 42).increment('stock', 5);
await knex('products').where('id', 42).decrement('stock', 1);

// --- DELETE ---
await knex('users').where('id', 1).del();

// --- JOIN ---
const result = await knex('users')
  .join('orders', 'users.id', 'orders.user_id')
  .select('users.name', 'orders.total');

const leftJoin = await knex('users')
  .leftJoin('orders', 'users.id', 'orders.user_id')
  .select('users.name', knex.raw('COUNT(orders.id) as order_count'))
  .groupBy('users.id', 'users.name');

// --- AGGREGATE ---
const stats = await knex('users')
  .select('city')
  .count('* as total')
  .avg('age as avg_age')
  .min('age as min_age')
  .max('age as max_age')
  .groupBy('city')
  .having('total', '>', 5)
  .orderBy('total', 'desc');

// --- Subquery ---
const subquery = knex('orders').select('user_id').where('total', '>', 100);
const highValueUsers = await knex('users').whereIn('id', subquery);

// --- Raw query ---
const results = await knex.raw('SELECT * FROM users WHERE age > ?', [25]);

// --- Transaction ---
await knex.transaction(async (trx) => {
  const [userId] = await trx('users')
    .insert({ name: 'John' })
    .returning('id');
  await trx('orders')
    .insert({ user_id: userId.id, total: 100 });
});

// --- Migrations ---
// npx knex migrate:make create_users_table
// npx knex migrate:latest
// npx knex migrate:rollback

// Migration file example:
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.integer('age').unsigned();
    table.enu('role', ['user', 'admin', 'guide']).defaultTo('user');
    table.string('password').notNullable();
    table.timestamps(true, true);  // created_at, updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
```

---

## 17. Interview Questions & Concepts

### 17.1 Key Concepts

| Concept | Explanation |
|---------|-------------|
| **Primary Key** | Unique identifier for each row. Cannot be NULL. One per table. |
| **Foreign Key** | Column that references a primary key in another table. Ensures referential integrity. |
| **ACID** | Atomicity, Consistency, Isolation, Durability - properties of reliable transactions. |
| **Normalization** | Process of organizing data to reduce redundancy (1NF → 2NF → 3NF → BCNF). |
| **Denormalization** | Intentionally adding redundancy for read performance. |
| **Index** | Data structure (B-tree) that speeds up queries. Trade-off: faster reads, slower writes. |
| **View** | Virtual table based on a SELECT query. Doesn't store data. |
| **Materialized View** | View that stores computed results physically. Must be refreshed. |
| **Stored Procedure** | Reusable SQL code stored in the database. |
| **Trigger** | Automatically executed SQL in response to INSERT/UPDATE/DELETE events. |
| **Cursor** | Database object for row-by-row processing of query results. |
| **Deadlock** | Two transactions waiting for each other's locks indefinitely. |
| **Clustered Index** | Determines physical order of data. Only one per table (usually PK). |
| **Non-Clustered Index** | Separate structure pointing to data rows. Multiple per table. |
| **Execution Plan** | Database's strategy for executing a query. Use EXPLAIN to view. |
| **Query Optimizer** | Component that chooses the most efficient execution plan. |
| **Connection Pooling** | Reusing database connections to reduce overhead. |
| **Prepared Statement** | Pre-compiled SQL statement. Prevents SQL injection, improves performance. |
| **Sharding** | Horizontal partitioning (splitting rows) across multiple database servers. |
| **Replication** | Copying data from one server (master) to others (replicas) for redundancy. |

### 17.2 Common Interview Questions

**Q1: What is the difference between WHERE and HAVING?**

| Feature | WHERE | HAVING |
|---------|-------|--------|
| When applied | Before GROUP BY (filters rows) | After GROUP BY (filters groups) |
| Can use aggregates? | No | Yes |
| Use without GROUP BY? | Yes | Technically yes, but unusual |

```sql
-- WHERE filters rows, HAVING filters groups
SELECT city, COUNT(*) AS total
FROM users
WHERE age > 18           -- filter rows first
GROUP BY city
HAVING COUNT(*) > 5;     -- then filter groups
```

**Q2: What is the difference between UNION and UNION ALL?**

| Feature | UNION | UNION ALL |
|---------|-------|-----------|
| Duplicates | Removes duplicates | Keeps all rows |
| Performance | Slower (dedup overhead) | Faster |

```sql
-- UNION removes duplicates
SELECT city FROM users UNION SELECT city FROM offices;

-- UNION ALL keeps all rows (including duplicates)
SELECT city FROM users UNION ALL SELECT city FROM offices;
```

**Q3: What are the different types of JOINs?**

- `INNER JOIN` - Only matching rows from both tables
- `LEFT JOIN` - All rows from left + matching from right
- `RIGHT JOIN` - All rows from right + matching from left
- `FULL OUTER JOIN` - All rows from both tables
- `CROSS JOIN` - Cartesian product (every combination)
- `SELF JOIN` - A table joined to itself

**Q4: What is the difference between DELETE, TRUNCATE, and DROP?**

| Feature | DELETE | TRUNCATE | DROP |
|---------|--------|----------|------|
| What it removes | Specific rows (with WHERE) or all | All rows | Entire table |
| Table structure | Kept | Kept | Removed |
| WHERE clause | Yes | No | No |
| Rollback | Yes (logged) | No (most DBs) | No |
| Speed | Slower (row-by-row) | Faster | Fastest |
| Auto-increment | Not reset | Reset | N/A |
| Triggers | Fires | Doesn't fire | N/A |

**Q5: What are Window Functions and how do they differ from GROUP BY?**

| Feature | GROUP BY | Window Functions |
|---------|----------|-----------------|
| Rows returned | One row per group | All original rows |
| Aggregation | Collapses rows | Adds computed column alongside rows |
| Use case | Summary statistics | Rankings, running totals, comparisons |

```sql
-- GROUP BY: one row per city
SELECT city, AVG(age) FROM users GROUP BY city;

-- Window function: all rows with city average alongside
SELECT name, city, age, AVG(age) OVER (PARTITION BY city) AS city_avg
FROM users;
```

**Q6: What is SQL Injection and how to prevent it?**

```sql
-- ❌ Vulnerable (string concatenation)
const query = `SELECT * FROM users WHERE email = '${userInput}'`;
-- Input: ' OR '1'='1 → returns all rows!

-- ✅ Safe (parameterized query)
const query = 'SELECT * FROM users WHERE email = ?';  -- MySQL
const query = 'SELECT * FROM users WHERE email = $1'; -- PostgreSQL
db.query(query, [userInput]);

-- ✅ Safe (ORM)
await User.findOne({ where: { email: userInput } });
```

**Q7: What is the difference between a Clustered and Non-Clustered Index?**

| Feature | Clustered Index | Non-Clustered Index |
|---------|----------------|-------------------|
| Physical order | Determines row storage order | Separate structure |
| Per table | Only 1 | Multiple (up to ~999) |
| Speed (range) | Faster for range queries | Slower (extra lookup) |
| Leaf nodes | Contain actual data rows | Contain pointers to rows |
| Default | Primary Key | Created manually |

**Q8: Explain the difference between CHAR and VARCHAR**

| Feature | CHAR(n) | VARCHAR(n) |
|---------|---------|------------|
| Storage | Fixed-length (always n bytes) | Variable-length (actual length + 1-2 bytes) |
| Padding | Padded with spaces | No padding |
| Performance | Slightly faster for fixed-length data | Better for variable-length data |
| Use case | Country codes, status codes | Names, emails, addresses |

**Q9: How does database indexing work?**

- Indexes use a **B-tree** (or B+ tree) data structure
- Without index: **Full table scan** - reads every row
- With index: **Index scan** - traverses the tree to find rows quickly
- Trade-off: **Faster reads**, **slower writes** (index must be updated on INSERT/UPDATE/DELETE)
- Best for: Columns used in WHERE, JOIN ON, ORDER BY, GROUP BY

**Q10: What is a Deadlock and how to handle it?**

```
Transaction A: Locks Row 1, wants Row 2
Transaction B: Locks Row 2, wants Row 1
→ Both wait forever → DEADLOCK
```

**Prevention:**
- Lock resources in the same order
- Keep transactions short
- Use appropriate isolation levels
- Use lock timeouts
- Database automatically detects and kills one transaction (victim)

---

## Quick Reference Cheat Sheet

```sql
-- ========== CRUD ==========
INSERT INTO t (c1, c2) VALUES (v1, v2);         -- Insert
SELECT c1, c2 FROM t WHERE condition;            -- Select
UPDATE t SET c1 = v1 WHERE condition;            -- Update
DELETE FROM t WHERE condition;                    -- Delete

-- ========== QUERY ==========
WHERE col = val                                   -- Equal
WHERE col <> val                                  -- Not equal
WHERE col > val                                   -- Greater than
WHERE col >= val                                  -- Greater than or equal
WHERE col < val                                   -- Less than
WHERE col <= val                                  -- Less than or equal
WHERE col IN (v1, v2)                             -- In list
WHERE col NOT IN (v1, v2)                         -- Not in list
WHERE col BETWEEN v1 AND v2                       -- Range
WHERE col LIKE 'pattern%'                         -- Pattern match
WHERE col IS NULL                                 -- Is NULL
WHERE col IS NOT NULL                             -- Not NULL
WHERE cond1 AND cond2                             -- AND
WHERE cond1 OR cond2                              -- OR
WHERE NOT cond                                    -- NOT
WHERE EXISTS (SELECT ...)                         -- Exists

-- ========== AGGREGATE ==========
SELECT COUNT(*) FROM t;                           -- Count
SELECT SUM(col) FROM t;                           -- Sum
SELECT AVG(col) FROM t;                           -- Average
SELECT MIN(col) FROM t;                           -- Minimum
SELECT MAX(col) FROM t;                           -- Maximum

-- ========== GROUP BY ==========
SELECT col, COUNT(*) FROM t GROUP BY col;         -- Group
SELECT col, COUNT(*) FROM t GROUP BY col          -- Group + filter
  HAVING COUNT(*) > 5;

-- ========== JOIN ==========
SELECT * FROM a INNER JOIN b ON a.id = b.a_id;   -- Inner join
SELECT * FROM a LEFT JOIN b ON a.id = b.a_id;    -- Left join
SELECT * FROM a RIGHT JOIN b ON a.id = b.a_id;   -- Right join
SELECT * FROM a FULL OUTER JOIN b ON a.id = b.a_id; -- Full join
SELECT * FROM a CROSS JOIN b;                     -- Cross join

-- ========== SORT & PAGINATE ==========
ORDER BY col ASC                                  -- Sort ascending
ORDER BY col DESC                                 -- Sort descending
LIMIT 10 OFFSET 20                                -- Paginate

-- ========== WINDOW ==========
ROW_NUMBER() OVER (ORDER BY col)                  -- Row number
RANK() OVER (PARTITION BY g ORDER BY col)         -- Rank
SUM(col) OVER (ORDER BY col)                      -- Running total
LAG(col, 1) OVER (ORDER BY col)                   -- Previous row

-- ========== DDL ==========
CREATE TABLE t (id INT PRIMARY KEY, ...);         -- Create table
ALTER TABLE t ADD COLUMN col TYPE;                -- Add column
ALTER TABLE t DROP COLUMN col;                    -- Drop column
DROP TABLE t;                                     -- Drop table
CREATE INDEX idx ON t (col);                      -- Create index
DROP INDEX idx;                                   -- Drop index

-- ========== TRANSACTION ==========
BEGIN;                                             -- Start transaction
COMMIT;                                            -- Save changes
ROLLBACK;                                          -- Undo changes
SAVEPOINT sp;                                      -- Create savepoint
ROLLBACK TO SAVEPOINT sp;                          -- Partial rollback
```

---

> **Last Updated:** February 2026
>
> **Author:** SQL Reference Guide for Node.js/Express Developers
>
> **Tip:** Practice these commands in a local MySQL/PostgreSQL instance or use online sandboxes like db-fiddle.com or sqlfiddle.com for hands-on learning.
