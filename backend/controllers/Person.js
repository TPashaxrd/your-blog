const Person = require("../models/Person");

const CreatePerson = async (req, res) => {
    try {
        const { name, username, IDs, location, interested, links } = req.body;
        if(!name || !username) {
            return res.status(400).json({ message: "All fields are required."})
        }
        const newPerson = await Person({
            name,
            username,
            IDs,
            location,
            interested,
            links
        })

        await newPerson.save()

        res.status(201).json({ message: "New Person has been added.", newPerson })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const getPersonById = async (req, res) => {
    try {
        const { personId } = req.body;
        if(!personId) {
            return res.status(400).json({ message: "Person ID is required."})
        }
        const person = await Person.findById(personId)
        if(!person) {
            return res.status(400).json({ message: "Person not found."})
        }
        
        res.status(201).json(person)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const getAllPersons = async (req, res) => {
    try {
        const allPersons = await Person.find()
        res.status(201).json(allPersons)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const deletePersonById = async (req, res) => {
    try {
        const { personId } = req.body;
        if(!personId) {
            return res.status(400).json({ message: "PersonID is requried."})
        }
        const person = await Person.findById(personId)
        if(!person) {
            return res.status(400).json({ message: "Person isn't found."})
        }
        const deletePerson = await Person.findByIdAndDelete(personId)
        
        res.status(201).json({ message: "The person has been deleted.", deletePerson})
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

module.exports = {
    CreatePerson,
    getAllPersons,
    getPersonById,
    deletePersonById
}