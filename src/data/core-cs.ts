import { CoreCSSubject } from "./content";

export const CORE_CS_SUBJECTS: CoreCSSubject[] = [
  {
    id: "os",
    name: "Operating Systems",
    icon: "Monitor",
    color: "#6366f1",
    description: "Processes, threads, memory management, file systems, and concurrency — the software that runs software.",
    chapters: [
      {
        title: "Process Management",
        topics: ["Process vs Thread", "Process Control Block (PCB)", "Process states: New, Ready, Running, Waiting, Terminated", "Context switching", "fork() and exec() system calls", "Inter-process communication (pipes, semaphores, shared memory)", "Process scheduling (FCFS, SJF, Round Robin, Priority, MLFQ)"],
        interviewQuestions: ["What is the difference between process and thread?", "Explain context switching overhead.", "What is a race condition? How do you prevent it?", "What is deadlock? State the 4 Coffman conditions.", "Explain the difference between mutex and semaphore."],
      },
      {
        title: "Memory Management",
        topics: ["Virtual memory & address spaces", "Paging and page tables", "TLB (Translation Lookaside Buffer)", "Page replacement algorithms: LRU, FIFO, Optimal", "Segmentation", "Memory allocation: First-fit, Best-fit, Worst-fit", "Garbage collection overview"],
        interviewQuestions: ["What is virtual memory and why is it useful?", "Explain thrashing.", "How does the OS handle a page fault?", "What is the difference between internal and external fragmentation?"],
      },
      {
        title: "Concurrency & Synchronization",
        topics: ["Critical sections", "Mutex locks", "Semaphores (binary and counting)", "Monitors", "Deadlock prevention, avoidance (Banker's algorithm), detection", "Readers-writers problem", "Producer-consumer problem", "Dining philosophers"],
        interviewQuestions: ["Implement a thread-safe queue.", "Explain the Producer-Consumer problem.", "What is a spinlock vs a mutex?", "How does Java's synchronized keyword work?"],
      },
      {
        title: "File Systems",
        topics: ["File system abstraction", "Directory structure", "Inodes and data blocks", "FAT vs ext4 vs NTFS", "File system journaling", "VFS (Virtual File System)", "RAID levels 0, 1, 5, 6, 10"],
        interviewQuestions: ["What is an inode?", "Explain journaling in file systems.", "What is the difference between soft and hard links?"],
      },
    ],
  },
  {
    id: "dbms",
    name: "Database Management Systems",
    icon: "Database",
    color: "#10b981",
    description: "Relational databases, SQL mastery, ACID guarantees, normalization, and query optimization.",
    chapters: [
      {
        title: "Relational Model & SQL",
        topics: ["Tables, rows, columns, schemas", "Primary key, foreign key, constraints", "SELECT, INSERT, UPDATE, DELETE", "JOINs: INNER, LEFT, RIGHT, FULL, CROSS, SELF", "Aggregation: GROUP BY, HAVING, ORDER BY", "Window functions: ROW_NUMBER, RANK, LAG/LEAD", "CTEs (WITH clause)", "Subqueries vs CTEs"],
        interviewQuestions: ["Write SQL to find the second highest salary.", "Explain the difference between HAVING and WHERE.", "What is a self-join? Give an example.", "Difference between UNION and UNION ALL?"],
      },
      {
        title: "Normalization",
        topics: ["Functional dependencies", "1NF, 2NF, 3NF, BCNF", "Anomalies: insert, update, delete", "Denormalization for performance", "Database design case studies"],
        interviewQuestions: ["What is BCNF? When do you violate it intentionally?", "Explain the update anomaly in 1NF.", "When would you denormalize a schema?"],
      },
      {
        title: "Transactions & ACID",
        topics: ["Atomicity, Consistency, Isolation, Durability", "Transaction states", "Concurrency control: 2-phase locking (2PL)", "Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable", "Dirty reads, phantom reads, non-repeatable reads", "Deadlock detection in databases", "MVCC (Postgres approach)"],
        interviewQuestions: ["What is ACID? Explain each property.", "What is the difference between Repeatable Read and Serializable?", "How does PostgreSQL implement MVCC?", "What is a phantom read?"],
      },
      {
        title: "Indexing & Query Optimization",
        topics: ["B-tree index structure", "Hash indexes", "Composite indexes & index selectivity", "EXPLAIN ANALYZE in PostgreSQL", "Query planner internals", "Index vs full table scan decisions", "Covering indexes", "Partial indexes"],
        interviewQuestions: ["When does MySQL not use an index?", "What is a covering index?", "Explain the difference between a clustered and non-clustered index."],
      },
    ],
  },
  {
    id: "networks",
    name: "Computer Networks",
    icon: "Wifi",
    color: "#3b82f6",
    description: "OSI model, TCP/IP, HTTP, DNS, TLS, and the infrastructure of the internet.",
    chapters: [
      {
        title: "OSI & TCP/IP Model",
        topics: ["7-layer OSI model", "TCP/IP 4-layer model", "Physical, Data Link, Network, Transport, Application layers", "Encapsulation and decapsulation", "PDUs: bits, frames, packets, segments, data"],
        interviewQuestions: ["What happens when you type a URL in a browser?", "What is the difference between TCP and UDP?", "At which OSI layer does routing happen?"],
      },
      {
        title: "TCP/IP & Protocols",
        topics: ["IP addressing (IPv4, IPv6)", "Subnetting and CIDR notation", "TCP 3-way handshake", "TCP flow control and congestion control", "UDP characteristics", "ICMP (ping, traceroute)", "ARP (address resolution)", "NAT (network address translation)"],
        interviewQuestions: ["Explain TCP's 3-way handshake.", "What is the difference between TCP and UDP? When to use each?", "Explain how NAT works.", "What is ARP poisoning?"],
      },
      {
        title: "Application Layer Protocols",
        topics: ["HTTP/1.1 vs HTTP/2 vs HTTP/3", "HTTPS & TLS handshake", "DNS resolution (recursive, iterative)", "SMTP, POP3, IMAP for email", "WebSockets vs long polling vs SSE", "REST vs GraphQL vs gRPC"],
        interviewQuestions: ["Explain the TLS handshake.", "What is the difference between HTTP/2 and HTTP/3?", "How does DNS resolution work?", "What is the difference between WebSockets and HTTP?"],
      },
    ],
  },
  {
    id: "oops",
    name: "Object-Oriented Programming",
    icon: "Boxes",
    color: "#f59e0b",
    description: "Design principles, SOLID, design patterns, and OOP mastery.",
    chapters: [
      {
        title: "OOP Pillars",
        topics: ["Encapsulation: hiding state, exposing behavior", "Abstraction: defining contracts (interfaces, abstract classes)", "Inheritance: IS-A relationships, code reuse, fragile base class problem", "Polymorphism: method overriding, dynamic dispatch, duck typing"],
        interviewQuestions: ["What is the difference between abstraction and encapsulation?", "When is inheritance wrong? Use composition instead?", "What is the Liskov Substitution Principle?"],
      },
      {
        title: "SOLID Principles",
        topics: ["S — Single Responsibility Principle", "O — Open/Closed Principle", "L — Liskov Substitution Principle", "I — Interface Segregation Principle", "D — Dependency Inversion Principle", "Real-world violations and refactoring examples"],
        interviewQuestions: ["Give an example of SRP violation.", "Explain the Dependency Inversion Principle.", "How does SOLID relate to testability?"],
      },
      {
        title: "Design Patterns",
        topics: ["Creational: Singleton, Factory, Abstract Factory, Builder, Prototype", "Structural: Adapter, Bridge, Composite, Decorator, Facade, Proxy", "Behavioral: Observer, Strategy, Command, Iterator, Template Method, Chain of Responsibility", "When to use each pattern", "Anti-patterns to avoid"],
        interviewQuestions: ["Implement the Observer pattern.", "When would you use a Decorator vs inheritance?", "What is the difference between Factory and Abstract Factory?", "Explain the Strategy pattern with a real example."],
      },
    ],
  },
  {
    id: "system-design",
    name: "System Design",
    icon: "HardDrive",
    color: "#a855f7",
    description: "Design scalable systems: URL shorteners, chat apps, Netflix, and Twitter.",
    chapters: [
      {
        title: "Scalability Fundamentals",
        topics: ["Horizontal vs vertical scaling", "Load balancing algorithms (Round Robin, Least Connections, IP Hash)", "Caching strategies (CDN, reverse proxy, application cache)", "Database sharding (horizontal partitioning)", "CAP theorem", "Eventual consistency vs strong consistency", "Rate limiting algorithms (token bucket, leaky bucket)"],
        interviewQuestions: ["Design a URL shortener (TinyURL).", "How would you scale a database to 1 billion users?", "Explain the CAP theorem with an example.", "What is the difference between caching at CDN vs application level?"],
      },
      {
        title: "Distributed Systems",
        topics: ["Microservices vs monolith tradeoffs", "Service discovery (Consul, Kubernetes)", "Message queues (Kafka, RabbitMQ)", "Event sourcing and CQRS", "Distributed transactions (2PC, Saga pattern)", "Consensus algorithms (Raft, Paxos overview)", "Consistent hashing"],
        interviewQuestions: ["Design a distributed message queue.", "Explain consistent hashing.", "What is the Saga pattern? When do you use it?"],
      },
      {
        title: "Famous System Design Problems",
        topics: ["Design Twitter feed (fan-out on write vs read)", "Design Netflix video streaming", "Design WhatsApp/chat system", "Design Google Docs (collaborative editing, OT)", "Design Uber / ride matching", "Design a web crawler", "Design a distributed cache (Redis)"],
        interviewQuestions: ["Walk me through designing Instagram's timeline.", "How would you design a real-time notification system?"],
      },
    ],
  },
  {
    id: "linux",
    name: "Linux & Shell",
    icon: "Terminal",
    color: "#84cc16",
    description: "Command mastery, shell scripting, process management, and Linux internals.",
    chapters: [
      {
        title: "Essential Commands",
        topics: ["File operations: ls, cp, mv, rm, mkdir, touch, chmod, chown", "Text processing: cat, grep, sed, awk, cut, sort, uniq, wc", "Process management: ps, top, htop, kill, nice, nohup", "Network: curl, wget, netstat, ss, lsof, tcpdump", "Disk: df, du, fdisk, mount, lsblk", "Package management: apt, yum, pacman, brew"],
        interviewQuestions: ["Find all files larger than 100MB: `find / -size +100M`", "Monitor system logs in real-time: `tail -f /var/log/syslog`", "Kill all processes matching a name: `pkill -f process_name`"],
      },
      {
        title: "Bash Scripting",
        topics: ["Variables, arrays, and string operations", "Control flow: if/elif/else, for/while/until", "Functions and return values", "Error handling: set -euo pipefail", "Input/output redirection and pipes", "Cron jobs and task scheduling", "Regular expressions in bash"],
        interviewQuestions: ["Write a script to backup a directory daily.", "Explain the difference between `'` and `\"` in bash.", "What is `set -euo pipefail` and why is it important?"],
      },
    ],
  },
];
