const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");
const User = require("../models/User");
const { 
    CreateGallery, 
    GetPublicGalleries, 
    setPrivateGalleries, 
    makeComment 
} = require("../controllers/Gallery");
const { commentLimiter, adminLimiter, generalLimiter } = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/Auth");

router.post("/create", authMiddleware, adminLimiter, CreateGallery);
router.get("/public", generalLimiter, GetPublicGalleries);
router.patch("/set-private", adminLimiter, setPrivateGalleries);
router.post("/comment", commentLimiter, makeComment);

router.delete('/comment/:galleryId/:commentId', async (req, res) => {
    try {
        const { galleryId, commentId } = req.params;
        const sessionUserId = req.session.userId; 

        if (!sessionUserId) {
            return res.status(401).json({ message: "Oturum açılmamış." });
        }

        const gallery = await Gallery.findById(galleryId);
        if (!gallery) return res.status(404).json({ message: "Galeri öğesi yok." });

        const comment = gallery.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Yorum bulunamadı." });

        const activeUser = await User.findById(sessionUserId);

        const isOwner = comment.userId && sessionUserId && comment.userId.toString() === sessionUserId.toString();
        const isAdmin = activeUser && activeUser.userRole === "Admin";

        if (isOwner || isAdmin || !comment.userId) {
            gallery.comments.pull(commentId);
            await gallery.save();
            return res.status(200).json({ message: "SiliDeletedndi." });
        }

        res.status(403).json({ message: "You dont have perm to delete this shit dude." });

    } catch (err) {
        console.error("SİLME_HATASI_LOG:", err); 
        res.status(500).json({ message: "Server error: " + err.message });
    }
});

module.exports = router;