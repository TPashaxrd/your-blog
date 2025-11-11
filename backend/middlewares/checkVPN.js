const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config(); 

const checkVPN = async (req, res, next) => {
  try {
    const ip = (req.ip || req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (!ip) return next();

    const { data } = await axios.get(`https://vpnapi.io/api/${ip}?key=${process.env.VPN_KEY}`, {
      timeout: 2000
    });

    const security = data?.security || {};
    if (security.vpn || security.is_vpn || security.tor || security.is_tor || security.proxy || security.is_proxy) {
      return res.status(403).json({ message: "Do not use VPN/TOR/PROXY. Itsn't dark web site, you should use your home IP Address!" });
    }

    return next();
  } catch (error) {
    console.error("VPN Checking Failed:", error?.message || error);
    return next();
  }
};

module.exports = checkVPN;