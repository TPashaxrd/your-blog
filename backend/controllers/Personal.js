const Personal = require("../models/Personal");

const CreatePersonal = async (req, res) => {
    try {
        const { title, message, links } = req.body;
        // no if

        const newPersonal = new Personal({
            title,
            message,
            links
        })

        await newPersonal.save()

        res.status(201).json({ message: "Successfully new note added.", newPersonal})
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const getAllPersonals = async (req, res) => {
    try {
        const allPersonals = await Personal.find()
        res.status(201).json(allPersonals)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

// const deletePersonalNote = async(req, res) => {
//     try {
//         const { personalId, title, message, link } = req.body;
//         if(!personalId) {
//             return res.status(400).json({ message: "All fields are required."})
//         }
//         const personal = await Personal.findById(personalId)
//         if(!personal) {
//             return res.status(500).json({ message: "ID not found."})
//         }
//         const updatePerson = await Personal.findByIdAndUpdate(personal, {

//         })
//     } catch (error) {
        
//     }
// }

const deletePersonalById = async(req, res) => {
    try {
        const { personalId } = req.body;
        if(!personalId) {
            return res.status(400).json({ message: "All fields are required."})
        }
        const personal = await Personal.findById(personalId)
        if(!personalId) {
            return res.status(400).json({ message: "Personal ID is valid."})
        }

        const deletePersonal = await Personal.findByIdAndDelete(personal)

        res.status(201).message({ message: "Successfully personal deleted.", deletePersonal})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getPersonalById = async(req, res) => {
    try {
        const { personalId } = req.body;
        if(!personalId) {
            return res.status(400).json({ message: "Personal ID is must." })
        }
        const personal = await Personal.findById(personalId)
        if(!personal){
            return res.status(400).json({ message: "Personal not found."})
        }

        res.status(201).json(personal)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

module.exports = {
    CreatePersonal,
    getAllPersonals,
    deletePersonalById,
    getPersonalById
}