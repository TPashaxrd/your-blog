const Visit = require("../models/Visit");


exports.getAllStats = async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments();

    const uniqueIPs = await Visit.distinct("ip");
    const uniqueVisitors = uniqueIPs.length;

    const visitsByIP = await Visit.aggregate([
    {
      $group: {
        _id: "$ip",
        visits: { $sum: "$count" },
        lastVisit: { $max: "$lastVisited" },
        userAgents: { $addToSet: "$userAgent" },
        paths: { $push: "$paths" }
      }
    },
    {
      $project: {
        _id: 1,
        visits: 1,
        lastVisit: 1,
        userAgents: 1,
        paths: { $reduce: { input: "$paths", initialValue: [], in: { $setUnion: ["$$value", "$$this"] } } }
      }
    },
    { $sort: { visits: -1 } }
  ]);


    const dailyVisits = await Visit.aggregate([
      {
        $group: {
          _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    const monthlyVisits = await Visit.aggregate([
      {
        $group: {
          _id: { month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    res.json({
      totalVisits,
      uniqueVisitors,
      visitsByIP,
      dailyVisits,
      monthlyVisits
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getTotalVisits = async (req, res) => {
  try {
    const total = await Visit.countDocuments();
    res.json({ total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUniqueVisitors = async (req, res) => {
  try {
    const uniqueIPs = await Visit.distinct("ip");
    res.json({ uniqueVisitors: uniqueIPs.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getVisitsByIP = async (req, res) => {
  try {
    const stats = await Visit.aggregate([
      {
        $group: {
          _id: "$ip",
          visits: { $sum: 1 },
          lastVisited: { $max: "$lastVisited" }
        }
      },
      { $sort: { visits: -1 } }
    ]);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getDailyVisits = async (req, res) => {
  try {
    const daily = await Visit.aggregate([
      {
        $group: {
          _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);
    res.json(daily);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getMonthlyVisits = async (req, res) => {
  try {
    const monthly = await Visit.aggregate([
      {
        $group: {
          _id: { month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);
    res.json(monthly);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};