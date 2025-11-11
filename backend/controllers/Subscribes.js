const Subscribe = require("../models/Subscribes");

const beSubs = async(req, res) => {
    try {
        const { email, IP_Address } = req.body;
        if(!email || !IP_Address) {
            return res.status(400).json({ message: "All fields are required."})
        }
        const existing = await Subscribe.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });
        const subs = new Subscribe({
            email,
            IP_Address
        })

        await subs.save()

        res.status(201).json(subs)
    } catch (error) {
        res.status(500).json({ message: `${error}`})
    }
}

const showSubs = async(req, res) => {
    try {
        const subs = await Subscribe.find()
        res.status(201).json(subs)
    } catch (error) {
        res.status(500).json({ message: "Subs" })
    }
}

const deleteSubs = async(req, res) => {
    try {
        const { id } = req.body;
        if(!id) {
            return res.status(400).json({ message: "ID is required."})
        }
        const deleteSubscribe = await Subscribe.findByIdAndDelete(id)
        if(!deleteSubscribe) {
            return res.status(400).json({ message: "Subscribe not found."})
        }
        res.status(201).json({ message: "Successfully has been deleted.", deleteSubscribe})
    } catch (error) {
        
    }
}

module.exports = { beSubs, showSubs, deleteSubs }