import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../../components/config";
import { motion } from "framer-motion";
import { BiPowerOff, BiShieldQuarter, BiLockAlt, BiCommand, BiPulse } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";

export default function Panic() {
  const [auth, setAuth] = useState({ username: "", password: "" });
  const [status, setStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>(["READY_FOR_COMMAND", "SYSTEM_CHECK_IDLE"]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${config.api}/api/admin/system-status`);
      setStatus(res.data.systemMode);
      addLog(`CORE_STATUS: ${res.data.systemMode ? 'ACTIVE' : 'ENCRYPTED'}`);
    } catch (err) {
      addLog("NETWORK_HITCH");
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => addLog("WATCHDOG_PING_STABLE"), 15000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    setLoading(true);
    addLog("PROCESSING_OVERRIDE...");
    const loadId = toast.loading("Connecting to core...");
    try {
      const res = await axios.post(`${config.api}/api/admin/toggle-system`, auth);
      setStatus(res.data.systemMode);
      
      if (res.data.systemMode === false) {
        addLog("EXECUTION: LOCK_ENABLED");
        toast.error("SYSTEM ENCRYPTED", { id: loadId });
      } else {
        addLog("EXECUTION: LOCK_DISABLED");
        toast.success("SYSTEM RELEASED", { id: loadId });
      }
    } catch (err) {
      addLog("FAILURE: ACCESS_DENIED");
      toast.error("INVALID KEYS", { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500/10 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10"
      >
        <div className="bg-gray-900/60 border-t border-x border-white/10 rounded-t-[2rem] p-5 flex justify-between items-center backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${status ? 'bg-emerald-500' : 'bg-purple-500'}`} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">Master Control Panel</span>
          </div>
          <BiCommand className="text-white/20" />
        </div>

        <div className="bg-gray-900/40 border border-white/10 rounded-b-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col items-center justify-center p-6 border border-white/5 rounded-3xl bg-black/20">
              <motion.div
                animate={status === false ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 3 }}
                className={`w-20 h-20 rounded-full border flex items-center justify-center mb-4 transition-all duration-700 ${status === false ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'border-emerald-500/30'}`}
              >
                {status === false ? <BiLockAlt size={32} className="text-purple-500" /> : <BiShieldQuarter size={32} className="text-emerald-500" />}
              </motion.div>
              <span className={`text-[10px] font-black tracking-widest uppercase ${status === false ? 'text-purple-500' : 'text-emerald-500'}`}>
                {status === false ? "Restricted Mode" : "Public Mode"}
              </span>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-3xl p-5 flex flex-col justify-end h-36">
               <div className="space-y-1.5 font-mono">
                 {logs.map((log, i) => (
                   <div key={i} className={`text-[9px] font-bold tracking-tight ${i === 0 ? 'text-purple-400' : 'text-white/20'}`}>
                     {`_ ${log}`}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="text" placeholder="OPERATOR" 
                className="bg-black/50 border border-white/10 p-4 rounded-xl outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10 text-white text-xs font-medium"
                value={auth.username} onChange={e => setAuth({...auth, username: e.target.value})}
              />
              <input 
                type="password" placeholder="KEY_PHRASE" 
                className="bg-black/50 border border-white/10 p-4 rounded-xl outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10 text-white text-xs font-medium"
                value={auth.password} onChange={e => setAuth({...auth, password: e.target.value})}
              />
            </div>

            <button 
              disabled={loading}
              onClick={handleToggle}
              className={`w-full py-5 rounded-2xl font-bold text-xs tracking-[0.3em] transition-all transform active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group
                ${status 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" 
                  : "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                }`}
            >
              <span className="relative z-10">{status ? "SHUTDOWN SYSTEM" : "RESTORE SYSTEM"}</span>
              <BiPowerOff size={18} className="relative z-10" />
            </button>
          </div>

          <div className="mt-8 flex justify-between items-center opacity-20 border-t border-white/5 pt-6">
            <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.2em]">
              <BiPulse /> Core Stable
            </div>
            <div className="text-[8px] font-bold uppercase tracking-[0.2em]">
              Toprak.xyz Control
            </div>
          </div>
        </div>
      </motion.div>

      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: '#111',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '12px',
          fontFamily: 'sans-serif'
        }
      }} />
    </div>
  );
}