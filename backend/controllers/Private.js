const Private = require("../models/Private");

const CreatePrivate = async (req, res) => {
    try {
        const { title, text } = req.body;
        if(!title || !text) {
            return res.status(400).json({ message: "All fields are required"})
        }

        const newPrivate = new Private({
            title,
            text
        })
        await newPrivate.save()

        res.status(201).json({ message: "Successfully added."})
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error}`})
    }
}

const getAllPrivates = async (req, res) => {
    try {
        const allPrivates = await Private.find().sort({ _id: -1 });
        res.status(201).json(allPrivates)
    } catch (error) {
        res.status(500).json({ message: `Server ${error}`})
    }
}

const getPrivateWithId = async (req, res) => {
    try {
        const { id } = req.body;
        const private = await Private.findById(id)

        res.status(201).json(private)
    } catch (error) {
        res.status(500).json({ message: `Server ${error}`})
    }
}

const deletePrivate = async (req, res) => {
    try {
        const { id } = req.body;
        if(!id) {
            return res.status(400).json({ message: "All fields are required."})
        }
        const private = await Private.findByIdAndDelete(id)
        res.status(201).json({ message: "Successfully deleted", private})
    } catch (error) {
        res.status(500).json({ message: `Server ${error}`})
    }
}

module.exports = {
    CreatePrivate,
    getAllPrivates,
    deletePrivate,
    getPrivateWithId
}