const { getUser } = require('../service/auth');
const JWT_SECRET = process.env.JWT_SECRET_KEY


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }
    const token = authHeader.split(' ')[1];
    try {
        user = getUser(token);

        if (!user) {
            throw new Error;
        }
        req.user = user;
        next();

    } catch (err) {
        return res.status(403).json({
            message: "Please Login to use this service."
        });
    }
};


module.exports = {
    authMiddleware,
}