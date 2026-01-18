import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  BiGitRepoForked, BiStar, BiPlayCircle, 
  BiLayer, BiCommand, BiCodeAlt, BiGlobe, BiChip 
} from "react-icons/bi";
import { Helmet } from "react-helmet-async";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Personal: React.FC = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [spotify, setSpotify] = useState<any>(null);
  const [_, setLoading] = useState(true);

  const pinnedRepos = ["your-blog", "SnapStack.art", "software-store", "ConfessNow", "login-register-backend"]; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gitRes = await axios.get("https://api.github.com/users/TPashaxrd/repos?per_page=100&sort=updated");
        const sorted = gitRes.data.sort((a: any, b: any) => {
          const aIndex = pinnedRepos.indexOf(a.name);
          const bIndex = pinnedRepos.indexOf(b.name);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return b.stargazers_count - a.stargazers_count;
        });
        setRepos(sorted);
        const spotRes = await axios.get("https://api.toprak.xyz/api/spotify/now-playing").catch(() => null);
        if (spotRes) setSpotify(spotRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-600/40">
      <Helmet>
        <title>Identity // Toprak Doğan</title>
      </Helmet>

      <Header />

      <main className="pt-44 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[180px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[180px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-52 items-center">
            <div className="lg:col-span-8">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <div className="flex items-center gap-3 mb-8">
                  <span className="h-[1px] w-12 bg-gradient-to-r from-purple-600 to-transparent"></span>
                  <span className="text-purple-500 font-mono text-xs tracking-[0.6em] uppercase">Student @ Wallstreet</span>
                </div>
                <h1 className="text-8xl md:text-[11rem] font-black tracking-tighter leading-[0.8] mb-12 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 uppercase">
                  Toprak<br/>Doğan
                </h1>
                <p className="text-gray-500 text-2xl max-w-2xl leading-relaxed font-light italic border-l-4 border-purple-600 pl-8">
                  "I’m a passionate and self-driven developer focused on software, <span className="text-white">game engines</span>, and entrepreneurship."
                </p>
              </motion.div>
            </div>

            <div className="lg:col-span-4">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[4rem] blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
                <div className="relative bg-[#0A0A0A] border border-white/5 rounded-[4rem] p-12 backdrop-blur-3xl overflow-hidden text-center">
                   <div className="relative mb-8 inline-block">
                      <img src="https://github.com/TPashaxrd/your-blog/blob/main/ToprakButGlassesIsAI.png?raw=true" className={`w-44 h-44 rounded-[3.5rem] object-cover border-2 border-white/5 p-2 shadow-2xl transition-all duration-1000 ${spotify?.isPlaying ? 'scale-105 rotate-3 border-purple-500/50' : ''}`} alt="Toprak" />
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#1DB954] rounded-2xl flex items-center justify-center border-8 border-[#0A0A0A]">
                         <BiPlayCircle className="text-black text-2xl" />
                      </div>
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">{spotify?.title || "Listening Mode"}</h3>
                   <p className="text-purple-500/60 font-mono text-xs uppercase tracking-[0.2em]">{spotify?.artist || "Standby"}</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-52">
             {[
               { icon: <BiCodeAlt />, label: "Development", val: "Unreal & Full-Stack" },
               { icon: <BiChip />, label: "Specialty", val: "High-Performance Systems" },
               { icon: <BiGlobe />, label: "Location", val: "Istanbul, TR" }
             ].map((stat, i) => (
               <div key={i} className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] group hover:bg-white/[0.04] transition-all">
                  <div className="text-purple-500 text-3xl mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-2">{stat.label}</div>
                  <div className="text-xl font-bold uppercase">{stat.val}</div>
               </div>
             ))}
          </div>

          <div className="space-y-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/5 rounded-3xl"><BiCommand size={24} className="text-gray-400" /></div>
                <h2 className="text-5xl font-black tracking-tighter uppercase italic">Workspace_Log</h2>
              </div>
              <span className="text-gray-600 font-mono text-sm tracking-widest uppercase hidden md:block">TPashaxrd_Repositories[{repos.length}]</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence>
                {repos.map((repo, idx) => {
                  const isPinned = pinnedRepos.includes(repo.name);
                  return (
                    <motion.a key={repo.id} href={repo.html_url} target="_blank" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                      className={`group relative min-h-[340px] rounded-[4rem] p-12 flex flex-col justify-between transition-all duration-500 border ${isPinned ? 'bg-gradient-to-br from-purple-950/20 to-transparent border-purple-500/20 hover:border-purple-500/50' : 'bg-[#0D0D0D]/50 border-white/5 hover:border-white/20'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 ${isPinned ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}><BiLayer size={32} /></div>
                        {isPinned && <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Pinned_Module</div>}
                      </div>
                      <div className="mt-12">
                        <h3 className="text-3xl font-black mb-5 tracking-tighter uppercase group-hover:text-purple-500 transition-colors leading-none">{repo.name}</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2 italic">{repo.description || "Experimental protocol deployed."}</p>
                      </div>
                      <div className="flex items-center gap-8 pt-10 mt-10 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-yellow-500 transition-colors"><BiStar size={18} /> <span>{repo.stargazers_count}</span></div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors"><BiGitRepoForked size={18} /> <span>{repo.forks_count}</span></div>
                        <div className="ml-auto text-[10px] font-black text-purple-600 uppercase">{repo.language || "OBJ"}</div>
                      </div>
                    </motion.a>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Personal;