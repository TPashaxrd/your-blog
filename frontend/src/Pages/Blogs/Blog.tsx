import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { config } from "../../components/config";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

interface Post {
  _id: string;
  title: string;
  slug: string;
  coverImageUrl?: string;
  category?: string;
  createdAt: string;
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get<Post[]>(`${config.api}/api/post`);
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category || "Uncategorized")))];

  if (loading) {
    return (
      <div className="min-h-screen items-center justify-center flex flex-col bg-[#050505]">
        <div className="loader">
           {[...Array(9)].map((_, i) => <div key={i} className="text"><span>Loading</span></div>)}
           <div className="line"></div>
        </div>
      </div>
    );
  }

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(p => (p.category || "Uncategorized") === selectedCategory);

  return (
    <>
      <Helmet>
        <title>ToprakBlogs | Explore the Future</title>
        <meta name="description" content="Technology, coding and more insights from Toprak." />
      </Helmet>

      <Header />
      
      <div className="relative min-h-screen bg-[#050505] text-gray-100 selection:bg-purple-500/30">
        
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-500/20 rounded-full"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -20, 0] }}
              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <main className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          
          <div className="mb-16 text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-purple-500 font-mono text-sm tracking-widest uppercase mb-2">
                #{selectedCategory.toLowerCase()}
              </h2>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                Discover & Explore <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  Topics That Excite
                </span>
              </h1>
            </motion.div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-12 py-4 border-y border-white/5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 transform active:scale-95 ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] scale-105"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
                }`}
              >
                {category === "All" ? "Everything" : `#${category.toLowerCase()}`}
              </button>
            ))}
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="group cursor-pointer bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden hover:border-purple-500/40 hover:bg-white/[0.04] transition-all duration-500"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.coverImageUrl ? `${config.api}${post.coverImageUrl}` : "https://via.placeholder.com/800"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-tighter">
                        {post.category || "General"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4 leading-snug group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(post.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-purple-600/10 flex items-center justify-center group-hover:bg-purple-600 transition-all">
                        <span className="text-purple-500 group-hover:text-white text-lg">→</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 italic">Bu kategoride henüz bir yazı yok...</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}