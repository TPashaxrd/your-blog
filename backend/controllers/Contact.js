const express = require("express");
const Contact = require("../models/Contact");

const createContact = async(req, res) => {
    try {
        const { title, message, email, IP_Address } = req.body;
        if(!title || !message || !email || !IP_Address) {
            return res.status(400).json({ message: "All fields are required." })
        }
        if (email.length < 11) {
            return res.status(400).json({ message: "Your email cannot be less than 11 characters." })
        }
        if(message.length < 6) {
            return res.status(400).json({ message: "Your message is less." })
        }
        
        const contact = new Contact({
            title,
            message,
            email,
            IP_Address
        })

        await contact.save()

        res.status(201).json(contact)
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error}`})
    }
}

const showAllContacts = async(req, res) => {
    try {
        const contacts = await Contact.find()
        res.status(201).json(contacts)
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error}`})
    }
}

module.exports = { createContact, showAllContacts }