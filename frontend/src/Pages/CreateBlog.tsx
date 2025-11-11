import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaBold, FaItalic, FaCode, FaLink, FaImage } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import Posts from "./components/Posts";
import { config } from "../components/config";

// const generateSlug = (title: string) => {
//   return title
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-");
// };

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    setContent(before + text + after);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCover(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  
  const handleSubmit = async () => {
    if (!title || !category || !content) return alert("All fields are required");
  
    const slug = slugify(title);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("category", category);
    formData.append("content", content);
    if (cover) formData.append("cover", cover);
  
    try {
      const res = await axios.post(`${config.api}/api/post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      alert("Successfully Submited!")
      setTitle("")
      setContent("")
      setCategory("")
      setError("")
      setTimeout(() => window.location.href = "/", 2000)
    } catch (err: any) {
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.error || err.response.data.message}`);
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError(`Error: ${err.message}`);
      }
    }
  };

  const checkPassw = async () => {
    setError("");
    if (!username || !password) return setError("Fill all fields");
  
    try {
      const res = await axios.post(`${config.api}/api/login`, { username, password });
  
      if (res.data.success) {
        setIsLoggedIn(true);
        setError("");
      } else {
        setError(res.data.message || "Invalid username or password");
      }
    } catch (err: any) {
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.message || err.response.data.error}`);
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError(`Error: ${err.message}`);
      }
    }
  };
  

  return (
    <>
      <Header />
      {isLoggedIn && (
      <div className="max-w-6xl mx-auto p-6 space-y-6 text-black bg-white min-h-screen">
        <h1 className="text-4xl font-extrabold mb-4">Create Blog Post</h1>

        <span className="text-start text-red-600">{error}</span>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500 outline-none"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-500 outline-none"
            />

            <div className="flex gap-2 mb-2">
              <button
                onClick={() => insertAtCursor("**bold text**")}
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-sm"
                title="Bold"
              >
                <FaBold />
              </button>
              <button
                onClick={() => insertAtCursor("_italic text_")}
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-sm"
                title="Italic"
              >
                <FaItalic />
              </button>
              <button
                onClick={() => insertAtCursor("```\ncode here\n```")}
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-sm"
                title="Code Block"
              >
                <FaCode />
              </button>
              <button
                onClick={() => insertAtCursor("[link text](https://example.com)")}
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-sm"
                title="Link"
              >
                <FaLink />
              </button>
              <button
                onClick={() => insertAtCursor("![alt text](https://example.com/image.jpg)")}
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-sm"
                title="Image"
              >
                <FaImage />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              placeholder="Write your content in Markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 h-72 font-mono focus:ring-2 focus:ring-gray-500 outline-none resize-none"
            />

            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Cover Image</label>
                <input title="File" type="file" onChange={handleCoverChange} className="mb-2" />
                {preview && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg max-h-64">
                    <img src={preview} alt="preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Live Preview</h2>
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 h-full overflow-auto shadow-inner">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-2" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-2" {...props} />,
                  a: ({ node, ...props }) => (
                    <a {...props} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" />
                  ),
                  code: ({ node, inline, className, children, ...props }: any) => {
                    // const match = /language-(\w+)/.exec(className || '');
                    if (inline) {
                      return (
                        <code className="bg-gray-200 text-red-600 px-1 rounded">{children}</code>
                      );
                    } else {
                      return (
                        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                          <code {...props}>{children}</code>
                        </pre>
                      );
                    }
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-gray-800 transition"
        >
          Submit Blog
        </button>
      </div>
      )}

      {isLoggedIn && (
              <Posts />
      )}

        {!isLoggedIn && (
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>

            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />

            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />

            <button
              onClick={checkPassw}
              className="w-full py-3 mb-4 bg-black hover:bg-black/70 hover:text-white/70 duration-300 text-white font-semibold rounded-lg shadow-md"
            >
              Login
            </button>

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CreateBlog;