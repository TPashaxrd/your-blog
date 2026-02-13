import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BiMessageDetail, BiSend, BiTrash, BiX, 
  BiHeart, BiDotsHorizontalRounded, 
  BiLockAlt, BiCheckCircle, 
  BiLoaderAlt, BiTerminal
} from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { config } from "../../components/config";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import toast, { Toaster } from "react-hot-toast";

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [buffer, setBuffer] = useState("");
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${config.api}/api/auth/me`, { withCredentials: true });
        setCurrentUser(res.data.user);
      } catch (err) {
        setCurrentUser(null);
      }
    };
    checkAuth();
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newBuffer = (buffer + e.key).slice(-4);
      setBuffer(newBuffer);
      if (newBuffer === "2443") {
        setShowAdminPanel(true);
        toast.success("ROOT_TERMINAL_OPENED", { icon: '⌨️' });
        setBuffer("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [buffer]);

  useEffect(() => { fetchGalleries(); }, []);

  const fetchGalleries = async () => {
    try {
      const res = await axios.get(`${config.api}/api/gallery/public`);
      setItems(res.data);
    } catch (err) {
      toast.error("FETCH_ERROR");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${config.api}/api/gallery/create`, {
        text: newTitle, 
        imageUrl: newImageUrl,
        username: adminUser,
        password: adminPass
      }, { withCredentials: true });
      
      toast.success("NODE_DEPLOYED");
      setNewTitle(""); setNewImageUrl(""); setAdminUser(""); setAdminPass(""); 
      setShowAdminPanel(false);
      fetchGalleries();
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "AUTH_FAILED"); 
    }
  };

  const handleCommentSubmit = async (galleryId: string) => {
    const content = commentText[galleryId];
    if (!content?.trim()) return;

    try {
      await axios.post(`${config.api}/api/gallery/comment`, {
        id: galleryId,
        content: content
      }, { withCredentials: true });
      
      setCommentText({ ...commentText, [galleryId]: "" });
      fetchGalleries();
      toast.success("Comment added");
    } catch (err: any) { 
      toast.error(err.response?.data?.message || "Error sending comment"); 
    }
  };

  const handleDeleteComment = async (galleryId: string, commentId: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${config.api}/api/gallery/comment/${galleryId}/${commentId}`, { withCredentials: true });
      toast.success("Comment deleted");
      fetchGalleries();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
      <Header />
      <main className="container mx-auto max-w-[550px] px-0 py-20 md:py-32">
        
        <AnimatePresence>
          {showAdminPanel && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0A0A0A] border border-purple-500/20 w-full max-w-md p-8 rounded-[2rem] shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 text-purple-500"><BiTerminal /> Admin Auth</h2>
                  <button onClick={() => setShowAdminPanel(false)} className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors"><BiX size={24} /></button>
                </div>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="ROOT_USER" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-600 text-[10px] font-mono uppercase text-white" />
                    <input type="password" placeholder="ROOT_PASS" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-600 text-[10px] font-mono uppercase text-white" />
                  </div>
                  <input type="text" placeholder="CAPTION" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-purple-600 text-xs font-bold uppercase tracking-tight text-white" />
                  <input type="text" placeholder="CDN_IMAGE_URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-purple-600 text-xs font-bold text-white" />
                  <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-lg shadow-purple-600/20">Authorize & Deploy</button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-40"><BiLoaderAlt className="animate-spin text-purple-600 text-3xl" /></div>
        ) : (
          <div className="flex flex-col space-y-8">
            {items.map((item) => (
              <motion.div key={item._id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-[#050505] border-y md:border border-white/10 md:rounded-[2rem] overflow-hidden">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 p-[2px]">
                      <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${item._id}`} alt="" />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1">Admin <BiCheckCircle className="text-blue-500" /></span>
                      <p className="text-[8px] text-gray-600 uppercase font-mono tracking-tighter">Verified Node: {item._id.slice(-6)}</p>
                    </div>
                  </div>
                  <BiDotsHorizontalRounded className="text-gray-600 hover:text-white cursor-pointer" size={20} />
                </div>

                <img src={item.imageUrl} className="w-full aspect-square object-cover bg-neutral-900" alt="" />

                <div className="p-6">
                  <div className="flex gap-5 mb-5">
                    <BiHeart size={28} className="hover:text-red-500 cursor-pointer transition-colors" />
                    <BiMessageDetail size={26} className="hover:text-purple-500 cursor-pointer transition-colors" />
                    <BiSend size={26} className="hover:text-blue-500 cursor-pointer transition-colors" />
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm leading-relaxed">
                      <span className="font-black mr-2 uppercase italic text-purple-500 tracking-tighter">Admin</span>
                      <span className="text-gray-300">{item.text}</span>
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {item.comments?.map((c: any) => {
                      const canDelete = currentUser && (
                        currentUser._id === c.userId || 
                        currentUser.userRole === "Admin"
                      );

                      return (
                        <div key={c._id} className="flex justify-between items-start group/comment">
                          <p className="text-[13px] leading-tight flex-1">
                            <span className="font-black mr-2 text-purple-400 uppercase text-[10px] tracking-tight">{c.user}</span>
                            <span className="text-gray-400 group-hover/comment:text-gray-200 transition-colors">{c.content}</span>
                          </p>
                          {canDelete && (
                            <button onClick={() => handleDeleteComment(item._id, c._id)} className="text-gray-800 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-all ml-2"><BiTrash size={16} /></button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-5 border-t border-white/5">
                    {currentUser ? (
                      <div className="flex items-center gap-4">
                        <input 
                          type="text" placeholder="Write a comment..." 
                          className="flex-1 bg-transparent text-[11px] font-mono uppercase outline-none placeholder:text-gray-800 focus:placeholder:text-gray-600 text-white"
                          value={commentText[item._id] || ""}
                          onChange={(e) => setCommentText({ ...commentText, [item._id]: e.target.value })}
                        />
                        <button onClick={() => handleCommentSubmit(item._id)} className="text-purple-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">Post</button>
                      </div>
                    ) : (
                      <Link to="/login" className="text-[10px] text-gray-700 hover:text-purple-500 uppercase font-black tracking-[0.2em] flex items-center gap-2"><BiLockAlt /> Login to comment</Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}
