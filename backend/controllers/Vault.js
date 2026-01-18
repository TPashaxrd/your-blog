const Vault = require("../models/Vault.js")

const CreateVault = async (req, res) => {
    try {
        const { number, name } = req.body;
        if(!number || !name) {
            return res.status(400).json({ message: "All fields are required."})
        }
        const createVault = new Vault({
            number,
            name
        })

        await createVault.save()

        res.status(201).json({ message: "Successfully created.", createVault})
    } catch (error) {
        res.status(500).json({ message: "Error Message: ", error})
    }
}

const getVault = async (req, res) => {
    try {
        const allVaults = await Vault.find()
        res.status(201).json(allVaults)
    } catch (error) {
        res.status(500).json({ message: "Error Message: ", error})
    }
}

const getVaultBySearch = async (req, res) => {
    try {
        const { thing } = req.body;
        if(!thing) {
            return res.status(400).json({ message: "All fields are required." })
        }
        const here = await Vault.findOne({ thing })
        
        res.status(201).json(here)
    } catch (error) {
        res.status(500).json({ message: "Error Message: ", error})
    }
}

const deleteVaultById = async (req, res) => {
    try {
        const { id } = req.body;
        if(!id) {
            return res.status(201).json({ message: "All fields are required."})
        }
        const del = await Vault.findByIdAndDelete(id)

        res.status(201).json({ message: `Successfully deleted, ${del}`})
    } catch (error) {
        res.status(500).json({ message: "Error Message: ", error})
    }
}

module.exports = {
    CreateVault,
    getVault,
    getVaultBySearch,
    deleteVaultById
}