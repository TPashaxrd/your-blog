import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaShareAlt, FaRegEye } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BiCopy, BiSend, BiMessageDetail, BiTimeFive, BiLoaderAlt, BiTrash } from "react-icons/bi";
import { Helmet } from "react-helmet-async";
import toast, { Toaster } from "react-hot-toast";
import RelatedPosts from "../components/RelatedBlogs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { config } from "../../components/config";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure about delete this comment?")) return;

    try {
      await axios.delete(
        `${config.api}/api/comment/comment/${commentId}`,
        { withCredentials: true }
      );
      toast.success("Comment successfully deleted..");
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Comment didn't deleted.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await axios.get(`${config.api}/api/post/${slug}`);
        const postData = postRes.data;
        setPost(postData);

        const commentRes = await axios.get(`${config.api}/api/comment/${postData._id}/comments`);
        setComments(commentRes.data.comments);

        const userRes = await axios.get(`${config.api}/api/auth/me`, { withCredentials: true });
        setCurrentUser(userRes.data.user);
      } catch (err: any) {
        if (err.response?.status !== 401) {
            setError("An error occurred while loading the content.");
        }
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    axios.patch(`${config.api}/api/post/${slug}/view`).catch(console.error);
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    setCommentLoading(true);

    try {
      await axios.post(`${config.api}/api/comment/${post._id}/comment`, 
        { content: commentContent }, 
        { withCredentials: true }
      );
      toast.success("Comment added!");
      setCommentContent("");
      const newCommentRes = await axios.get(`${config.api}/api/comment/${post._id}/comments`);
      setComments(newCommentRes.data.comments);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Comment could not be sent.");
    } finally {
      setCommentLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  if (loading) return (
    <div className="min-h-screen items-center justify-center flex bg-[#050505]">
       <BiLoaderAlt className="text-purple-600 animate-spin text-5xl" />
    </div>
  );

  if (error || !post) return <div className="text-red-500 text-center py-20 bg-[#050505] min-h-screen">{error || "Post bulunamadı."}</div>;

  const MarkdownComponents = {
    h1: ({...props}) => <h1 className="text-3xl md:text-5xl font-black mt-12 mb-6 text-white leading-tight" {...props} />,
    h2: ({...props}) => <h2 className="text-2xl font-bold mt-10 mb-4 text-white border-l-4 border-purple-600 pl-4" {...props} />,
    p: ({...props}) => <p className="text-gray-300 text-lg leading-relaxed mb-6 font-light" {...props} />,
    code: ({ inline, className, children }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      return inline ? (
        <code className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded font-mono text-sm">{children}</code>
      ) : (
        <div className="relative group my-8">
          <button onClick={() => copyToClipboard(String(children))} className="absolute right-4 top-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-gray-400"><BiCopy size={18} /></button>
          <SyntaxHighlighter style={oneDark} language={match ? match[1] : 'text'} PreTag="div" customStyle={{ borderRadius: '1rem', padding: '1.5rem', fontSize: '0.9rem', backgroundColor: '#0d0d0d', border: '1px solid rgba(255,255,255,0.05)' }}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      <Helmet>
        <title>{post.title} | {config.name}</title>
      </Helmet>

      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-purple-600 z-[110] origin-left" style={{ scaleX }} />
      <Header />

      <div className="relative w-full h-[70vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <img src={`${config.api}${post.coverImageUrl}`} className="w-full h-full object-cover opacity-30" alt="Cover" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        </div>
        <div className="container mx-auto max-w-4xl px-4 z-10 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="px-4 py-1.5 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">{post.title}</h1>
            <div className="flex items-center gap-6 text-gray-400 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3">
                <img src="https://raw.githubusercontent.com/TPashaxrd/your-blog/refs/heads/main/ToprakButGlassesIsAI.png" className="w-12 h-12 rounded-full border border-purple-500/50 object-cover" alt="Author" />
                <div><p className="text-white font-semibold leading-none">{config.name}</p><p className="text-[10px] uppercase">Author</p></div>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div className="flex flex-col"><span className="text-[10px] uppercase">Views</span><span className="text-sm font-medium text-gray-200 flex items-center gap-1"><FaRegEye /> {post.views}</span></div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto max-w-3xl px-4 py-16">
        <article className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents as any}>{post.content}</ReactMarkdown>
        </article>

        <div className="mt-20 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div><h4 className="text-xl font-bold text-white mb-1">Intel Insight?</h4><p className="text-gray-400 text-sm">Spread the knowledge with your network.</p></div>
          <button onClick={() => navigator.share({ title: post.title, url: window.location.href })} className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all"><FaShareAlt /> Share</button>
        </div>

        <section className="mt-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black text-white flex items-center gap-3 uppercase italic"><BiMessageDetail className="text-purple-500" /> Discussion</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-600/50 to-transparent" />
          </div>

          {currentUser ? (
            <form onSubmit={handleCommentSubmit} className="mb-16">
              <textarea value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Join the discussion..." className="w-full bg-white/[0.03] border border-white/5 rounded-3xl p-6 text-white outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all min-h-[150px]" />
              <div className="flex justify-end mt-4">
                <button disabled={commentLoading || !commentContent.trim()} className="flex items-center gap-2 px-10 py-4 bg-white text-black hover:bg-purple-600 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
                  {commentLoading ? <BiLoaderAlt className="animate-spin" /> : <><BiSend size={18} /> Post Update</>}
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-16 bg-purple-600/5 border border-purple-500/10 p-10 rounded-[2.5rem] text-center backdrop-blur-sm">
              <p className="text-gray-400 font-medium mb-6 uppercase tracking-widest text-xs">Authorize to participate</p>
              <Link to="/login" className="inline-block px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-purple-600 hover:text-white transition-all">Log In</Link>
            </div>
          )}

          <div className="space-y-6">
            <AnimatePresence>
              {comments.map((comment, i) => {
                const canDelete =
                  currentUser &&
                  (
                    currentUser._id === comment.userId?._id ||
                    currentUser.userRole === "Admin"
                  );

                return (
                  <motion.div key={comment._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all group relative">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-900/40 to-blue-900/40 border border-white/10 flex items-center justify-center text-purple-400 font-black uppercase text-xl shrink-0">
                        {comment.userId?.name?.[0] || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3 gap-2">
                          <div className="flex flex-col">
                            <h5 className="text-white font-black text-xs uppercase tracking-[0.2em] truncate">{comment.userId?.name}</h5>
                            <span className="text-[9px] text-gray-600 font-mono flex items-center gap-1 uppercase tracking-widest shrink-0"><BiTimeFive /> {new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {canDelete && (
                            <button 
                              onClick={() => handleDeleteComment(comment._id)} 
                              className="p-2 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete Comment"
                            >
                              <BiTrash size={18} />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-400 text-[15px] leading-relaxed font-light break-words">{comment.content}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {comments.length === 0 && <p className="text-center text-gray-700 py-20 font-mono text-[10px] uppercase tracking-[0.4em]">Zero comment found.</p>}
          </div>
        </section>

        <section className="mt-32">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-black text-white uppercase italic">Related Intel</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-600 to-transparent" />
          </div>
          <RelatedPosts category={post.category} currentId={post._id} />
        </section>
      </main>

      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}