const adminUser = {
    username: "admin",
    password: "admin"
}

const admin = (req, res, next) => {
    const { username, password } = req.headers;
    if(!username || !password) return res.status(401).json({ message: "Admin credentials required."})
    if(username === adminUser.username && password == adminUser.password) {
        next()
    } else {
        res.status(403).json({ message: "Forbidden." })
    }
}