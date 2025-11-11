const Visit = require("../models/Visit");

module.exports = async function(req, res, next) {
  try {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() 
               || req.connection?.remoteAddress 
               || req.socket?.remoteAddress 
               || "::1";
    const userAgent = req.headers["user-agent"] || "unknown";
    const path = req.originalUrl;

    let visit = await Visit.findOne({ ip, userAgent });

    if (!visit) {
      visit = new Visit({
        ip,
        userAgent,
        paths: [path],
        count: 1,
        lastVisited: new Date()
      });
    } else {
      visit.count = (visit.count || 0) + 1;
      visit.lastVisited = new Date();
      visit.paths = visit.paths || [];
      if (!visit.paths.includes(path)) visit.paths.push(path);
    }

    await visit.save();
    next();
  } catch (err) {
    console.error(err);
    next();
  }
};
