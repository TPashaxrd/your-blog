// {
//     "user": {
//         "_id": "696dfda....",
//         "name": "Toprak",
//         "country": "TR",
//         "email": "contact@toprak.xyz",
//         "userRole": "User",
//         "__v": 0
//     }
// }

const mongoose = require("mongoose")

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        default: "User"
    },
    IP_Address: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Users", UsersSchema)