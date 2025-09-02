const Post = require("../models/Post");

const createPost = async(req, res) => {
    try {
        const { title, slug, content, category, published } = req.body;
        if(!title || !slug || !content || !category) {
            return res.status(400).json({ message: "Already have this slug."})
        }
        const exists = await Post.findOne({ slug })

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
        
        res.status(201).json(post)
    } catch (error) {
        res.status(500).json({ message: "Server Error." })
    }
}

const showPosts = async(req, res) => {
    try {
        const posts = await Post.find()
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
  

module.exports = { createPost, showPosts, showPostBySlug, incrementViews }