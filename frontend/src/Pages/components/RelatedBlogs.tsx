import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { config } from "../../components/config";
import { motion } from "framer-motion";

interface RelatedPostsProps {
  category: string;
  currentId: string;
}

export default function RelatedPosts({ category, currentId }: RelatedPostsProps) {
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(`${config.api}/api/post/related?category=${category}&exclude=${currentId}`);
        setRelated(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (category) fetchRelated();
  }, [category, currentId]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-64 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
        ))}
      </div>
    );
  }

  if (!related.length) return <p className="text-gray-500 italic">Henüz benzer bir yazı bulunamadı.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {related.slice(0, 4).map((r, index) => (
        <motion.div
          key={r._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            to={`/blog/${r.slug}`}
            className="group block relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-purple-500/50 transition-all duration-500 shadow-xl"
          >
            <div className="relative h-44 overflow-hidden">
              {r.coverImageUrl ? (
                <img
                  src={`${config.api}${r.coverImageUrl}`}
                  alt={r.title}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">No Image</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-60" />
              
              <span className="absolute top-4 left-4 px-3 py-1 bg-purple-600/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">
                {r.category}
              </span>
            </div>

            <div className="p-5">
              <h3 className="text-white font-bold text-lg leading-snug group-hover:text-purple-400 transition-colors line-clamp-2">
                {r.title}
              </h3>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                   {new Date(r.createdAt).toLocaleDateString('tr-TR')}
                </span>
                <span className="text-purple-500 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                  Oku <span className="text-lg">→</span>
                </span>
              </div>
            </div>

            <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/20 rounded-2xl pointer-events-none transition-all duration-500" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}