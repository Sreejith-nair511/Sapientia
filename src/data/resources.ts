export interface Resource {
  id: string;
  title: string;
  author: string;
  type: "Book" | "Course" | "YouTube" | "Website" | "GitHub" | "Article" | "Paper" | "Tool";
  category: string;
  url: string;
  description: string;
  isFree: boolean;
  difficulty: string;
  rating: number;
  tags: string[];
}

export const RESOURCES: Resource[] = [
  // DSA
  { id: "1", title: "Striver A2Z DSA Sheet", author: "TakeUForward", type: "Website", category: "DSA", url: "https://takeuforward.org/strivers-a2z-dsa-course", description: "The most popular free DSA curriculum. 455 problems organized by topic.", isFree: true, difficulty: "Beginner to Expert", rating: 5, tags: ["DSA", "Competitive", "Interview"] },
  { id: "2", title: "NeetCode 150", author: "NeetCode", type: "YouTube", category: "DSA", url: "https://neetcode.io/practice", description: "The most important 150 LeetCode problems with video explanations.", isFree: true, difficulty: "Medium", rating: 5, tags: ["DSA", "Interview", "LeetCode"] },
  { id: "3", title: "Introduction to Algorithms (CLRS)", author: "Cormen et al.", type: "Book", category: "DSA", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/", description: "The definitive algorithms textbook. Dense but comprehensive.", isFree: false, difficulty: "Advanced", rating: 5, tags: ["Algorithms", "Theory", "DSA"] },
  { id: "4", title: "Competitive Programmer's Handbook", author: "Antti Laaksonen", type: "Book", category: "DSA", url: "https://cses.fi/book/book.pdf", description: "Free e-book covering all competitive programming topics.", isFree: true, difficulty: "Intermediate to Advanced", rating: 5, tags: ["CP", "DSA", "Algorithms"] },
  // Algorithms / CP
  { id: "5", title: "CSES Problem Set", author: "CSES", type: "Website", category: "Competitive Programming", url: "https://cses.fi/problemset", description: "300 high-quality competitive programming problems, perfect for beginners.", isFree: true, difficulty: "Medium", rating: 5, tags: ["CP", "Practice", "Algorithms"] },
  { id: "6", title: "CP-Algorithms", author: "Community", type: "Website", category: "Competitive Programming", url: "https://cp-algorithms.com", description: "Detailed explanations and code for all competitive programming algorithms.", isFree: true, difficulty: "Advanced", rating: 5, tags: ["CP", "Algorithms", "Reference"] },
  // C++
  { id: "7", title: "cppreference.com", author: "Community", type: "Website", category: "C++", url: "https://cppreference.com", description: "The definitive C++ reference. Every STL class, method, and overload documented.", isFree: true, difficulty: "All levels", rating: 5, tags: ["C++", "STL", "Reference"] },
  { id: "8", title: "Effective Modern C++", author: "Scott Meyers", type: "Book", category: "C++", url: "https://www.oreilly.com/library/view/effective-modern-c/9781491908419/", description: "42 specific ways to improve your use of C++11 and C++14.", isFree: false, difficulty: "Advanced", rating: 5, tags: ["C++", "Modern C++", "Best Practices"] },
  // Python / AI
  { id: "9", title: "fast.ai Practical Deep Learning", author: "Jeremy Howard", type: "Course", category: "Machine Learning", url: "https://course.fast.ai", description: "Top-down approach to deep learning. Build models before theory.", isFree: true, difficulty: "Intermediate", rating: 5, tags: ["Python", "Deep Learning", "PyTorch"] },
  { id: "10", title: "Deep Learning Specialization", author: "Andrew Ng (Coursera)", type: "Course", category: "Machine Learning", url: "https://www.coursera.org/specializations/deep-learning", description: "5-course specialization covering neural networks, CNNs, sequence models.", isFree: false, difficulty: "Intermediate", rating: 5, tags: ["ML", "Deep Learning", "Neural Networks"] },
  { id: "11", title: "Neural Networks: Zero to Hero", author: "Andrej Karpathy", type: "YouTube", category: "Machine Learning", url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", description: "Build neural networks and GPT from scratch with pure Python.", isFree: true, difficulty: "Intermediate", rating: 5, tags: ["DL", "LLM", "PyTorch", "Backprop"] },
  { id: "12", title: "Hands-On Machine Learning", author: "Aurélien Géron", type: "Book", category: "Machine Learning", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/", description: "Best practical ML book. Sklearn, Keras, TensorFlow from basics to production.", isFree: false, difficulty: "Intermediate", rating: 5, tags: ["ML", "Python", "Sklearn"] },
  // Full Stack
  { id: "13", title: "Next.js Documentation", author: "Vercel", type: "Website", category: "Full Stack", url: "https://nextjs.org/docs", description: "Official Next.js docs. The App Router section is essential for modern Next.js.", isFree: true, difficulty: "Intermediate", rating: 5, tags: ["Next.js", "React", "Full Stack"] },
  { id: "14", title: "The Odin Project", author: "Community", type: "Website", category: "Full Stack", url: "https://www.theodinproject.com", description: "Free, open-source full stack curriculum from HTML to Node.js.", isFree: true, difficulty: "Beginner to Advanced", rating: 5, tags: ["Full Stack", "JavaScript", "Node.js"] },
  { id: "15", title: "Supabase Documentation", author: "Supabase", type: "Website", category: "Full Stack", url: "https://supabase.com/docs", description: "Firebase alternative with Postgres. Auth, database, storage, realtime.", isFree: true, difficulty: "Intermediate", rating: 5, tags: ["Database", "Backend", "Full Stack"] },
  // System Design
  { id: "16", title: "System Design Primer", author: "Donne Martin", type: "GitHub", category: "System Design", url: "https://github.com/donnemartin/system-design-primer", description: "The most starred system design resource on GitHub. Covers all major topics.", isFree: true, difficulty: "Advanced", rating: 5, tags: ["System Design", "Architecture", "Interview"] },
  { id: "17", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", type: "Book", category: "System Design", url: "https://dataintensive.net", description: "The bible of distributed systems engineering. Read this cover to cover.", isFree: false, difficulty: "Advanced", rating: 5, tags: ["Distributed Systems", "Databases", "System Design"] },
  // Core CS
  { id: "18", title: "Operating Systems: Three Easy Pieces", author: "Arpaci-Dusseau", type: "Book", category: "Core CS", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", description: "Free online OS textbook used by hundreds of universities.", isFree: true, difficulty: "Intermediate", rating: 5, tags: ["OS", "Systems", "Concurrency"] },
  { id: "19", title: "CS50 Harvard", author: "David Malan", type: "Course", category: "Core CS", url: "https://cs50.harvard.edu", description: "The best intro CS course. Free from Harvard. C, Python, SQL, web.", isFree: true, difficulty: "Beginner", rating: 5, tags: ["CS Fundamentals", "C", "Python"] },
  // GATE
  { id: "20", title: "GATE Overflow", author: "Community", type: "Website", category: "GATE", url: "https://gateoverflow.in", description: "Full archive of GATE PYQs with community explanations.", isFree: true, difficulty: "Advanced", rating: 5, tags: ["GATE", "CSE", "PYQ"] },
  // Git / DevOps
  { id: "21", title: "Pro Git Book", author: "Scott Chacon", type: "Book", category: "DevOps", url: "https://git-scm.com/book/en/v2", description: "Comprehensive guide to Git. Free online. Covers everything from basics to internals.", isFree: true, difficulty: "Beginner to Advanced", rating: 5, tags: ["Git", "DevOps", "Tools"] },
  { id: "22", title: "Docker Documentation", author: "Docker", type: "Website", category: "DevOps", url: "https://docs.docker.com", description: "Official Docker docs with tutorials for containerizing applications.", isFree: true, difficulty: "Intermediate", rating: 4, tags: ["Docker", "DevOps", "Containers"] },
  // Math / Research
  { id: "23", title: "3Blue1Brown (YouTube)", author: "Grant Sanderson", type: "YouTube", category: "Mathematics", url: "https://www.youtube.com/c/3blue1brown", description: "The best math visualizations on YouTube. Calculus, Linear Algebra, Probability.", isFree: true, difficulty: "All levels", rating: 5, tags: ["Math", "Linear Algebra", "Calculus", "Visualizations"] },
  { id: "24", title: "Attention Is All You Need", author: "Vaswani et al.", type: "Paper", category: "Research", url: "https://arxiv.org/abs/1706.03762", description: "The transformer paper that changed everything. Required reading for anyone in AI.", isFree: true, difficulty: "Advanced", rating: 5, tags: ["Transformers", "LLM", "NLP", "Research"] },
];

export const RESOURCE_CATEGORIES = ["All", "DSA", "Competitive Programming", "C++", "Machine Learning", "Full Stack", "System Design", "Core CS", "Mathematics", "GATE", "DevOps", "Research"];
export const RESOURCE_TYPES = ["All", "Book", "Course", "YouTube", "Website", "GitHub", "Article", "Paper", "Tool"];
