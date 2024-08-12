const express = require('express');
const router = express.Router();
const { url_model } = require("../models/url");
const urlController = require('../controllers/url');
const { authLoggedInUser } = require("../middlewares/auth");
const { getIpInfo } = require('../service/getIpInfo');
const { getCurrentDateInfo } = require('../service/getCurrentDateInfo');

// URL routes
router.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Linkify Api Platform!",
        source_code: "https://github.com/ShreyasPrabhu26/Linkify-Backend"
    })
})

router.post('/url/shorten', authLoggedInUser, urlController.handleGenerateNewShortURL);
router.get('/url/analytics/:shortId', authLoggedInUser, urlController.handleGetAnalytics);

router.get("/:shortId", async (req, res) => {
    try {
        let { shortId } = req.params;

        // Validate shortId length
        if (shortId.length !== 10) {
            return res.status(400).json({ "Error": "Invalid Short URL" });
        }

        const currentTimeInfo = getCurrentDateInfo();

        // Get the client IP address
        const clientIp = req.clientIp;

        // Parse the user-agent header
        const ua = req.useragent;

        const ipInformationJson = await getIpInfo(clientIp);

        let country, region, regionName, city, zip, lat, lon, isp, org;

        if (ipInformationJson?.status != "fail") {
            ({ country, region, regionName, city, zip, lat, lon, isp, org } = ipInformationJson);
        }

        const entry = await url_model.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: currentTimeInfo,
                        ip_address: clientIp,
                        country: country || "Not Found",
                        region: region || "Not Found",
                        regionName: regionName || "Not Found",
                        city: city || "Not Found",
                        zip: zip || "Not Found",
                        lat: lat || "Not Found",
                        lon: lon || "Not Found",
                        isp: isp || "Not Found",
                        org: org || "Not Found",
                        device: ua.device || 'Unknown',
                        os: ua.os || 'Unknown',
                        browser: ua.browser || 'Unknown'
                    }
                }
            }
        );

        if (!entry) {
            return res.status(404).json({ "Error": "URL not found" });
        }

        // Validate and prepare the redirect URL
        const redirectURL = /^https?:\/\//i.test(entry.redirectURL) ? entry.redirectURL : `http://${entry.redirectURL}`;

        // Redirect to the correct URL
        return res.redirect(302, redirectURL);

    } catch (error) {
        return res.status(500).send(`Internal Server Error ${error}`)
    }
})

module.exports = router;