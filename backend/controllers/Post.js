const Post = require("../models/Post");
const Subscribe = require("../models/Subscribes")
const transporter = require("../utils/mailer")

const createPost = async(req, res) => {
    try {
        const { title, slug, content, category, published } = req.body;
        if(!title || !slug || !content || !category) {
            return res.status(400).json({ message: "Already have this slug."})
        }
            const exists = await Post.findOne({ slug })
            if (exists) {
                return res.status(400).json({ message: "Already have this slug." })
            }
        let coverImageUrl = null;
        if (req.file) {
            coverImageUrl = `/uploads/${req.file.filename}`;
        }
        
        const post = new Post({
            title,
            slug,
            content,
            category,
            coverImageUrl,
            published: published === "true" || published === true,
        })

        await post.save()
        
        const subscribers = await Subscribe.find()

        const emails = subscribers.map(sub => sub.email)

                if(emails.length > 0) {
            await transporter.sendMail({
                from: '"Toprak Blog" <ceoftoprak@gmail.com>',
                to: "Toprak Blog <ceoftoprak@gmail.com>",
                bcc: emails,
                subject: `New Post!: ${title}`,
html: `
<div style="background-color:#0b0b0b;color:#ffffff;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:60px 20px">
  <div style="max-width:600px;margin:0 auto">

    <div style="text-align:center;margin-bottom:40px">
      <img src="https://raw.githubusercontent.com/TPashaxrd/your-blog/refs/heads/main/ToprakButGlassesIsAI.png" alt="Toprak" style="width:48px;margin-bottom:15px" />
      <h1 style="margin:0;font-size:28px;font-weight:800;letter-spacing:-1px">
        New Blog Posted 🚀
      </h1>
      <p style="color:#9ca3af;font-size:14px;margin-top:8px">
        Toprak Blog’dan yeni bir içerik
      </p>
    </div>

    <div style="background:#111111;border:1px solid rgba(255,255,255,0.06);border-radius:24px;padding:35px;box-shadow:0 20px 40px rgba(0,0,0,0.4)">
      
      <div style="margin-bottom:16px">
        <span style="background:#1f2937;color:#a855f7;padding:6px 12px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase">
          ${category}
        </span>
      </div>

      <h2 style="font-size:24px;font-weight:800;margin:0 0 12px 0;line-height:1.3">
        ${title}
      </h2>

      <p style="color:#d1d5db;font-size:15px;line-height:1.7;margin-bottom:28px">
        Toprak has wrote new blog in the site, Check up right now!
      </p>

      <div style="text-align:center">
        <a href="https://toprak.xyz/blog/${slug}"
           style="display:inline-block;background:#9333ea;color:#ffffff;padding:16px 36px;text-decoration:none;border-radius:14px;font-weight:800;font-size:13px;letter-spacing:2px;text-transform:uppercase">
          Read the blog →
        </a>
      </div>
    </div>

    <div style="margin-top:40px;text-align:center;font-size:11px;color:#6b7280;line-height:1.6">
      <p>
        You are receiving this email because you subscribed to Toprak Blog.
      </p>
      <p>
        If you don't want receiving the mails
        <a href="#" style="color:#9ca3af;text-decoration:underline">you can unsubscribe</a>.
      </p>
      <p style="margin-top:10px">
        © ${new Date().getFullYear()} toprak.xyz
      </p>
    </div>

  </div>
</div>
`
            })
        }

        res.status(201).json(post)
    } catch (error) {
        res.status(500).json({ message: "Server Error." })
    }
}

const deletePosts = async(req, res) => {
    try {
        const { postId } = req.body;
        if(!postId) {
            return res.status(400).json({ message: "All fields are required."})
        }
        const post = await Post.findById(postId)
        if(!post) {
            return res.status(400).json({ message: "Post not found."})
        }

        const deletePost = await Post.findByIdAndDelete(postId)

        res.status(201).json(deletePost)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const showPosts = async(req, res) => {
    try {
        const posts = await Post.find().sort({ _id: -1 });
        res.status(201).json(posts)
    } catch (error) {
        res.status(500).json({ message: "Error"})
    }
}

const showPostBySlug = async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await Post.findOne({ slug });
      if (!post) return res.status(404).json({ message: "Post not found." });
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
};

const incrementViews = async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await Post.findOne({ slug });
      if (!post) return res.status(404).json({ message: "Post not found." });
  
      post.views += 1;
      await post.save();
  
      res.status(200).json({ views: post.views });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };
  

module.exports = { createPost, showPosts, showPostBySlug, incrementViews, deletePosts }