require("dotenv").config()

const authMiddleware = (req, res, next) => {
    try {
      const { username, password } = req.body;
      const ADMIN_USERNAME = process.env.USERNAME
      const ADMIN_PASSWORD = process.env.PASSWORD

      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        next();
      } else {
        res.status(401).json({ message: "Unauthorized: Wrong username & password." });
      }
    } catch (error) {
      res.status(500).json({ message: `Server error: ${error}` });
    }
  };
  
  module.exports = authMiddleware;