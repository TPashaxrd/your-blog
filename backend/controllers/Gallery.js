const Gallery = require("../models/Gallery");
const User = require("../models/User");

const CreateGallery = async (req, res) => {
    try {
        const { text, imageUrl } = req.body;
        if(!text || !imageUrl) return res.status(400).json({ message: "Text and Image URL are required." });
        
        const newGalleryItem = new Gallery({ text, imageUrl });
        await newGalleryItem.save();
        res.status(201).json(newGalleryItem);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const GetPublicGalleries = async (req, res) => {
    try {
        const publicGalleries = await Gallery.find({ isPublic: true }).sort({ createdAt: -1 });
        res.status(200).json(publicGalleries);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const setPrivateGalleries = async (req, res) => {
    try {
        const { id } = req.body;
        if(!id) return res.status(400).json({ message: "Gallery ID is required." });
        
        const galleryItem = await Gallery.findById(id);
        if(!galleryItem) return res.status(404).json({ message: "Not found" });
        
        galleryItem.isPublic = !galleryItem.isPublic;
        await galleryItem.save();
        res.status(200).json(galleryItem);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const makeComment = async (req, res) => {
    try {
        const { id, content } = req.body;
        const userId = req.session.userId; 

        if (!userId) return res.status(401).json({ message: "amk giris yapmamissin ki" });

        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: "User not found" });

        const updatedGallery = await Gallery.findByIdAndUpdate(
            id,
            {
                $push: { 
                    comments: { 
                        userId: user._id,
                        user: user.name,
                        content: content, 
                        createdAt: new Date() 
                    } 
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedGallery);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    CreateGallery,
    GetPublicGalleries,
    setPrivateGalleries,
    makeComment
};