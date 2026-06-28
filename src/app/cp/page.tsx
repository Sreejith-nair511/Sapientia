"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy, Code2, Calendar, ExternalLink, BookOpen,
  ChevronRight, Clock, FileCode2, Zap, Star
} from "lucide-react";

const CP_TOPICS = [
  {
    id: "number-theory",
    title: "Number Theory",
    difficulty: "Medium",
    problems: ["GCD/LCM (Euclidean)", "Sieve of Eratosthenes", "Prime factorization", "Modular arithmetic", "Modular inverse (Fermat)", "Chinese Remainder Theorem"],
    template: `// GCD
ll gcd(ll a, ll b) { return b ? gcd(b, a % b) : a; }
// Fast power mod
ll pw(ll a, ll b, ll mod) {
  ll res = 1; a %= mod;
  for (; b > 0; b >>= 1) {
    if (b & 1) res = res * a % mod;
    a = a * a % mod;
  }
  return res;
}`,
  },
  {
    id: "graph-advanced",
    title: "Advanced Graphs",
    difficulty: "Hard",
    problems: ["Dijkstra (weighted shortest path)", "Bellman-Ford (negative edges)", "Floyd-Warshall (all pairs)", "Kruskal MST", "Prim MST", "Tarjan SCC", "Bridges & Articulation Points"],
    template: `// Dijkstra
vector<ll> dijkstra(int src, vector<vector<pair<int,ll>>>& adj) {
  vector<ll> dist(n, 1e18);
  priority_queue<pair<ll,int>, vector<pair<ll,int>>, greater<>> pq;
  dist[src] = 0; pq.push({0, src});
  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;
    for (auto [v, w] : adj[u])
      if (dist[u] + w < dist[v])
        pq.push({dist[v] = dist[u] + w, v});
  }
  return dist;
}`,
  },
  {
    id: "dp-advanced",
    title: "Advanced DP",
    difficulty: "Hard",
    problems: ["Bitmask DP", "Digit DP", "Tree DP", "Interval DP", "SOS DP (Sum over Subsets)", "Convex Hull Trick"],
    template: `// Bitmask DP (TSP example)
int dp[1 << N][N];
// dp[mask][i] = min cost to visit exactly
// the nodes in mask, ending at node i
for (int mask = 1; mask < (1 << n); mask++) {
  for (int i = 0; i < n; i++) {
    if (!(mask >> i & 1)) continue;
    for (int j = 0; j < n; j++) {
      if (mask >> j & 1) continue;
      dp[mask | (1 << j)][j] = min(..., dp[mask][i] + dist[i][j]);
    }
  }
}`,
  },
  {
    id: "data-structures-adv",
    title: "Advanced Data Structures",
    difficulty: "Hard",
    problems: ["Segment Tree (range queries)", "Lazy Propagation", "Fenwick Tree (BIT)", "Sparse Table (RMQ)", "Trie", "DSU / Union-Find", "Sqrt Decomposition"],
    template: `// Segment Tree with lazy propagation
void build(int node, int l, int r) {
  if (l == r) { tree[node] = a[l]; return; }
  int mid = (l + r) / 2;
  build(2*node, l, mid); build(2*node+1, mid+1, r);
  tree[node] = tree[2*node] + tree[2*node+1];
}
void update(int node, int l, int r, int ql, int qr, ll val) {
  if (qr < l || r < ql) return;
  if (ql <= l && r <= qr) { tree[node] += val*(r-l+1); lazy[node] += val; return; }
  push_down(node, l, r);
  int mid = (l + r) / 2;
  update(2*node, l, mid, ql, qr, val);
  update(2*node+1, mid+1, r, ql, qr, val);
  tree[node] = tree[2*node] + tree[2*node+1];
}`,
  },
  {
    id: "strings",
    title: "String Algorithms",
    difficulty: "Medium",
    problems: ["KMP (pattern matching)", "Z-algorithm", "Rabin-Karp (hashing)", "Suffix Array + LCP", "Aho-Corasick", "Palindromic tree / Eertree"],
    template: `// KMP failure function
vector<int> kmpFailure(string& p) {
  int n = p.size();
  vector<int> fail(n, 0);
  for (int i = 1; i < n; i++) {
    int j = fail[i - 1];
    while (j > 0 && p[i] != p[j]) j = fail[j - 1];
    if (p[i] == p[j]) j++;
    fail[i] = j;
  }
  return fail;
}`,
  },
  {
    id: "math-combinatorics",
    title: "Combinatorics & Math",
    difficulty: "Medium",
    problems: ["Binomial coefficients (nCr)", "Catalan numbers", "Inclusion-Exclusion", "Burnside's lemma", "Matrix exponentiation", "Gaussian elimination"],
    template: `// Precompute factorials for nCr mod p
const ll MOD = 1e9 + 7;
vector<ll> fact(N), inv_fact(N);
void precompute() {
  fact[0] = 1;
  for (int i = 1; i < N; i++) fact[i] = fact[i-1] * i % MOD;
  inv_fact[N-1] = pw(fact[N-1], MOD-2, MOD);
  for (int i = N-2; i >= 0; i--) inv_fact[i] = inv_fact[i+1] * (i+1) % MOD;
}
ll nCr(int n, int r) {
  if (r < 0 || r > n) return 0;
  return fact[n] * inv_fact[r] % MOD * inv_fact[n-r] % MOD;
}`,
  },
];

