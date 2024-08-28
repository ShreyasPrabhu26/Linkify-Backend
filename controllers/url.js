const ShortUniqueId = require('short-unique-id');
const { randomUUID: randomID } = new ShortUniqueId({ length: 10 });
const { url_model } = require("../models/url");
const { getUser } = require('../service/auth');

async function handleGenerateNewShortURL(req, res) {
    const { redirectURL } = req.body;

    if (!redirectURL) {
        return res.status(400).json({ error: "URL cannot be empty" });
    }

    const shortId = randomID();

    await url_model.create({
        shortId,
        redirectURL,
        createdBy: req.user._id
    });

    return res.json({ shortId });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await url_model.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: 'Short URL not found' });
    }

    const response = {
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory.map(entry => ({
            timestamp: entry.timestamp,
            ip_address: entry.ip_address,
            device: entry.device,
            os: entry.os,
            browser: entry.browser,
            county: entry.county,
            region: entry.region,
            regionName: entry.regionName,
            city: entry.city,
            lat: entry.lat,
            lon: entry.lon,
            isp: entry.isp,
            org: entry.org
        }))
    };

    return res.json(response);
}

async function handleGetAllUrlInfo(req, res) {
    const token = req.cookies['access-token'];
    const user = getUser(token);
    req.user = user;

    if (req.user) {
        const allUrlInformation = await url_model.find({ createdBy: req.user._id });
        res.status(200).send(allUrlInformation)
    } else {
        res.status(500).json({
            error: "Internal Sever Error."
        })
    }
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleGetAllUrlInfo
};