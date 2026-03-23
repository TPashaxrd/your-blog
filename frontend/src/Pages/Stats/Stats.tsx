import { useEffect, useState } from "react";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Users, Globe, Shield, BarChart3, Lock, Terminal, Eye, User } from "lucide-react";

const StatsPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  useEffect(() => {
    const savedSession = sessionStorage.getItem("admin_session");
    if (savedSession) {
      const { user, pass } = JSON.parse(savedSession);
      handleFetchData(user, pass);
    }
  }, []);

  const handleFetchData = async (user: string, pass: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://api.toprak.xyz/api/stats/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass })
      });

      if (!res.ok) throw new Error("Giriş başarısız: Bilgiler hatalı.");

      const data = await res.json();
      setStats(data);
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_session", JSON.stringify({ user, pass }));
    } catch (err: any) {
      setError(err.message);
      setIsAuthenticated(false);
      sessionStorage.removeItem("admin_session");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono">
        <div className="max-w-sm w-full bg-[#080808] border border-[#1a1a1a] p-8 rounded-[40px] text-center">
          <div className="w-16 h-16 bg-black border border-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <Lock size={28} />
          </div>
          <h2 className="text-white font-black italic text-xl mb-2 tracking-tighter uppercase">Root Login</h2>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-6 font-bold">Admin kimlik bilgilerini gir</p>
          
          <div className="space-y-3">
            <div className="relative">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="text" 
                placeholder="USERNAME"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full bg-black border border-[#1a1a1a] pl-12 pr-6 py-4 rounded-2xl text-white focus:outline-none focus:border-[#D4AF37] transition-all text-sm"
              />
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="password" 
                placeholder="PASSWORD"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchData(credentials.username, credentials.password)}
                className="w-full bg-black border border-[#1a1a1a] pl-12 pr-6 py-4 rounded-2xl text-white focus:outline-none focus:border-[#D4AF37] transition-all text-sm"
              />
            </div>
            <button 
              onClick={() => handleFetchData(credentials.username, credentials.password)}
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-2xl uppercase text-xs tracking-widest hover:bg-[#b8952e] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "AUTHENTICATING..." : "SİSTEME GİRİŞ YAP"}
            </button>
            {error && <p className="text-red-500 text-[10px] mt-4 font-bold uppercase tracking-tighter border border-red-900/50 p-2 rounded-lg bg-red-500/5">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2">
              <Shield size={12} /> Root Access Granted
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
              DASHBOARD<span className="text-[#D4AF37]">.</span>
            </h1>
          </div>
          <button 
            onClick={() => { sessionStorage.removeItem("admin_session"); setIsAuthenticated(false); }}
            className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-red-500 transition-colors border border-[#1a1a1a] px-4 py-2 rounded-full"
          >
            [ Logout ]
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatBox title="Total Hits" value={stats?.totalVisits} icon={<Activity size={20} />} color="#D4AF37" />
          <StatBox title="Unique Users" value={stats?.uniqueVisitors} icon={<Users size={20} />} color="#3b82f6" />
          <StatBox title="Avg Daily" value={Math.round(stats?.totalVisits / (stats?.dailyVisits?.length || 1))} icon={<BarChart3 size={20} />} color="#a855f7" />
          <StatBox title="Security" value="STABLE" icon={<Lock size={20} />} color="#22c55e" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#080808] border border-[#1a1a1a] rounded-[40px] p-8">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Terminal size={14} className="text-[#D4AF37]" /> Traffic Analysis
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.dailyVisits?.map((v: any) => ({ date: v._id.date, val: v.count }))}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ background: '#000', border: '1px solid #1a1a1a', borderRadius: '15px', fontSize: '11px' }}
                    itemStyle={{ color: '#D4AF37' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#D4AF37" strokeWidth={3} fill="url(#chartGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#080808] border border-[#1a1a1a] rounded-[40px] p-8">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Eye size={14} className="text-[#D4AF37]" /> Recent Activities
            </h3>
            <div className="space-y-4">
              {stats?.visitsByIP?.slice(0, 6).map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#0c0c0c] rounded-2xl border border-[#141414]">
                  <div>
                    <p className="text-[10px] font-mono text-[#D4AF37] mb-1">{item._id}</p>
                    <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-tighter">{item.visits} Hits</p>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-400">
                    {new Date(item.lastVisit).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-[#080808] border border-[#1a1a1a] rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-[#111]">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} className="text-[#D4AF37]" /> Global Network Logs
            </h3>
          </div>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] bg-[#050505]">
                  <th className="p-6 font-black">Host Address</th>
                  <th className="p-6 text-center">Requests</th>
                  <th className="p-6">Environment</th>
                  <th className="p-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {stats?.visitsByIP?.map((v: any, idx: number) => (
                  <tr key={idx} className="border-b border-[#0f0f0f] hover:bg-[#0c0c0c] transition-colors">
                    <td className="p-6 font-mono text-[#D4AF37] font-bold">{v._id}</td>
                    <td className="p-6 text-center">{v.visits}</td>
                    <td className="p-6 text-zinc-500 truncate max-w-[200px] italic">
                      {v.userAgents[0] || "Undetected Client"}
                    </td>
                    <td className="p-6 text-right text-zinc-600">
                      {new Date(v.lastVisit).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ title, value, icon, color }: any) => (
  <div className="bg-[#080808] border border-[#1a1a1a] p-6 rounded-[32px] hover:border-zinc-800 transition-all group">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 rounded-2xl bg-black border border-[#1a1a1a] transition-transform group-hover:scale-110" style={{ color }}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-zinc-600 uppercase">{title}</span>
    </div>
    <div className="text-3xl font-black italic tracking-tighter">{value || "0"}</div>
  </div>
);

export default StatsPage;
// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { config } from "../../components/config";

// type VisitByIP = {
//   _id: string;
//   visits: number;
//   lastVisit: string;
//   userAgents: string[];
//   paths: string[];
// };

// type StatsResponse = {
//   totalVisits: number;
//   uniqueVisitors: number;
//   visitsByIP: VisitByIP[];
//   dailyVisits: { _id: { date: string }; count: number }[];
//   monthlyVisits: { _id: { month: string }; count: number }[];
// };

// const API_URL = `${config.api}/api/stats/all`;

// export default function AdminPanel() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isAuth, setIsAuth] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [stats, setStats] = useState<StatsResponse | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedIP, setSelectedIP] = useState<VisitByIP | null>(null);

//   const fetchStats = async (u: string, p: string) => {
//     try {
//       setError(null);
//       setLoading(true);
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username: u, password: p }),
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Server returned ${res.status}: ${text || res.statusText}`);
//       }

//       const data = (await res.json()) as StatsResponse;
//       setStats(data);
//       setIsAuth(true);
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || "Unknown error");
//       setStats(null);
//       setIsAuth(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (!username || !password) {
//       setError("Enter username & password");
//       return;
//     }
//     fetchStats(username, password);
//   };

//   const handleLogout = () => {
//     setIsAuth(false);
//     setStats(null);
//     setUsername("");
//     setPassword("");
//   };

//   const exportCSV = () => {
//     if (!stats) return;
//     const rows = [
//       ["IP", "Visits", "LastVisit", "UserAgents", "Paths"].join(","),
//       ...stats.visitsByIP.map((v) =>
//         [
//           `"${v._id}"`,
//           v.visits,
//           `"${v.lastVisit}"`,
//           `"${(v.userAgents || []).join(" | ").replace(/"/g, '""')}"`,
//           `"${(v.paths || []).join(" | ").replace(/"/g, '""')}"`,
//         ].join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `stats_visitsByIP_${new Date().toISOString()}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const exportJSON = () => {
//     if (!stats) return;
//     const blob = new Blob([JSON.stringify(stats, null, 2)], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `stats_${new Date().toISOString()}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const [autoRefresh, setAutoRefresh] = useState(false);
//   useEffect(() => {
//     if (!autoRefresh || !isAuth) return;
//     const id = setInterval(() => {
//       fetchStats(username, password);
//     }, 30_000);
//     return () => clearInterval(id);
//   }, [autoRefresh, isAuth, username, password]);

//   return (
//     <div className="min-h-screen font-space-grotesk bg-gradient-to-b from-[#06060a] via-[#0b0b12] to-[#05050a] text-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex items-center justify-between mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-white">Admin • Site Stats</h1>
//           <div className="flex items-center gap-3">
//             {isAuth && (
//               <>
//                 <button
//                   onClick={() => fetchStats(username, password)}
//                   className="px-3 py-2 bg-purple-600 rounded-md text-sm hover:bg-purple-500 transition"
//                 >
//                   Refresh
//                 </button>
//                 <button
//                   onClick={exportCSV}
//                   className="px-3 py-2 bg-indigo-600 rounded-md text-sm hover:bg-indigo-500 transition"
//                 >
//                   Export CSV
//                 </button>
//                 <button
//                   onClick={exportJSON}
//                   className="px-3 py-2 bg-emerald-600 rounded-md text-sm hover:bg-emerald-500 transition"
//                 >
//                   Export JSON
//                 </button>
//                 <button
//                   onClick={() => setAutoRefresh((s) => !s)}
//                   className={`px-3 py-2 rounded-md text-sm transition ${autoRefresh ? "bg-yellow-600 hover:bg-yellow-500" : "bg-gray-700 hover:bg-gray-600"}`}
//                   title="Auto refresh every 30s"
//                 >
//                   {autoRefresh ? "Auto: ON" : "Auto: OFF"}
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="px-3 py-2 bg-red-600 rounded-md text-sm hover:bg-red-500 transition"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>
//         </header>

//         {!isAuth && (
//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800/50 border border-purple-800/40 rounded-xl p-6 shadow-lg">
//             <form onSubmit={handleLogin} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
//               <div className="md:col-span-1">
//                 <label className="block text-sm text-gray-300 mb-1">Username</label>
//                 <input
//                   className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-600"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   placeholder="Username"
//                 />
//               </div>
//               <div className="md:col-span-1">
//                 <label className="block text-sm text-gray-300 mb-1">Password</label>
//                 <input
//                   type="password"
//                   className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-600"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Password"
//                 />
//               </div>
//               <div className="md:col-span-1 flex gap-2">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 bg-purple-600 rounded-md text-white font-semibold hover:bg-purple-500 transition disabled:opacity-60"
//                 >
//                   {loading ? "Loading..." : "Sign in & Fetch"}
//                 </button>
//               </div>
//             </form>

//             {error && <div className="mt-4 text-red-400 font-medium">{error}</div>}
//           </motion.div>
//         )}

//         {isAuth && stats && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-1 bg-gray-800/40 border border-purple-800/30 rounded-xl p-6 shadow">
//               <h2 className="text-lg font-semibold text-white mb-3">Overview</h2>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-300">Total visits</span>
//                   <span className="font-bold text-white">{stats.totalVisits}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-300">Unique visitors</span>
//                   <span className="font-bold text-white">{stats.uniqueVisitors}</span>
//                 </div>

//                 <div className="mt-4">
//                   <h3 className="text-sm font-medium text-gray-300 mb-2">Daily</h3>
//                   <div className="grid grid-cols-2 gap-2">
//                     {stats.dailyVisits.map((d) => (
//                       <div key={d._id.date} className="bg-gray-900/30 p-2 rounded">
//                         <div className="text-xs text-gray-400">{d._id.date}</div>
//                         <div className="font-semibold">{d.count}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <h3 className="text-sm font-medium text-gray-300 mb-2">Monthly</h3>
//                   <div className="grid grid-cols-1 gap-2">
//                     {stats.monthlyVisits.map((m) => (
//                       <div key={m._id.month} className="bg-gray-900/30 p-2 rounded">
//                         <div className="text-xs text-gray-400">{m._id.month}</div>
//                         <div className="font-semibold">{m.count}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <h3 className="text-sm font-medium text-gray-300 mb-2">Quick actions</h3>
//                   <div className="flex gap-2">
//                     <button onClick={exportCSV} className="px-3 py-2 bg-indigo-600 rounded-md text-sm hover:bg-indigo-500">CSV</button>
//                     <button onClick={exportJSON} className="px-3 py-2 bg-emerald-600 rounded-md text-sm hover:bg-emerald-500">JSON</button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="lg:col-span-2 bg-gray-800/40 border border-purple-800/30 rounded-xl p-6 shadow overflow-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold text-white">Visits by IP ({stats.visitsByIP.length})</h2>
//                 <div className="text-sm text-gray-300">Click a row to view details</div>
//               </div>

//               <div className="w-full overflow-x-auto">
//                 <table className="min-w-full table-auto">
//                   <thead>
//                     <tr className="text-sm text-gray-400">
//                       <th className="px-3 py-2 text-left">IP</th>
//                       <th className="px-3 py-2 text-left">Visits</th>
//                       <th className="px-3 py-2 text-left">Last Visit</th>
//                       <th className="px-3 py-2 text-left">Paths Count</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm">
//                     {stats.visitsByIP.map((v) => (
//                       <tr
//                         key={v._id}
//                         onClick={() => setSelectedIP(v)}
//                         className="cursor-pointer hover:bg-gray-900/30 transition-colors"
//                       >
//                         <td className="px-3 py-3">{v._id}</td>
//                         <td className="px-3 py-3 font-semibold">{v.visits}</td>
//                         <td className="px-3 py-3 text-gray-300">{new Date(v.lastVisit).toLocaleString()}</td>
//                         <td className="px-3 py-3 text-gray-300">{v.paths?.length ?? 0}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <AnimatePresence>
//                 {selectedIP && (
//                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 bg-gray-900/50 p-4 rounded-lg border border-purple-800/30">
//                     <div className="flex justify-between items-start gap-4">
//                       <div>
//                         <div className="text-sm text-gray-400">IP</div>
//                         <div className="font-mono font-semibold text-white">{selectedIP._id}</div>
//                         <div className="text-xs text-gray-400 mt-1">Visits: <span className="font-semibold text-white">{selectedIP.visits}</span></div>
//                         <div className="text-xs text-gray-400">Last: <span className="text-white">{new Date(selectedIP.lastVisit).toLocaleString()}</span></div>
//                       </div>

//                       <div className="flex gap-2 items-center">
//                         <button
//                           onClick={() => {
//                             const text = (selectedIP.paths || []).join("\n");
//                             navigator.clipboard.writeText(text || "");
//                             alert("Paths copied to clipboard");
//                           }}
//                           className="px-3 py-2 bg-purple-600 rounded-md text-sm hover:bg-purple-500"
//                         >
//                           Copy paths
//                         </button>
//                         <button
//                           onClick={() => {
//                             setSelectedIP(null);
//                           }}
//                           className="px-3 py-2 bg-gray-700 rounded-md text-sm hover:bg-gray-600"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </div>

//                     <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <h4 className="text-sm text-gray-300 mb-2">User Agents</h4>
//                         <div className="space-y-2 max-h-48 overflow-auto p-2 bg-gray-900/20 rounded">
//                           {(selectedIP.userAgents || []).map((ua, i) => (
//                             <div key={i} className="text-xs text-gray-300 break-words bg-gray-800/30 p-2 rounded">{ua}</div>
//                           ))}
//                         </div>
//                       </div>
//                       <div>
//                         <h4 className="text-sm text-gray-300 mb-2">Paths</h4>
//                         <div className="space-y-2 overflow-visible p-2 bg-gray-900/20 rounded">
//                         {(selectedIP.paths || []).map((p, i) => (
//                             <div key={i} className="text-xs text-gray-300 break-words px-2 py-1 rounded bg-gray-800/30">{p}</div>
//                         ))}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         )}

//         {isAuth && !stats && !loading && (
//           <div className="mt-8 bg-gray-800/40 p-6 rounded-lg">No stats yet. Try Refresh.</div>
//         )}

//         {loading && (
//           <div className="mt-6 text-sm text-gray-300">Fetching stats...</div>
//         )}
//       </div>
//     </div>
//   );
// }