import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import axios from "axios";
import { config } from "./components/config";

interface Post {
  _id: string;
  title: string;
  coverImageUrl: string;
  category: string;
  excerpt?: string;
  slug?: string;
  createdAt: string;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get(`${config.api}/api/post`);
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

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

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <div className="p-8 bg-gray-900 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)] text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Oops!</h2>
          <p className="text-gray-400 mb-6">
            Sorry, we couldn't load the content. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getImageUrl = (post: Post, width = 600, height = 400) =>
    post.coverImageUrl
      ? `https://api.toprak.xyz${post.coverImageUrl}`
      : `https://via.placeholder.com/${width}x${height}`;

  return (
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

      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg mb-16">
          <img
            className="w-full h-[50vh] object-cover brightness-50"
            src="https://raw.githubusercontent.com/TPashaxrd/your-blog/refs/heads/main/toprak-banner.png"
            alt="Hero"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-8 left-8 flex flex-col items-start gap-4 px-2">
            <a
              href="/blogs"
              className="group hover:scale-105 font-medium bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm sm:text-base shadow-md"
            >
              My Blogs (as Student)
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </a>
            <h1 className="font-bold text-white text-2xl sm:text-3xl md:text-5xl max-w-4xl">
              <a className="bg-gradient-to-r from-purple-500 to-purple-500 bg-[length:0px_6px] hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500">
                Student as Fullstack web dev.
              </a>
            </h1>
            <p className="text-white/80 text-sm md:text-lg max-w-3xl hidden sm:block">
              {posts[0]?.excerpt || "Integrating mindfulness practices helps developers cultivate focus and balance."}
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-white relative inline-block">
            Featured Posts
            <span className="absolute -bottom-2 left-0 w-2/3 h-1 bg-purple-600"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts[0] && (
              <a
                href={`/blog/${posts[0].slug}`}
                className="md:col-span-2 group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-1"
              >
                <img
                  src={getImageUrl(posts[0], 800, 420)}
                  alt={posts[0].title}
                  crossOrigin="anonymous"
                  className="w-full w-max-xl  object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <h3 className="font-bold text-white text-2xl md:text-4xl">
                    <span className="bg-gradient-to-r from-purple-500 to-purple-500 bg-[length:0px_6px] group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500">
                      {posts[0].title}
                    </span>
                  </h3>
                  <span className="text-gray-400 text-sm mt-2">
                    {new Date(posts[0].createdAt).toLocaleDateString()}
                  </span>
                </div>
              </a>
            )}

            <div className="flex flex-col gap-6">
              {posts.slice(1, 3).map((post) => (
                <a
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="flex items-start gap-4 group p-4 rounded-xl bg-gray-900/50 hover:bg-gray-900 transition-all duration-300 border border-gray-800 hover:border-purple-600"
                >
                  <img
                    src={getImageUrl(post, 150, 150)}
                    alt={post.title}
                    crossOrigin="anonymous"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg flex-shrink-0"
                    />
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <span className="text-purple-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-gray-200 group-hover:text-white transition-colors">
                      {post.title}
                    </h3>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white relative inline-block">
              Recent Posts
              <span className="absolute -bottom-2 left-0 w-2/3 h-1 bg-purple-600"></span>
            </h2>
            <a
              href="/blog"
              className="text-purple-400 hover:text-purple-300 font-semibold group transition-colors"
            >
              View all
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {posts.slice(0, 6).map((post) => (
              <a
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3"
              >
                <div className="w-full aspect-video overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={getImageUrl(post)}
                    alt={post.title}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-purple-400 font-semibold text-sm uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-xl text-gray-200 group-hover:text-white transition-colors">
                    {post.title}
                  </h3>
                  <span className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;