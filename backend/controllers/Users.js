const bcrypt = require("bcrypt");
const User = require("../models/User");

const CreateAuth = async (req, res) => {
    try {
        const { name, country, password, email } = req.body;
        if(!name || !country || !password || !email) {
            console.log(email)
            return res.status(400).json({ message: "All fields are required."})
        }
        const IP_Address = req.headers['cf-connecting-ip'] ||
            req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            req.headers['x-real-ip'] ||
            req.ip ||
            req.socket.remoteAddress;

        const existing = await User.findOne({ email })
        if(existing) return res.status(400).json({ message: "Email already exists"})
        const hashed = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            country,
            password: hashed,
            email,
            IP_Address
        })

        await newUser.save()

        req.session.userId = newUser._id;

    res.status(201).json({
        message: "Successfully registered.",
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            country: newUser.country
        }
    });
    } catch (error) {
        res.status(500).json({ message: `System Error`})
        console.log(error)
    }
}

const Logout = (req, res) => {
  if (!req.session) {
    return res.json({ message: "Already logged out" });
  }

  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Logout error" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required."})
        }
        const user = await User.findOne({ email })
        if(!user) return res.status(400).json({ message: "Invalid credentials" })
        const match = await bcrypt.compare(password, user.password)
        if(!match) return res.status(400).json({ message: "Invalid credentials" })
        req.session.userId = user._id;
        res.json({ message: "Logged in", user: { id: user._id, username: user.username, email}})
    } catch (error) {
        res.status(500).json({ message: `System Error`})
        console.log(error)
    }
}

const me = async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user = await User
      .findById(req.session.userId)
      .select("-password -IP_Address");

    if (!user) {
      req.session.destroy(() => {});
      res.clearCookie("connect.sid");
      return res.status(401).json({ message: "Session expired" });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
    CreateAuth,
    Logout,
    Login,
    me
}