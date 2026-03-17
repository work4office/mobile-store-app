**How does Node.js work?**
Node.js works on a single-threaded, event-driven architecture using the V8 JavaScript engine.
**V8 Engine:** Compiles JavaScript into fast machine code.
**Event Loop:** Handles asynchronous tasks (I/O, timers, requests) without blocking the main thread.
**Libuv library:** Provides a thread pool and handles background tasks like file system operations and networking.
**Non-blocking I/O:** Lets Node.js process thousands of concurrent requests efficiently without creating multiple threads

**What is NPM?**
NPM stands for the Node Package Manager. It is the package manager for the NodeJS environment. It is used to install, share, and manage dependencies (libraries, tools, or packages) in JavaScript applications. Below are the following key points about the NPM:

NPM uses a package.json file in NodeJS projects to track project dependencies, versions, scripts, and metadata like the project's name and version.
NPM is accessed by a command-line interface (CLI). Common commands include npm install to install packages, npm update to update them, and npm uninstall to remove them.

**Why is NodeJS single-threaded?**
NodeJS is single-threaded because it's based on the asynchronous, non-blocking nature of JavaScript. This design makes it simpler to develop and maintain, and it allows NodeJS to handle many concurrent requests efficiently.

**If NodeJS is single-threaded, then how does it handle concurrency?**
NodeJS is single-threaded, but it can handle concurrency efficiently through its event-driven, non-blocking I/O model.

While the event loop in NodeJS runs on a single thread, it doesn’t block the execution of other tasks when waiting for I/O operations, such as file reads or database queries. Instead, NodeJS delegates these I/O tasks to the system's kernel, allowing it to continue processing other requests.
Once the I/O operation is complete, the corresponding callback is added to a queue and processed by the event loop.
This non-blocking approach enables NodeJS to handle multiple concurrent tasks without waiting for each one to finish sequentially.

**Why is NodeJS preferred over other backend technologies like Java and PHP?**
Here are some reasons why NodeJS is preferred:

Fast Performance: NodeJS is known for its speed in handling I/O-heavy tasks.
NPM Ecosystem: Node Package Manager offers over 50,000 bundles to help developers speed up development.
Real-Time Applications: Perfect for data-intensive, real-time apps as it doesn't wait for APIs to return data.
Unified Codebase: The Same code is used for both server and client, improving synchronization.
Easy for JavaScript Developers: Since NodeJS is based on JavaScript, web developers can easily integrate it into their projects.

**What are the module in NodeJS?**
In a NodeJS Application, a Module can be considered as a block of code that provides a simple or complex functionality that can communicate with external application. Modules can be organized in a single file or a collection of multiple files/folders. They are useful because of their reusability and ability to reduce the complexity of code into smaller pieces. Examples of modules are. http, fs, os, path, etc.

**What is V8 engine in Node.js?**
The V8 engine in Node.js is an open-source JavaScript engine developed by Google, written in C++. It is the same engine that powers Google Chrome. In Node.js, the V8 engine:

Compiles JavaScript to native machine code instead of interpreting it, making execution very fast.
Manages memory and garbagecollection, ensuring efficient use of system resources.
Provides the core runtime for executing JavaScript outside the browser, which Node.js then extends with additional APIs (like file system, networking, etc.).

**What is control flow in NodeJS?**
In Node.js, control flow refers to the order in which asynchronous operations (like file reads, API calls, DB queries) are executed and how their results are handled.

Because, Node.js is non-blocking and event-driven, tasks don’t always finish in the order they start. Control flow ensures they are managed correctly.

**What do you mean by event loop in NodeJS?**
The event loop in NodeJS is a mechanism that allows it to handle multiple asynchronous tasks concurrently within a single thread. It continuously listens for events and executes associated callback functions.

Example:
```javascript
console.log("Start");
setTimeout(() => {
  console.log("Timeout callback");
}, 0);
console.log("End");
```

**What is the order in which control flow statements get executed?**
The order in which the statements are executed is as follows:

Execution and queue handling
Collection of data and storing it
Handling concurrency
Executing the next lines of code

**What are the main disadvantages of NodeJS?**
Here are some main disadvantages of NodeJS listed below:

**Single-threaded nature:** It may not fully utilize multi-core CPUs, limiting performance.
**NoSQL preference:** Relational databases like MySQL aren't commonly used.
**Rapid API changes:** Frequent updates can introduce instability and compatibility issues.

**What is REPL in NodeJS?**
REPL in NodeJS stands for Read, Evaluate, Print, and Loop. It is a computer environment similar to the shell which is useful for writing and debugging code as it executes the code in on go.

