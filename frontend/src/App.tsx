import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import axios from "axios";

export default function App() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await axios.get("http://localhost:5000/api/post");
        setPosts(res.data);
        setLoading(true);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    }
    fetchPopular();
  }, []);

  
  if (!loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-xl text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-3 sm:mb-4">Oops!</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Sorry, we couldn't load the content. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 sm:px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-center px-3 sm:px-6 mt-4 sm:mt-6 mb-12 gap-6 w-full">
        <div className="relative w-full max-w-7xl rounded-2xl overflow-hidden shadow-lg">
          <img
            className="w-full h-auto object-cover brightness-50"
            src="https://png.pngtree.com/thumb_back/fh260/background/20230715/pngtree-co-working-office-3d-rendering-of-modern-website-screens-with-responsive-image_3883155.jpg"
            alt="Hero"
          />
          <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 flex flex-col items-start text-left gap-2 sm:gap-3 px-2 sm:px-0">
          <button onClick={() => window.location.href = "/blog/web-development"} className="group hover:scale-105 font-inter bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm sm:text-base">
          Web Development
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
          </button>
          <h1 className='font-bold text-white capitalize text-lg sm:text-xl md:text-3xl lg:text-4xl'>
            <span className='bg-gradient-to-r from-purple-500 to-purple-500 bg-[length:0px_6px] hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500'>
            Building Progressive Web Apps: Bridging the Gap Between Web and Mobile
            </span>
          </h1>
            <span className="text-white/80 text-xs sm:text-sm md:text-lg max-w-3xl sm:max-w-3xl md:max-w-3xl">
              Integrating mindfulness practices helps developers cultivate present-moment awareness, fostering focus, problem-solving, and work-life balance.
            </span>
          </div>
        </div>

        <div className="w-full flex justify-start items-center mt-6 sm:mt-8">
          <h1 className="text-start font-inter px-4 sm:px-6 py-2 sm:py-3 ml-2 sm:ml-4 text-xl sm:text-3xl font-bold border-b-4 border-purple-700">
            Featured Posts
          </h1>
        </div>

        <div className="w-full max-w-7xl mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts[0] && (
            <div className="md:col-span-2 relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
              <img
                src={posts[0].coverImageUrl ? `http://localhost:5000${posts[0].coverImageUrl}` : "https://via.placeholder.com/600x400"}
                alt={posts[0].title}
                className="w-full h-48 sm:h-64 md:h-80 lg:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3 sm:p-6">
                <button className="group w-fit mb-2 px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm hover:scale-105 font-inter bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                  Web Development
                  <span className="ml-1 sm:ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
                <h1 className="font-bold text-white capitalize text-lg sm:text-2xl md:text-3xl lg:text-4xl">
                  <span className="bg-gradient-to-r from-purple-500 to-purple-500 bg-[length:0px_4px] sm:bg-[length:0px_6px] hover:bg-[length:100%_4px] sm:hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500">
                    {posts[0].title}
                  </span>
                </h1>
                <span className="text-gray-300 text-xs sm:text-sm">{new Date(posts[0].createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {posts.slice(1, 3).map((post) => (
              <div key={post._id} className="flex flex-col sm:flex-row items-start sm:items-center rounded-xl border border-gray-200 transition-all duration-300 hover:border-2 hover:border-purple-500">
                <img
                  src={post.coverImageUrl ? `http://localhost:5000${post.coverImageUrl}` : "https://via.placeholder.com/150"}
                  alt={post.title}
                  className="w-full sm:w-40 h-40 object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
                />
                <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center gap-2">
                  <span className="text-purple-500 font-medium text-xs sm:text-sm uppercase">{post.category || "Web Development"}</span>
                  <h3 className="text-base sm:text-lg font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:bg-purple-500 after:transition-all after:duration-500 hover:after:w-full">{post.title}</h3>
                  <span className="text-gray-400 text-xs sm:text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-7 mt-6 sm:mt-8 gap-4 sm:gap-0">
          <h1 className="text-start font-inter px-4 sm:px-6 py-2 sm:py-3 ml-2 sm:ml-4 text-xl sm:text-3xl font-bold border-b-4 border-purple-700">Recent Posts</h1>
          <button
            onClick={() => (window.location.href = "/blogs")}
            className="text-start font-inter px-4 sm:px-6 py-2 sm:py-3 ml-2 sm:ml-4 text-base sm:text-xl lg:text-2xl text-black hover:text-black/50 hover:underline font-bold border-b-4"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {posts.slice(0, 6).map((post) => (
            <div key={post._id} className="flex flex-col items-start gap-2 sm:gap-3">
              <div className="w-full aspect-square overflow-hidden rounded-lg">
                <img
                  src={post.coverImageUrl ? `http://localhost:5000${post.coverImageUrl}` : "https://via.placeholder.com/150"}
                  alt={post.title}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                />
              </div>

              <span onClick={() => window.location.href = "/blog"} className="text-purple-500 font-medium text-xs sm:text-sm uppercase cursor-pointer">
                {post.category?.toUpperCase() || "Web Development"}
              </span>

              <h1 className="font-bold capitalize text-base sm:text-lg md:text-xl">
                <span onClick={() => window.location.href = `/blog/${post.slug}`} className="cursor-pointer bg-gradient-to-r from-purple-500 to-purple-500 bg-[length:0px_4px] sm:bg-[length:0px_6px] hover:bg-[length:100%_4px] sm:hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500">
                  {post.title}
                </span>
              </h1>

              <span className="text-gray-400 text-xs sm:text-sm mb-5">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
