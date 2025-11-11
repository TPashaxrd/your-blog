import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { config } from "../components/config";

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

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(p => (p.category || "Uncategorized") === selectedCategory);

  return (
    <>
      <Header />
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-gray-100">
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>
        <div className="px-6 py-12 max-w-7xl mx-auto">
          <div className="mb-8">
            <span className="text-white font-bold text-5xl text-start">
              #{selectedCategory.toLowerCase()}
            </span>
            <h1 className="mt-2 text-sm font-bold text-gray-300">
              Discover & Explore Topics That Excite You
            </h1>
            <p className="mt-2 text-gray-400 sm:text-lg">
              Filter posts by category and find content that sparks your curiosity.
            </p>
          </div>

          <div className="border border-gray-700 mb-3"></div>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white font-inter shadow-lg scale-105"
                    : "bg-gray-800 text-gray-200 hover:bg-purple-700 hover:text-white"
                }`}
              >
                #{category.toLowerCase()}
              </button>
            ))}
          </div>
          <div className="border border-gray-700 mb-9"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <div
                key={post._id}
                className="rounded-2xl overflow-hidden cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
                onClick={() => window.location.href = `/blog/${post.slug}`}
              >
                <div className="relative w-full aspect-square overflow-hidden group">
                  <img
                    src={post.coverImageUrl ? `${config.api}${post.coverImageUrl}` : "https://via.placeholder.com/400"}
                    alt={post.title}
                    className="w-full h-full object-cover rounded-t-2xl transition-transform duration-500 group-hover:scale-110"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <span className="text-sm font-inter text-purple-400 font-medium uppercase">{post.category || "Uncategorized"}</span>
                  <h1 className='font-bold text-white capitalize text-xl font-inter'>
                    <span className='bg-gradient-to-r from-purple-500 to-purple-500 bg-[length:0px_6px] hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500'>
                      {post.title}
                    </span>
                  </h1>
                  <p className="text-gray-400 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
