import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
        const res = await axios.get(`http://localhost:5000/api/post/related?category=${category}&exclude=${currentId}`);
        setRelated(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (category) fetchRelated();
  }, [category, currentId]);

  if (loading) return <p className="text-gray-500">Loading related blogs...</p>;

  if (!related.length) return <p className="text-gray-500">No related blogs found.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {related.map((r) => (
        <Link
          key={r._id}
          to={`/blog/${r.slug}`}
          className="rounded-xl overflow-hidden border hover:shadow-md transition bg-white"
        >
          {r.coverImageUrl && (
            <img
              src={`http://localhost:5000${r.coverImageUrl}`}
              alt={r.title}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold">{r.title}</h3>
            <span className="text-xs text-gray-400">#{r.category}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