const CONTEST_PLATFORMS = [
  { name: "Codeforces", url: "https://codeforces.com/contests", color: "text-blue-400", desc: "Frequent rated contests (Div 1-4)" },
  { name: "AtCoder", url: "https://atcoder.jp/contests", color: "text-green-400", desc: "ABC (weekly), ARC, AGC" },
  { name: "LeetCode", url: "https://leetcode.com/contest/", color: "text-orange-400", desc: "Weekly + Biweekly contests" },
  { name: "CodeChef", url: "https://www.codechef.com/contests", color: "text-yellow-400", desc: "Starters weekly, Long challenges" },
  { name: "CSES", url: "https://cses.fi/problemset", color: "text-purple-400", desc: "300 high-quality problems" },
  { name: "USACO", url: "https://usaco.org", color: "text-cyan-400", desc: "US Olympiad training, Bronze→Platinum" },
];

const CPP_TEMPLATE = `#include <bits/stdc++.h>
using namespace std;

#define int long long
#define pb push_back
#define all(x) x.begin(), x.end()
#define sz(x) (int)x.size()
#define ff first
#define ss second

typedef long long ll;
typedef pair<int,int> pii;
typedef vector<int> vi;

const ll MOD = 1e9 + 7;
const ll INF = 1e18;

void solve() {
    // Your code here
}

signed main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int t = 1;
    cin >> t;
    while (t--) solve();
    return 0;
}`;

export default function CPPage() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showTemplate, setShowTemplate] = useState(false);

  const topic = CP_TOPICS.find(t => t.id === activeTopic);

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3 mb-1">
              <Trophy className="size-8 text-yellow-400" />
              Competitive Programming
            </h1>
            <p className="text-zinc-400 text-sm">Templates, advanced algorithms, and contest strategy.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 gap-2 shrink-0"
            onClick={() => setShowTemplate(!showTemplate)}
          >
            <FileCode2 className="size-4" /> C++ Template
          </Button>
        </div>
      </div>

      {/* C++ Template modal */}
      {showTemplate && (
        <div className="m-4 sm:m-8 mb-0 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <span className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
              <FileCode2 className="size-4 text-yellow-400" /> Competitive Programming Template (C++)
            </span>
            <Button variant="ghost" size="sm" className="h-6 text-zinc-500 text-xs" onClick={() => setShowTemplate(false)}>
              Close
            </Button>
          </div>
          <pre className="p-4 text-xs text-zinc-300 overflow-x-auto font-mono leading-relaxed">
            <code>{CPP_TEMPLATE}</code>
          </pre>
        </div>
      )}

      <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Topic list */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Algorithm Topics</h2>
          {CP_TOPICS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTopic(activeTopic === t.id ? null : t.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                activeTopic === t.id
                  ? "bg-zinc-800 border-zinc-600"
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <Zap className={`size-4 shrink-0 ${t.difficulty === "Hard" ? "text-red-400" : "text-yellow-400"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-zinc-200">{t.title}</div>
                <div className="text-xs text-zinc-500">{t.problems.length} algorithms</div>
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${
                t.difficulty === "Hard" ? "text-red-400 bg-red-500/10" : "text-yellow-400 bg-yellow-500/10"
              }`}>{t.difficulty}</span>
            </button>
          ))}

          {/* Platforms */}
          <div className="pt-4">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Contest Platforms</h2>
            <div className="space-y-2">
              {CONTEST_PLATFORMS.map(p => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors group"
                >
                  <span className={`text-sm font-semibold ${p.color}`}>{p.name}</span>
                  <ExternalLink className="size-3 text-zinc-600 group-hover:text-zinc-400 ml-auto" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Topic detail */}
        <div className="lg:col-span-2">
          {topic ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Trophy className="size-5 text-yellow-400" /> {topic.title}
                </h2>
              </div>

              {/* Problems list */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Key Algorithms</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topic.problems.map((prob, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 bg-zinc-800/60 rounded-lg text-xs text-zinc-300">
                      <Star className="size-3 text-yellow-400 shrink-0" /> {prob}
                    </div>
                  ))}
                </div>
              </div>

              {/* Code template */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="size-3" /> C++ Template
                  </span>
                </div>
                <pre className="p-4 text-xs text-zinc-300 overflow-x-auto font-mono leading-relaxed">
                  <code>{topic.template}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-600">
              <Trophy className="size-12 mb-3 opacity-30" />
              <p className="text-sm">Select a topic to view algorithms and templates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
