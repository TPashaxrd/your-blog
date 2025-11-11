import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaShareAlt } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BiCopy, BiPencil } from "react-icons/bi";
import { MdDateRange, MdDone } from "react-icons/md";
import { GoReport } from "react-icons/go";
import { Helmet } from "react-helmet";
import toast, { Toaster } from "react-hot-toast";
import RelatedPosts from "./components/RelatedBlogs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { config } from "../components/config";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${config.api}/api/post/${slug}`);
        setPost(res.data);
      } catch (err: any) {
        setError("Failed to fetch post");
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

  if (loading) {
        return (
      <div className="min-h-screen items-center justify-center flex flex-col">
        <div className="loader">
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="line"></div>
      </div>
      </div>
    );
  }
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  const MarkdownComponents = {
    h1: ({node, ...props}: any) => <h1 className="font-inter text-4xl font-extrabold mt-4 mb-2 text-white" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-3xl space-grotesk font-bold mt-3 mb-2 text-white" {...props} />,
    h3: ({node, ...props}: any) => <h3 className="text-2xl font-semibold mt-2 mb-2 text-white" {...props} />,
    h4: ({node, ...props}: any) => <h4 className="text-xl font-semibold mt-2 mb-1 text-white" {...props} />,
    h5: ({node, ...props}: any) => <h5 className="text-lg font-medium mt-1 mb-1 text-white" {...props} />,
    h6: ({node, ...props}: any) => <h6 className="text-md font-medium mt-1 mb-1 text-white" {...props} />,
    p: ({node, ...props}: any) => <p className="text-gray-300 my-2" {...props} />,
    code: ({ inline, className, children }: any) => {
        const match = /language-(\w+)/.exec(className || '');
        if (inline) {
          return (
            <code className="bg-gray-800 text-red-400 px-1 py-0.5 rounded font-mono text-sm">
              {children}
            </code>
          );
        } else {
          return (
            <SyntaxHighlighter
              style={oneDark}
              language={match ? match[1] : 'text'}
              PreTag="pre"
              customStyle={{
                borderRadius: '0.5rem',
                padding: '1rem',
                fontSize: '0.875rem',
                overflowX: 'auto',
                backgroundColor: '#1e1e1e'
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        }
      },
    a: ({ node, ...props }: any) => (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative text-blue-400 hover:underline group"
        >
          {props.children}
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {props.href}
          </span>
        </a>
      ),
    ul: ({node, ...props}: any) => <ul className="list-disc pl-5 my-2 text-gray-300" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal pl-5 my-2 text-gray-300" {...props} />,
    table: ({node, ...props}: any) => {
      const tableRef = useRef<HTMLTableElement>(null);
      const copyTable = () => {
        if (tableRef.current) {
          const temp = document.createElement("textarea");
          temp.value = tableRef.current.innerText;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
          setIsDisabled(true)
          setTimeout(() => setIsDisabled(false), 2000)
          toast("Copied to clipboard!", {
            style: { backgroundColor: '#333', color: 'white' },
            icon: <MdDone size={20} />
          })
        }
      };
      return (
        <div className="relative my-4">
          <button
            onClick={copyTable}
            disabled={isDisabled}
            className={`absolute top-0 right-0 font-inter text-xs px-2 py-1 rounded m-1 transition
                ${isDisabled 
                ? "bg-green-600 text-white cursor-not-allowed" 
                : "bg-gray-800 text-white hover:bg-gray-700"}`}
          >
            {isDisabled ? <MdDone size={17} /> : <BiCopy size={17} />}
          </button>
          <table ref={tableRef} className="table-auto border-collapse border border-gray-700 w-full text-gray-300" {...props} />
        </div>
      );
    },
    th: ({node, ...props}: any) => <th className="border border-gray-700 px-2 py-1 bg-gray-800 text-white" {...props} />,
    td: ({node, ...props}: any) => <td className="border border-gray-700 px-2 py-1 text-gray-300" {...props} />,
    img: ({node, ...props}: any) => <img className="my-4 rounded-lg max-w-full" {...props} />,
  };

  return (
    <>
      <Helmet>
      <title>{post ? post.title : "Blog Post"} | {config.name}</title>
      <meta name="author" content="Toprak | ToprakBlogs" />
      <meta property="article:published_time" content={post.createdAt} />
      <meta property="article:modified_time" content={post.updatedAt || post.createdAt} />
      <meta name="twitter:creator" content="@ToprakBlogs" />
      
      <meta name="description" content={post ? post.content.slice(0, 150) : "Blog post content"} />
      <meta name="keywords" content={post?.category || "blog, tech"} />
      <link rel="canonical" href={`${config.api}/blog/${post?.slug}`} />

      <meta property="og:title" content={post?.title} />
      <meta property="og:description" content={post?.content.slice(0,150)} />
      {post?.coverImageUrl && <meta property="og:image" content={`${config.api}${post.coverImageUrl}`} />}
      <meta property="og:url" content={`${config.api}/blog/${post?.slug}`} />
      <meta property="og:type" content="article" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post?.title} />
      <meta name="twitter:description" content={post?.content.slice(0,150)} />
      {post?.coverImageUrl && <meta name="twitter:image" content={`${config.api}${post.coverImageUrl}`} />}
    </Helmet>

      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-900 rounded-xl mb-24 min-h-screen">

        {post ? (
          <article className="bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
            {post.coverImageUrl && (
              <img
                src={`${config.api}${post.coverImageUrl}`}
                alt={post.title}
                className="w-full h-64 object-cover"
                crossOrigin="anonymous"
              />
            )}

            <div className="p-6">
              <h1 className="text-4xl font-extrabold mb-3 text-white">{post.title}</h1>

              <div className="flex items-center text-gray-400 text-sm mb-4">
                <span className="flex gap-2"><BiPencil size={15} className="mt-1" /> by <a className="font-bold text-white">{config.name}</a></span>
                <span className="mx-2">•</span>
                <span className="flex gap-1"><MdDateRange size={20} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                {post.category && (
                  <span className="ml-3 bg-gray-700 px-2 py-1 rounded-full text-xs text-white">
                    #{post.category}
                  </span>
                )}
              </div>

              <div className="prose max-w-none mb-6 text-gray-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                  {post.content}
                </ReactMarkdown>
              </div>

              <div className="flex items-center gap-6 text-gray-400 mt-6">
                <button disabled={isDisabled} className="flex hover:bg-gray-700 duration-300 transition px-2 py-2 hover:text-white rounded-xl items-center gap-2 hover:text-red-500">
                    <GoReport size={20} /> <span>Report</span>
                </button>
                <button className="flex items-center gap-2 hover:text-green-500">
                  <FaShareAlt /> <span>Share</span>
                </button>
                <div className="text-center text-gray-500">
                {post.views} Views
              </div>
              </div>

              {post && (
                <div className="mt-10 border-t border-gray-700 pt-6">
                    <h2 className="text-2xl font-bold mb-4 text-white">Related Blogs</h2>
                    <RelatedPosts category={post.category} currentId={post._id} />
                </div>
              )}
            </div>
          </article>
        ) : (
          <div className="text-center py-10 text-gray-300">No post found.</div>
        )}
      </div>
      <Footer />
      <Toaster position="top-right" />
    </>
  );
}