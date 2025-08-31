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
import toast, { Toaster } from "react-hot-toast";
import RelatedPosts from "./components/RelatedBlogs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, 
    // oneLight, ghcolors
 } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/post/${slug}`);
        setPost(res.data);
      } catch (err: any) {
        setError("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPost();
  }, [slug]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  const MarkdownComponents = {
    h1: ({node, ...props}: any) => <h1 className="font-inter text-4xl font-extrabold mt-4 mb-2" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-3xl space-grotesk font-bold mt-3 mb-2" {...props} />,
    h3: ({node, ...props}: any) => <h3 className="text-2xl font-semibold mt-2 mb-2" {...props} />,
    h4: ({node, ...props}: any) => <h4 className="text-xl font-semibold mt-2 mb-1" {...props} />,
    h5: ({node, ...props}: any) => <h5 className="text-lg font-medium mt-1 mb-1" {...props} />,
    h6: ({node, ...props}: any) => <h6 className="text-md font-medium mt-1 mb-1" {...props} />,
    p: ({node, ...props}: any) => <p className="text-base my-2" {...props} />,
    code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '');
        if (inline) {
          return (
            <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded font-mono text-sm">
              {children}
            </code>
          );
        } else {
          return (
            <SyntaxHighlighter
              style={oneDark}
              language={match ? match[1] : 'text'}
              PreTag="div"
              customStyle={{
                borderRadius: '0.5rem',
                padding: '1rem',
                fontSize: '0.875rem',
                overflowX: 'auto',
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
          className="relative text-blue-500 hover:underline group"
        >
          {props.children}
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {props.href}
          </span>
        </a>
      ),
    ul: ({node, ...props}: any) => <ul className="list-disc pl-5 my-2" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal pl-5 my-2" {...props} />,
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
          toast("Successfully copied to clipboard!", {
            style: {
                backgroundColor: 'black',
                color: 'white',
            },
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
            ? "bg-green-600 text-white cursor-disabled" 
            : "bg-black text-white hover:bg-black/70"}`}
        >
        {isDisabled ? <MdDone size={17} /> : <BiCopy size={17} />}
        </button>
          <table ref={tableRef} className="table-auto border-collapse border border-gray-300 w-full" {...props} />
        </div>
      );
    },
    th: ({node, ...props}: any) => <th className="border border-gray-300 px-2 py-1 bg-gray-100" {...props} />,
    td: ({node, ...props}: any) => <td className="border border-gray-300 px-2 py-1" {...props} />,
    img: ({node, ...props}: any) => <img className="my-4 rounded-lg max-w-full" {...props} />,
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {post ? (
          <article className="bg-white shadow-lg rounded-2xl overflow-hidden">
            {post.coverImageUrl && (
              <img
                src={`http://localhost:5000${post.coverImageUrl}`}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            )}

            <div className="p-6">
              <h1 className="text-4xl font-extrabold mb-3">{post.title}</h1>

              <div className="flex items-center text-gray-500 text-sm mb-4">
                <span className="flex gap-2"><BiPencil size={15} className="mt-1" /> by <a className="font-bold">Your Blog</a></span>
                <span className="mx-2">•</span>
                <span className="flex gap-1"><MdDateRange size={20} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                {post.category && (
                  <span className="ml-3 bg-gray-200 px-2 py-1 rounded-full text-xs">
                    #{post.category}
                  </span>
                )}
              </div>

              <div className="prose max-w-none mb-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                  {post.content}
                </ReactMarkdown>
              </div>

              <div className="flex items-center gap-6 text-gray-600 mt-6">
                <button disabled={isDisabled} className="flex hover:bg-gray-700 duration-300 transition px-2 py-2 hover:text-white rounded-xl items-center gap-2 hover:text-red-500">
                    <GoReport size={20} /> <span>Report</span>
                </button>
                <button className="flex items-center gap-2 hover:text-green-500">
                  <FaShareAlt /> <span>Share</span>
                </button>
              </div>
            {post && (
            <div className="mt-10 border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">Related Blogs</h2>
                <RelatedPosts category={post.category} currentId={post._id} />
            </div>
            )}
            </div>
          </article>
        ) : (
          <div className="text-center py-10">No post found.</div>
        )}
      </div>
      <Footer />
      <Toaster position="top-right" />
    </>
  );
}