**Read:** It reads the input provided by the user (JavaScript expressions or commands).
**Eval:** It evaluates the input (executes the code).
**Print:** It prints the result of the evaluation to the console.
**Loop:** It loops back, allowing you to enter more code and get immediate results.

**What is event-driven programming in NodeJS?**
Event-driven programming is used to synchronize the occurrence of multiple events and to make the program as simple as possible. The basic components of an Event-Driven Program are:

A callback function ( called an event handler) is called when an event is triggered.
An event loop that listens for event triggers and calls the corresponding event handler for that event.

**What is a buffer in NodeJS?**
The Buffer class in NodeJS is used to perform operations on raw binary data. Generally, Buffer refers to the particular memory location in memory. Buffer and array have some similarities, but the difference is that array can be any type, and it can be resizable. Buffers only deal with binary data, and it can not be resizable. Each integer in a buffer represents a byte. console.log() function is used to print the Buffer instance.

**What are streams in NodeJS?**
In NodeJS, streams are a powerful way to handle data in chunks rather than loading the entire data into memory. Streams allow for the efficient processing of large volumes of data, especially in situations where the data size is too large to fit into memory all at once.

There are four types of the Streams:

**Readable Streams:** These streams allow you to read data. For example, reading data from a file or receiving HTTP request data. Example:
fs.createReadStream() or http.IncomingMessage.
**Writable Streams:** These streams allow you to write data. For example, writing data to a file or sending HTTP response data. Example:
 fs.createWriteStream() or http.ServerResponse.
**Duplex Streams:** These are both readable and writable. You can both read and write data using the same stream. Example: A TCP socket.
**Transform Streams:** These are a type of duplex stream where the data is transformed as it is read and written. Example: A zlib stream to compress or decompress data.

**Explain the crypto module in NodeJS.**
The crypto module is used for encrypting, decrypting, or hashing any type of data. This encryption and decryption basically help to secure and add a layer of authentication to the data. The main use case of the crypto module is to convert the plain readable text to an encrypted format and decrypt it when required.

**What is callback hell?**
Callback hell is an issue caused by a nested callback. This causes the code to look like a pyramid and makes it unable to read To overcome this situation, we use promises.

**Explain the use of the timers module in NodeJS.**
The Timers module in NodeJS contains various functions that allow us to execute a block of code or a function after a set period. The Timers module is global, we do not need to use require() to import it. 

It has the following methods:

1. setTimeout() method
The setTimeout() function is used to execute a function once after a specified delay (in milliseconds).

setTimeout(callback, delay, [arg1, arg2, ...]);
callback: The function to be executed after the delay.
delay: The time in milliseconds after which the function is executed.
[arg1, arg2, ...]: Optional arguments that can be passed to the callback function.

2. setImmediate() method
The setImmediate() function is used to execute a callback function immediately after the current event loop cycle, i.e., after the I/O events in the NodeJS event loop have been processed. It is similar to setTimeout() with a delay of 0 milliseconds, but it differs in terms of when the function is executed.

setImmediate(callback, [arg1, arg2, ...]);
callback: The function to be executed.
[arg1, arg2, ...]: Optional arguments to pass to the callback function.

3. setInterval() method
The setInterval() function is used to execute a function repeatedly, with a fixed time delay between each call.

setInterval(callback, delay, [arg1, arg2, ...]);
callback: The function to be executed repeatedly.
delay: The time in milliseconds between each execution.
[arg1, arg2, ...]: Optional arguments that can be passed to the callback function.

**Difference between setImmediate() and process.nextTick() methods**
**setImmediate()**	|| **process.nextTick()**
Executes callback in the check phase of the event loop ||	Executes callback in the next tick queue
Runs after I/O events	|| Runs before I/O events
Scheduled to run on the next iteration of the event loop ||	Runs immediately after the current operation completes
Lower priority than nextTick ||	Higher priority than setImmediate
Does not block I/O operations ||	Can block I/O if overused
Used when you want to run code after I/O tasks ||	Used for immediate execution after current function

**What is the difference between spawn() and fork() method?**
**spawn()**	|| **fork()**
Used to run any system command	|| Used specifically to create new Node.js processes
Executes external programs	|| Executes another JavaScript file
Does not create communication channel by default  ||  Creates built-in communication channel (IPC)
Suitable for running large processes  ||  Suitable for Node-to-Node communication
Returns a stream for data handling	||  Returns an object with messaging support
Used for general process execution	||  Used for creating child Node.js modules

**What is a, fork in NodeJS?**
Fork is a method in NodeJS that is used to create child processes. It helps to handle the increasing workload. It creates a new instance of the engine which enables multiple processes to run the code.

