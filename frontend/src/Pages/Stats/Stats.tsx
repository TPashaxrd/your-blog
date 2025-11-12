import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "../../components/config";

type VisitByIP = {
  _id: string;
  visits: number;
  lastVisit: string;
  userAgents: string[];
  paths: string[];
};

type StatsResponse = {
  totalVisits: number;
  uniqueVisitors: number;
  visitsByIP: VisitByIP[];
  dailyVisits: { _id: { date: string }; count: number }[];
  monthlyVisits: { _id: { month: string }; count: number }[];
};

const API_URL = `${config.api}/api/stats/all`;

export default function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedIP, setSelectedIP] = useState<VisitByIP | null>(null);

  const fetchStats = async (u: string, p: string) => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server returned ${res.status}: ${text || res.statusText}`);
      }

      const data = (await res.json()) as StatsResponse;
      setStats(data);
      setIsAuth(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
      setStats(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      setError("Enter username & password");
      return;
    }
    fetchStats(username, password);
  };

  const handleLogout = () => {
    setIsAuth(false);
    setStats(null);
    setUsername("");
    setPassword("");
  };

  const exportCSV = () => {
    if (!stats) return;
    const rows = [
      ["IP", "Visits", "LastVisit", "UserAgents", "Paths"].join(","),
      ...stats.visitsByIP.map((v) =>
        [
          `"${v._id}"`,
          v.visits,
          `"${v.lastVisit}"`,
          `"${(v.userAgents || []).join(" | ").replace(/"/g, '""')}"`,
          `"${(v.paths || []).join(" | ").replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stats_visitsByIP_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!stats) return;
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stats_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [autoRefresh, setAutoRefresh] = useState(false);
  useEffect(() => {
    if (!autoRefresh || !isAuth) return;
    const id = setInterval(() => {
      fetchStats(username, password);
    }, 30_000);
    return () => clearInterval(id);
  }, [autoRefresh, isAuth, username, password]);

  return (
    <div className="min-h-screen font-space-grotesk bg-gradient-to-b from-[#06060a] via-[#0b0b12] to-[#05050a] text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Admin • Site Stats</h1>
          <div className="flex items-center gap-3">
            {isAuth && (
              <>
                <button
                  onClick={() => fetchStats(username, password)}
                  className="px-3 py-2 bg-purple-600 rounded-md text-sm hover:bg-purple-500 transition"
                >
                  Refresh
                </button>
                <button
                  onClick={exportCSV}
                  className="px-3 py-2 bg-indigo-600 rounded-md text-sm hover:bg-indigo-500 transition"
                >
                  Export CSV
                </button>
                <button
                  onClick={exportJSON}
                  className="px-3 py-2 bg-emerald-600 rounded-md text-sm hover:bg-emerald-500 transition"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => setAutoRefresh((s) => !s)}
                  className={`px-3 py-2 rounded-md text-sm transition ${autoRefresh ? "bg-yellow-600 hover:bg-yellow-500" : "bg-gray-700 hover:bg-gray-600"}`}
                  title="Auto refresh every 30s"
                >
                  {autoRefresh ? "Auto: ON" : "Auto: OFF"}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-600 rounded-md text-sm hover:bg-red-500 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </header>

        {!isAuth && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800/50 border border-purple-800/40 rounded-xl p-6 shadow-lg">
            <form onSubmit={handleLogin} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-1">
                <label className="block text-sm text-gray-300 mb-1">Username</label>
                <input
                  className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <div className="md:col-span-1 flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 rounded-md text-white font-semibold hover:bg-purple-500 transition disabled:opacity-60"
                >
                  {loading ? "Loading..." : "Sign in & Fetch"}
                </button>
              </div>
            </form>

            {error && <div className="mt-4 text-red-400 font-medium">{error}</div>}
          </motion.div>
        )}

        {isAuth && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-gray-800/40 border border-purple-800/30 rounded-xl p-6 shadow">
              <h2 className="text-lg font-semibold text-white mb-3">Overview</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total visits</span>
                  <span className="font-bold text-white">{stats.totalVisits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Unique visitors</span>
                  <span className="font-bold text-white">{stats.uniqueVisitors}</span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Daily</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {stats.dailyVisits.map((d) => (
                      <div key={d._id.date} className="bg-gray-900/30 p-2 rounded">
                        <div className="text-xs text-gray-400">{d._id.date}</div>
                        <div className="font-semibold">{d.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Monthly</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {stats.monthlyVisits.map((m) => (
                      <div key={m._id.month} className="bg-gray-900/30 p-2 rounded">
                        <div className="text-xs text-gray-400">{m._id.month}</div>
                        <div className="font-semibold">{m.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Quick actions</h3>
                  <div className="flex gap-2">
                    <button onClick={exportCSV} className="px-3 py-2 bg-indigo-600 rounded-md text-sm hover:bg-indigo-500">CSV</button>
                    <button onClick={exportJSON} className="px-3 py-2 bg-emerald-600 rounded-md text-sm hover:bg-emerald-500">JSON</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-gray-800/40 border border-purple-800/30 rounded-xl p-6 shadow overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Visits by IP ({stats.visitsByIP.length})</h2>
                <div className="text-sm text-gray-300">Click a row to view details</div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="text-sm text-gray-400">
                      <th className="px-3 py-2 text-left">IP</th>
                      <th className="px-3 py-2 text-left">Visits</th>
                      <th className="px-3 py-2 text-left">Last Visit</th>
                      <th className="px-3 py-2 text-left">Paths Count</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {stats.visitsByIP.map((v) => (
                      <tr
                        key={v._id}
                        onClick={() => setSelectedIP(v)}
                        className="cursor-pointer hover:bg-gray-900/30 transition-colors"
                      >
                        <td className="px-3 py-3">{v._id}</td>
                        <td className="px-3 py-3 font-semibold">{v.visits}</td>
                        <td className="px-3 py-3 text-gray-300">{new Date(v.lastVisit).toLocaleString()}</td>
                        <td className="px-3 py-3 text-gray-300">{v.paths?.length ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <AnimatePresence>
                {selectedIP && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 bg-gray-900/50 p-4 rounded-lg border border-purple-800/30">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="text-sm text-gray-400">IP</div>
                        <div className="font-mono font-semibold text-white">{selectedIP._id}</div>
                        <div className="text-xs text-gray-400 mt-1">Visits: <span className="font-semibold text-white">{selectedIP.visits}</span></div>
                        <div className="text-xs text-gray-400">Last: <span className="text-white">{new Date(selectedIP.lastVisit).toLocaleString()}</span></div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => {
                            const text = (selectedIP.paths || []).join("\n");
                            navigator.clipboard.writeText(text || "");
                            alert("Paths copied to clipboard");
                          }}
                          className="px-3 py-2 bg-purple-600 rounded-md text-sm hover:bg-purple-500"
                        >
                          Copy paths
                        </button>
                        <button
                          onClick={() => {
                            setSelectedIP(null);
                          }}
                          className="px-3 py-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600"
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-gray-300 mb-2">User Agents</h4>
                        <div className="space-y-2 max-h-48 overflow-auto p-2 bg-gray-900/20 rounded">
                          {(selectedIP.userAgents || []).map((ua, i) => (
                            <div key={i} className="text-xs text-gray-300 break-words bg-gray-800/30 p-2 rounded">{ua}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-300 mb-2">Paths</h4>
                        <div className="space-y-2 overflow-visible p-2 bg-gray-900/20 rounded">
                        {(selectedIP.paths || []).map((p, i) => (
                            <div key={i} className="text-xs text-gray-300 break-words px-2 py-1 rounded bg-gray-800/30">{p}</div>
                        ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {isAuth && !stats && !loading && (
          <div className="mt-8 bg-gray-800/40 p-6 rounded-lg">No stats yet. Try Refresh.</div>
        )}

        {loading && (
          <div className="mt-6 text-sm text-gray-300">Fetching stats...</div>
        )}
      </div>
    </div>
  );
}