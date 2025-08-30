import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import axios from "axios";

export default function App() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await axios.get("http://localhost:5000/api/post");
        setPosts(res.data);
        setLoading(true)
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    }
    fetchPopular();
  }, []);

  if (!loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't load the content. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 font-space-grotesk py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
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

      <main className="flex flex-col items-center justify-center px-4 sm:px-6 mt-6 mb-12 gap-6 w-full">
        <div className="relative w-full max-w-7xl rounded-2xl overflow-hidden shadow-lg">
          <img
            className="w-full h-auto object-cover brightness-50"
            src="https://png.pngtree.com/thumb_back/fh260/background/20230715/pngtree-co-working-office-3d-rendering-of-modern-website-screens-with-responsive-image_3883155.jpg"
            alt="Hero"
          />
          <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 flex flex-col items-start text-left gap-2 sm:gap-3 px-2 sm:px-0">
          <button className="group hover:scale-105 font-inter bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm sm:text-base">
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

        <div className="w-full flex justify-start items-center mt-8">
          <h1 className="text-start font-inter px-6 py-3 ml-4 sm:ml-6 w-full max-w-xl text-2xl sm:text-3xl font-bold border-b-4 border-purple-700">
            Featured Posts
          </h1>
        </div>

        <div className="w-full max-w-7xl mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts[0] && (
        <div className="md:col-span-2 relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
          <img
            src={posts[0].coverImageUrl ? `http://localhost:5000${posts[0].coverImageUrl}` : "https://via.placeholder.com/600x400"}
            alt={posts[0].title}
            className="w-full h-80 sm:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
            
          <button className="group w-1/3 mb-2 px-2 py-2 hover:scale-105 font-inter bg-white/10 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm sm:text-base">
          Web Development
          <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
          </button>
            <h1 className='font-bold text-white capitalize text-lg sm:text-xl md:text-3xl lg:text-4xl'>
            <span className='bg-gradient-to-r from-purple-500 to-purple-500 bg-[length:0px_6px] hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500'>
            {posts[0].title}
            </span>
          </h1>
            <span className="text-gray-300 text-sm">{new Date(posts[0].createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}

    <div className="flex flex-col gap-4">
      {posts.slice(1, 3).map((post) => (
        <div
          key={post._id}
          className="flex items-center rounded-xl border border-gray-200 transition-all duration-300 hover:border-2 hover:border-purple-500"
        >
          <img
            src={post.coverImageUrl ? `http://localhost:5000${post.coverImageUrl}` : "https://via.placeholder.com/150"}
            alt={post.title}
            className="w-48 h-48 object-cover rounded-l-xl"
          />
          <div className="flex-1 p-4 flex flex-col justify-center gap-2">
            <span className="text-purple-500 font-medium text-sm uppercase">{post.category || "Web Development"}</span>
            <h3 className="text-lg font-semibold relative after:absolute after:bottom-0 after:left-0 after:h-1 after:w-0 after:bg-purple-500 after:transition-all after:duration-500 hover:after:w-full">
              {post.title}
            </h3>
            <span className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
      </div>
      </main>

      <div className="w-full flex justify-between items-center mb-7 mt-8">
        <h1 className="text-start font-inter px-6 py-3 ml-4 sm:ml-6 w-full max-w-xl text-2xl sm:text-3xl font-bold border-b-4 border-purple-700">
          Recent Posts
        </h1>
        <button onClick={() => window.location.href = "/blogs" } className="text-start font-inter px-6 py-3 ml-4 sm:ml-6 w-full max-w-xl text-xl text-black hover:text-black/50 hover:underline sm:text-2xl font-bold border-b-4">View all</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {posts.slice(0, 6).map((post) => (
          <div
            key={post._id}
            className="flex flex-col items-start gap-3"
          >
            <div className="w-full aspect-square overflow-hidden rounded-lg">
              <img
                src={post.coverImageUrl ? `http://localhost:5000${post.coverImageUrl}` : "https://via.placeholder.com/150"}
                alt={post.title}
                className="w-full  h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
              />
            </div>

            <span onClick={() => window.location.href = "/blog"} className="text-purple-500 font-medium text-sm uppercase">
              {post.category?.toUpperCase() || "Web Development"}
            </span>

            <h1 className='font-bold capitalize text text-xl'>
              <span onClick={() => window.location.href = `/blog/${post.slug}`} className='cursor-pointer bg-gradient-to-r from-purple-500 to-purple-500 bg-[length:0px_6px] hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500'>
                {post.title}
              </span>
            </h1>

            <span className="text-gray-400 mb-7">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}