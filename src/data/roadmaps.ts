import { Roadmap } from "./content";

export const ROADMAPS: Roadmap[] = [
  {
    id: "sde-placement",
    title: "SDE Placement Roadmap",
    description: "Complete 6-month plan to crack product-based company placements. Covers DSA, CS fundamentals, projects, and interview prep.",
    category: "Placement",
    totalWeeks: 24,
    phases: [
      { week: "1-4", title: "DSA Foundations", goals: ["Complete Arrays, Strings, Hashing", "Solve 50 LeetCode Easy problems"], topics: ["Arrays & Hashing", "Two Pointers", "Sliding Window", "Binary Search"], projects: ["LeetCode Tracker"] },
      { week: "5-8", title: "Linear & Tree Structures", goals: ["Master Stack, Queue, Linked List", "Start Binary Trees"], topics: ["Stack", "Queue", "Linked List", "Binary Tree", "BST"], projects: ["DSA Visualizer"] },
      { week: "9-12", title: "Advanced DSA", goals: ["Complete Graphs, DP basics", "Reach 150 LeetCode problems"], topics: ["Graphs (BFS/DFS)", "Dynamic Programming", "Backtracking", "Greedy"], projects: ["Competitive CP Tracker"] },
      { week: "13-16", title: "CS Fundamentals", goals: ["Cover OS, DBMS, Networks", "Start System Design"], topics: ["Operating Systems", "DBMS + SQL", "Computer Networks", "OOP + Design Patterns"], projects: ["SQL Practice Problems"] },
      { week: "17-20", title: "Full Stack + Projects", goals: ["Build 2 major projects", "Deploy on Vercel/Railway"], topics: ["React + Next.js", "Node.js/FastAPI", "Supabase/PostgreSQL", "Docker basics"], projects: ["Real-Time Chat App", "AI Code Reviewer"] },
      { week: "21-24", title: "Interview Preparation", goals: ["Mock interviews daily", "Company-specific prep"], topics: ["System Design interviews", "Behavioral questions (STAR)", "Mock coding rounds", "Resume review"], projects: [] },
    ],
  },
  {
    id: "gate-cse",
    title: "GATE CSE Roadmap",
    description: "Structured 12-month preparation plan for GATE Computer Science. Covers all subjects with practice problems and mock tests.",
    category: "GATE",
    totalWeeks: 52,
    phases: [
      { week: "1-8", title: "Mathematics", goals: ["Complete Engineering Mathematics", "Solve 200 GATE PYQ"], topics: ["Discrete Mathematics", "Linear Algebra", "Probability", "Calculus"], projects: [] },
      { week: "9-16", title: "Core CS I", goals: ["Complete DSA, Algorithms, TOC"], topics: ["Data Structures", "Algorithms", "Theory of Computation"], projects: [] },
      { week: "17-24", title: "Core CS II", goals: ["Complete OS, DBMS, Networks"], topics: ["Operating Systems", "DBMS", "Computer Networks"], projects: [] },
      { week: "25-36", title: "Computer Organization & Architecture", goals: ["COA, Digital Logic, Compiler Design"], topics: ["Computer Organization", "Digital Logic", "Compiler Design"], projects: [] },
      { week: "37-48", title: "Revision + Mock Tests", goals: ["Full syllabus revision", "Take 30+ mock tests"], topics: ["Full Syllabus Revision", "GATE PYQ Analysis"], projects: [] },
      { week: "49-52", title: "Final Sprint", goals: ["Weak area focus", "Daily mock tests"], topics: ["High-weightage topics", "Last-minute formulas"], projects: [] },
    ],
  },
  {
    id: "ml-engineer",
    title: "ML Engineer Roadmap",
    description: "From Python basics to deploying production ML systems. 9-month comprehensive plan.",
    category: "Machine Learning",
    totalWeeks: 36,
    phases: [
      { week: "1-4", title: "Python & Math Foundations", goals: ["Master Python for ML", "Complete math prerequisites"], topics: ["Python + NumPy + Pandas", "Linear Algebra", "Calculus", "Statistics"], projects: ["Data analysis notebook"] },
      { week: "5-10", title: "Classical Machine Learning", goals: ["Implement 10 ML algorithms", "Compete in Kaggle beginner"], topics: ["Linear/Logistic Regression", "Decision Trees", "SVM", "K-Means", "Model evaluation"], projects: ["Titanic Kaggle", "House Price Prediction"] },
      { week: "11-18", title: "Deep Learning", goals: ["Train custom CNNs", "Build NLP classifier"], topics: ["Neural Networks", "CNNs", "RNNs/LSTMs", "PyTorch", "Transfer Learning"], projects: ["Image Classifier", "Sentiment Analyzer"] },
      { week: "19-26", title: "NLP & Transformers", goals: ["Fine-tune a BERT model", "Build RAG chatbot"], topics: ["Transformers", "BERT/GPT", "Fine-tuning with PEFT", "Hugging Face ecosystem"], projects: ["Document Q&A with RAG"] },
      { week: "27-32", title: "MLOps & Production", goals: ["Deploy ML model to production", "Set up CI/CD for ML"], topics: ["FastAPI for ML", "Docker + Kubernetes basics", "MLflow tracking", "Weights & Biases"], projects: ["ML Model API", "Automated training pipeline"] },
      { week: "33-36", title: "Specialization", goals: ["Choose focus: CV, NLP, or GenAI"], topics: ["Advanced specialization topics", "Research paper reading", "Open source contributions"], projects: [] },
    ],
  },
  {
    id: "fullstack-dev",
    title: "Full Stack Developer Roadmap",
    description: "Modern full-stack web development from HTML to deploying production apps with CI/CD.",
    category: "Full Stack",
    totalWeeks: 32,
    phases: [
      { week: "1-4", title: "Web Fundamentals", goals: ["Build 3 HTML/CSS websites", "Understand DOM"], topics: ["HTML5 semantics", "CSS Flexbox + Grid", "CSS animations", "Responsive design"], projects: ["Portfolio website", "Landing page"] },
      { week: "5-10", title: "JavaScript & TypeScript", goals: ["Build interactive apps", "Understand async JS"], topics: ["JavaScript ES2024", "TypeScript", "DOM manipulation", "Fetch API + REST"], projects: ["Weather app", "Todo app"] },
      { week: "11-18", title: "React & Next.js", goals: ["Build full Next.js app with auth"], topics: ["React hooks", "Next.js App Router", "Server Components", "Clerk/NextAuth"], projects: ["Blog with CMS", "Social platform"] },
      { week: "19-24", title: "Backend & Databases", goals: ["Build REST API with auth & DB"], topics: ["Node.js/Express or FastAPI", "PostgreSQL + SQL", "Supabase/Prisma", "Redis caching"], projects: ["REST API with Supabase", "Real-time chat"] },
      { week: "25-28", title: "DevOps & Cloud", goals: ["Deploy on AWS/Vercel", "Set up CI/CD pipeline"], topics: ["Docker + docker-compose", "GitHub Actions CI/CD", "Vercel/Railway deployment", "Environment management"], projects: ["Dockerized app", "Auto-deploy pipeline"] },
      { week: "29-32", title: "Advanced Topics", goals: ["Learn System Design", "Contribute to OSS"], topics: ["System Design basics", "Performance optimization", "Web security (OWASP)", "Testing (Jest, Playwright)"], projects: ["Production-ready SaaS"] },
    ],
  },
];
