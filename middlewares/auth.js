const { getUser } = require('../service/auth');

async function checkAuth(req, res, next) {
    const userAccessToken = req.cookies["access-token"];
    const user = getUser(userAccessToken);
    if (user) {
        req.user = user;
    }
    next();
}

async function authLoggedInUser(req, res, next) {
    const userAccessToken = req.cookies["access-token"];
    const user = getUser(userAccessToken);

    if (!userAccessToken || !user) return res.status(400).json({
        message: "Please Login to use this service."
    })

    req.user = user;
    next();
}


module.exports = {
    authLoggedInUser,
    checkAuth,
}