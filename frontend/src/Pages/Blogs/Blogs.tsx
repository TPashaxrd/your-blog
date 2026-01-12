import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaShareAlt, FaRegEye } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BiCopy } from "react-icons/bi";
import { GoReport } from "react-icons/go";
import { Helmet } from "react-helmet-async";
import toast, { Toaster } from "react-hot-toast";
import RelatedPosts from "../components/RelatedBlogs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { config } from "../../components/config";
import { motion, useScroll, useSpring } from "framer-motion";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [isDisabled, setIsDisabled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${config.api}/api/post/${slug}`);
        setPost(res.data);
      } catch (err: any) {
        setError("Yazı yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const postView = async () => {
      try {
        await axios.patch(`${config.api}/api/post/${slug}/view`);
      } catch (error) {
        console.error(error);
      }
    };
    postView();
  }, [slug]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Kopyalandı!");
  };

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

  if (error) return <div className="text-red-500 text-center py-20 bg-[#050505] min-h-screen">{error}</div>;

  const MarkdownComponents = {
    h1: ({...props}) => <h1 className="text-4xl md:text-5xl font-black mt-12 mb-6 text-white leading-tight tracking-tight" {...props} />,
    h2: ({...props}) => <h2 className="text-3xl font-bold mt-10 mb-4 text-white border-l-4 border-purple-600 pl-4" {...props} />,
    h3: ({...props}) => <h3 className="text-2xl font-bold mt-8 mb-3 text-purple-400" {...props} />,
    p: ({...props}) => <p className="text-gray-300 text-lg leading-relaxed mb-6 font-light selection:bg-purple-500/30" {...props} />,
    blockquote: ({...props}) => (
      <blockquote className="border-l-4 border-purple-500 bg-purple-500/5 px-6 py-4 italic my-8 text-gray-400 text-xl rounded-r-xl" {...props} />
    ),
    code: ({ inline, className, children }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      return inline ? (
        <code className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded font-mono text-sm">{children}</code>
      ) : (
        <div className="relative group my-8">
          <button 
            onClick={() => copyToClipboard(String(children))}
            className="absolute right-4 top-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-gray-400"
          >
            <BiCopy size={18} />
          </button>
          <SyntaxHighlighter
            style={oneDark}
            language={match ? match[1] : 'text'}
            PreTag="div"
            customStyle={{
              borderRadius: '1rem',
              padding: '1.5rem',
              fontSize: '0.9rem',
              backgroundColor: '#0d0d0d',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    },
    img: ({...props}) => (
      <div className="my-10">
        <img className="rounded-2xl shadow-2xl border border-white/5 w-full object-cover" {...props} />
        {props.alt && <p className="text-center text-gray-500 text-sm mt-3 italic">{props.alt}</p>}
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      <Helmet>
        <title>{post?.title} | {config.name}</title>
        <meta name="description" content={post?.content.slice(0, 160)} />
        <meta property="og:image" content={`${config.api}${post?.coverImageUrl}`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-purple-600 z-[100] origin-left" style={{ scaleX }} />

      <Header />

      {post && (
        <div className="relative w-full h-[70vh] flex items-end">
          <div className="absolute inset-0 z-0">
            <img 
              src={`${config.api}${post.coverImageUrl}`} 
              className="w-full h-full object-cover opacity-30" 
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          </div>

          <div className="container mx-auto max-w-4xl px-4 z-10 pb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="px-4 py-1.5 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                {post.category || "Teknoloji"}
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-gray-400 border-t border-white/10 pt-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                    {/* {config.name[0]} */}
                    <img src="https://raw.githubusercontent.com/TPashaxrd/your-blog/refs/heads/main/toprak-picture.jpg" className="w-full h-full rounded-full" />
                  </div>
                  <div>
                    <p className="text-white font-semibold leading-none mb-1">{config.name}</p>
                    <p className="text-xs uppercase tracking-tighter">Writer</p>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-tighter">Date</span>
                  <span className="text-sm font-medium text-gray-200">{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs uppercase tracking-tighter">Read</span>
                  <span className="text-sm font-medium text-gray-200 flex items-center gap-1"><FaRegEye /> {post.views}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <main className="container mx-auto max-w-3xl px-4 py-16">
        <article>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents as any}>
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold text-white mb-1">Did you like this?</h4>
              <p className="text-gray-400 text-sm">You can support me with sharing your friends.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  navigator.share({ title: post.title, url: window.location.href });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all transform active:scale-95"
              >
                <FaShareAlt /> Share
              </button>
              <button className="p-3 bg-gray-800 hover:bg-rose-500/20 hover:text-rose-500 text-gray-400 rounded-2xl transition-all border border-transparent hover:border-rose-500/30">
                <GoReport size={24} />
              </button>
            </div>
          </div>

          <section className="mt-20">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-black text-white">Like this</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-600 to-transparent" />
            </div>
            <RelatedPosts category={post.category} currentId={post._id} />
          </section>
        </article>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}