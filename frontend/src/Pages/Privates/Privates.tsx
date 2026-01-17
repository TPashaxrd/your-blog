import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../../components/config";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BiTrash, BiPlus, BiHide, BiShow, BiFingerprint, BiRefresh } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function Privates() {
  const [privates, setPrivates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [auth, setAuth] = useState({ username: "", password: "" });
  const [newNote, setNewNote] = useState({ title: "", text: "" });
  const [showContent, setShowContent] = useState<{ [key: string]: boolean }>({});

  const fetchPrivates = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${config.api}/api/private/get-all`, auth);
      setPrivates(res.data);
      if (auth.password) toast.success("Synchronized with vault.");
    } catch (err: any) {
      setPrivates([]);
      if (auth.password) toast.error("Access Denied: Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivates();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadId = toast.loading("Encrypting...");
    try {
      await axios.post(`${config.api}/api/private/create`, { ...newNote, ...auth });
      toast.success("Entry secured.", { id: loadId });
      setNewNote({ title: "", text: "" });
      fetchPrivates();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Authorization Failed", { id: loadId });
    }
  };

  const handleDelete = async (id: string) => {
    const loadId = toast.loading("Purging...");
    try {
      await axios.post(`${config.api}/api/private/delete`, { id, ...auth });
      toast.success("Entry purged.", { id: loadId });
      fetchPrivates();
    } catch (err: any) {
      toast.error("Delete failed: Unauthorized", { id: loadId });
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-gray-100 font-sans tracking-tight">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-16">
        
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white tracking-tighter">
            Priv<span className="text-purple-600">Notes</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium italic">Unlocking the vault requires active credentials.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl sticky top-24">
              
              <div className="mb-8">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <BiFingerprint className="text-purple-500" size={20}/> Authority
                </h3>
                <div className="space-y-3">
                  <input 
                    type="text" placeholder="Username"
                    className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-sm outline-none focus:border-purple-500/50 transition-all"
                    value={auth.username} onChange={e => setAuth({...auth, username: e.target.value})}
                  />
                  <input 
                    type="password" placeholder="Access Key"
                    className="w-full bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-sm outline-none focus:border-purple-500/50 transition-all"
                    value={auth.password} onChange={e => setAuth({...auth, password: e.target.value})}
                  />
                  <button 
                    onClick={fetchPrivates}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <BiRefresh size={18}/> Sync Database
                  </button>
                </div>
              </div>

              <div className="h-[1px] bg-white/5 w-full mb-8" />

              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                <BiPlus className="text-purple-500" size={20}/> New Entry
              </h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <input 
                  type="text" placeholder="Entry Title" required
                  className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-white focus:border-purple-500/50 outline-none transition-all"
                  value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})}
                />
                <textarea 
                  placeholder="Classified information..." required rows={3}
                  className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-white focus:border-purple-500/50 outline-none transition-all resize-none"
                  value={newNote.text} onChange={e => setNewNote({...newNote, text: e.target.value})}
                />
                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-purple-600/10">
                   Encrypt & Store
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">Vault Fragments ({privates.length})</h3>
              {loading && <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {privates.length > 0 ? privates.map((item) => (
                  <motion.div 
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] hover:border-purple-500/30 transition-all duration-500 shadow-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-mono text-gray-600 mb-1 block uppercase tracking-tighter">REF_ID: {item._id.slice(-8)}</span>
                        <h4 className="text-xl font-bold text-white tracking-tight">{item.title}</h4>
                      </div>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2.5 bg-rose-500/5 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <BiTrash size={20} />
                      </button>
                    </div>

                <div className="relative">
                  <div className={`p-5 rounded-2xl font-mono text-sm border transition-all duration-700 ${
                    showContent[item._id] 
                      ? "bg-purple-600/5 border-purple-500/40 text-purple-100" 
                      : "bg-black/60 border-white/5 text-gray-800 select-none"
                  } whitespace-pre-wrap break-words text-left`}>                     
                    {showContent[item._id] ? item.text : "********************************"}
                  </div>
                  
                  <button 
                    onClick={() => setShowContent(prev => ({ ...prev, [item._id]: !prev[item._id] }))}
                    className="absolute right-3 top-5 p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all backdrop-blur-md"
                  >
                    {showContent[item._id] ? <BiHide size={18}/> : <BiShow size={18}/>}
                  </button>
                </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-32 bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem]">
                    <p className="text-gray-600 font-medium">Vault is locked or empty.</p>
                    <p className="text-gray-800 text-xs mt-2 uppercase tracking-widest">Enter credentials to synchronize</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="bottom-center" />
    </div>
  );
}