import axios from "axios";
import { useEffect, useState } from "react";
import { config } from "../../../components/config";
import { FaTrash } from "react-icons/fa";

export default function Posts() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function getPosts() {
      try {
        const res = await axios.get(`${config.api}/api/post`);
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }

    getPosts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu postu silmek istediğine emin misin?")) return;
    setDeleting(id);

    try {
      await axios.delete(`${config.api}/api/post`, { data: { postId: id } });
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Unsuccessfully delete.");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <div className="p-8 bg-gray-800 rounded-3xl shadow-2xl text-center animate-pulse">
          <h2 className="text-2xl font-bold text-purple-400 mb-3">Loading...</h2>
          <p className="text-gray-300 text-sm">
            Please wait....
          </p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <div className="p-8 bg-gray-800 rounded-3xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-purple-400 mb-3">Have no post yet!</h2>
          <p className="text-gray-300 text-sm">
            Have no post yet, You should create a post!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 py-10 px-6 sm:px-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-purple-400 mb-10">
        Post Management
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-purple-500/40 transition-all duration-300 overflow-hidden border border-gray-700 hover:border-purple-500 transform hover:scale-[1.03] relative"
          >
            <div className="relative group">
              <img
                src={
                  post.coverImageUrl
                    ? `${config.api}${post.coverImageUrl}`
                    : "https://via.placeholder.com/400x250/1a1a1a/ffffff"
                }
                alt={post.title}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleDelete(post._id)}
                  disabled={deleting === post._id}
                  className={`p-2 rounded-full shadow-lg text-white transition-colors duration-300 ${
                    deleting === post._id
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  title="Delete Post"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <h2 className="text-lg font-bold text-white truncate">{post.title}</h2>
              <p className="text-gray-400 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-700/20 text-purple-300 rounded-full w-fit">
                {post.category || "Web Development"}
              </span>
            </div>

            {deleting === post._id && (
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center text-red-500 font-bold text-lg">
                Siliniyor...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}